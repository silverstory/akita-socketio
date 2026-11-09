const { constants, promises: fs } = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, 'logs');
const logFile = path.join(logDirectory, 'send-notification.csv');
const fields = ['id', 'profileid', 'name', 'gender', 'imagepath', 'distinction', 'gate', 'completed'];
const header = ['received_at_utc', ...fields, 'payload_json'].join(',') + '\r\n';
let pendingWrite = Promise.resolve();
let rollbackFailure;

function csvCell(text) {
  return '"' + text.replace(/"/g, '""') + '"';
}

function notificationField(notify, field) {
  if (notify == null || !Object.prototype.hasOwnProperty.call(notify, field)) {
    return '';
  }

  const value = notify[field];
  if (typeof value === 'string') {
    // Reduce spreadsheet formula injection risk while preserving the original in payload_json.
    return /^[\s\u0000-\u001f]*[=+@\-＝＋－＠\t\r\n]/u.test(value) ? "'" + value : value;
  }
  return value == null ? '' : JSON.stringify(value);
}

async function appendRow(row) {
  if (rollbackFailure) {
    throw rollbackFailure;
  }

  await fs.mkdir(logDirectory, { recursive: true });
  // A Windows append-only handle cannot truncate a partial write.
  const file = await fs.open(logFile, constants.O_CREAT | constants.O_WRONLY, 0o600);

  try {
    const stats = await file.stat();
    if (!stats.isFile()) {
      throw new Error('Notification log path must refer to a regular file');
    }
    const { size } = stats;
    const data = Buffer.from(size === 0 ? header + row : row, 'utf8');
    let written = 0;

    try {
      while (written < data.length) {
        const { bytesWritten } = await file.write(data, written, data.length - written, size + written);
        if (bytesWritten === 0) {
          throw new Error('Notification log write made no progress');
        }
        written += bytesWritten;
      }
      await file.sync();
    } catch (error) {
      // A failed append can leave part of a row on disk.
      try {
        await file.truncate(size);
        await file.sync();
      } catch (rollbackError) {
        // Stop appending if the file may end in an incomplete record.
        rollbackFailure = new Error('Notification log append failed (' + error.message +
          ') and rollback failed (' + rollbackError.message + ')');
        throw rollbackFailure;
      }
      throw error;
    }
  } finally {
    await file.close();
  }
}

function logNotification(notify) {
  const cells = [
    new Date().toISOString(),
    ...fields.map(field => notificationField(notify, field)),
    JSON.stringify(notify) || ''
  ];
  const row = cells.map(csvCell).join(',') + '\r\n';

  // Serialize header checks and appends across both HTTP listeners.
  const write = pendingWrite.then(() => appendRow(row));
  pendingWrite = write.catch(() => {});
  return write;
}

module.exports = logNotification;
