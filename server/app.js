const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

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

    // limits list items to only 4 items
    const rightmostlist = list.slice(0,3);
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
    entirelist.push(item);
    io.sockets.emit('entirelist', {
      type: 'ADD',
      data: item
    });
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

server.listen(8000);

module.exports = app;