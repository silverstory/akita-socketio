const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const path = require('path');

function postNotification(port, notify) {
  const body = JSON.stringify(notify);

  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: '127.0.0.1',
      port,
      path: '/send-notification',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, response => {
      let responseBody = '';
      response.setEncoding('utf8');
      response.on('data', chunk => {
        responseBody += chunk;
      });
      response.on('end', () => resolve({ status: response.statusCode, body: responseBody }));
      response.on('error', reject);
    });

    request.setTimeout(5000, () => request.destroy(new Error('Timed out waiting for the server')));
    request.on('error', reject);
    request.end(body);
  });
}

function verifyLog(logPath, notify) {
  const csv = fs.readFileSync(logPath, 'utf8');
  const header = 'received_at_utc,id,profileid,name,gender,imagepath,distinction,gate,completed,payload_json';
  assert(csv.startsWith(header + '\r\n'), 'Unexpected CSV header');

  const idCell = ',"' + notify.id + '",';
  const rowOffset = csv.indexOf(idCell);
  assert(rowOffset !== -1, 'No CSV row found for ' + notify.id);
  assert(csv.indexOf(idCell, rowOffset + idCell.length) === -1, 'Duplicate CSV rows for ' + notify.id);

  const timestampOffset = csv.lastIndexOf('\r\n', rowOffset) + 2;
  const timestamp = csv.slice(timestampOffset, rowOffset);
  assert(/^"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"$/.test(timestamp), 'Expected a UTC timestamp');

  const cells = [
    notify.id, notify.profileid, notify.name, notify.gender, notify.imagepath,
    notify.distinction, notify.gate, notify.completed, JSON.stringify(notify)
  ];
  const expectedRow = ',' + cells.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',') + '\r\n';
  assert(csv.startsWith(expectedRow, rowOffset), 'CSV row did not preserve the test payload');
}

async function main() {
  const portArgument = process.argv[2] || '8000';
  const port = Number(portArgument);
  if (!/^\d+$/.test(portArgument) || port < 1 || port > 65535) {
    throw new Error('Usage: node scripts/test-notification-log.js [port]');
  }

  const notify = {
    id: 'notification-csv-test-' + crypto.randomBytes(8).toString('hex'),
    profileid: '000123',
    name: 'CSV test, "quoted"\r\n\u6e2c\u8a66',
    gender: 'test',
    imagepath: 'https://example.invalid/test.jpg',
    distinction: 'TEST',
    gate: 'TEST_GATE',
    completed: false,
    extra: { tags: ['comma, quote"', 'second line\nvalue'], count: 2 }
  };
  const response = await postNotification(port, notify);
  assert.strictEqual(response.status, 200, 'Expected HTTP 200, received ' + response.status);
  assert.deepStrictEqual(JSON.parse(response.body), notify, 'Unexpected response body');

  const logPath = path.join(__dirname, '..', 'logs', 'send-notification.csv');
  verifyLog(logPath, notify);
  console.log('Verified HTTP response and one CSV row for ' + notify.id);
  console.log(logPath);
}

main().catch(error => {
  console.error('Notification log test failed: ' + error.message);
  process.exitCode = 1;
});
