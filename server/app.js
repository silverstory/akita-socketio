const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let list = [];

io.on('connection', function (socket) {
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
});

server.listen(8000);

module.exports = app;