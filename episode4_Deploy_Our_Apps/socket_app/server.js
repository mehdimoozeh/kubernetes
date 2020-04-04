const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', socket => {
  console.log('User connected :)');
  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.close();
  });

  socket.on('pingServer', () => {
    socket.emit('pingAnswer', String(new Date() + `, version: ${process.env.APP_NAME}`))
  })
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`LISTEN ON PORT ${PORT}`);
});

