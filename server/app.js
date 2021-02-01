const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");

const port = 8000;

// body-parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

let list = [];

let highlighted = [];

let overall = 0;
let visitors = 0;
let tourists = 0;
let others = 0;

let gate7 = 0;
let gate6 = 0;
let gate4 = 0;
let gate2 = 0;

let entirelist = [];

io.on('connection', function (socket) {

  // livefeed

  socket.emit('list', {
    type: 'SET',
    data: list
  });

  socket.on('list:feed', item => {
    console.log('livefeed');
    console.log(item);
    // limits list items to only 4 items
    const rightmostlist = list.slice(0, 3);
    list = [item, ...rightmostlist];

    io.sockets.emit('list', {
      type: 'SET',
      data: list
    });
  });

  socket.on('list:add', item => {
    list.push(item);
    io.sockets.emit('list', {
      type: 'ADD',
      data: item
    });
  });

  socket.on('list:remove', id => {
    list = list.filter(item => item.id !== id);

    io.sockets.emit('list', {
      type: 'REMOVE',
      ids: id
    });
  });

  socket.on('list:toggle', id => {
    list = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          completed: !item.completed
        }
      }
      return item;
    });

    io.sockets.emit('list', {
      type: 'UPDATE',
      ids: id,
      data: list.find(current => current.id === id)
    });
  })

  // end livefeed

  // entirelist

  socket.emit('entirelist', {
    type: 'SET',
    data: entirelist
  });

  // socket.on('entirelist:feed', item => {

  //   // limits list items to only 4 items
  //   const rightmostlist = entirelist.slice(0,3);
  //   entirelist = [item, ...rightmostlist];

  //   io.sockets.emit('entirelist', {
  //     type: 'SET',
  //     data: entirelist
  //   });
  // });

  socket.on('entirelist:add', item => {
    console.log('entirelist');
    console.log(item);

    entirelist = [item, ...entirelist];
    io.sockets.emit('entirelist', {
      type: 'SET',
      data: entirelist
    });

    // old entirelist add item code

    // entirelist = [item, ...entirelist];
    // io.sockets.emit('entirelist', {
    //   type: 'ADD',
    //   data: item
    // });

    // /*
    // entirelist.push(item);
    // io.sockets.emit('entirelist', {
    //   type: 'ADD',
    //   data: item
    // });
    // */

    // end old entirelist add item code

  });

  socket.on('entirelist:remove', id => {
    entirelist = entirelist.filter(item => item.id !== id);

    io.sockets.emit('entirelist', {
      type: 'REMOVE',
      ids: id
    });
  });

  socket.on('entirelist:toggle', id => {
    entirelist = entirelist.map(item => {
      if (item.id === id) {
        return {
          ...item,
          completed: !item.completed
        }
      }
      return item;
    });

    io.sockets.emit('entirelist', {
      type: 'UPDATE',
      ids: id,
      data: entirelist.find(current => current.id === id)
    });
  })

  // end entirelist

});

// Send Notification API
app.post('/send-notification', (req, res) => {
  // const notify = {data: req.body};
  const notify = req.body;
  console.log(notify);

  // Updates Live Feed Notification

  // limits list items to only 4 items
  const rightmostlist = list.slice(0, 3);
  list = [notify, ...rightmostlist];
  io.sockets.emit('list', {
    type: 'SET',
    data: list
  });

  // Updates Entire List Notification
  entirelist = [notify, ...entirelist];
  io.sockets.emit('entirelist', {
    type: 'SET',
    data: entirelist
  });

  res.send(notify);
});

server.listen(port);

module.exports = app;


// /// test
// /// test
// const express = require('express');
// const bodyParser = require("body-parser");
// const app = express();
// const port = 8000;

// // body-parser
// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: false }));

// const notification = require('./routes/notification');
// app.use('/api', notification);

// const server = app.listen(port, () => {
//   console.log(`Server connection on  http://127.0.0.1:${port}`);  // Server Connnected
// });
// // Socket Layer over Http Server
// const socket = require('socket.io')(server);
// // On every Client Connection
// socket.on('connection', socket => {
//     console.log('Socket: client connected');
// });

// /// end test
// /// end test


///  askndklfhdskjfhs sdfhds jhdslf hdsljkhdsljf hsdjlf hlsdjfh lsdjfh dsjlf h
///  dsf kfhsdjkf hlsd fhksd kddlhsjdfgweLURWO;FHsfhdsfh sd;fhasd;fhk.sdhhdfs

// // worked

// const express = require('express');
// const bodyParser = require("body-parser");

// const app = express();
// const port = 8000;

// // body-parser
// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: false }));

// const notification = require('./routes/notification');
// app.use('/api', notification);

// app.listen(port, () => console.log(`listening on http://localhost:${port}`));