const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const Constant = require("./Constants");

app.use(logger('dev'));
app.use(cors());
app.get("/", (_, res) => {
  res.redirect('https://etuong.github.io/who-am-i/');
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const port = process.env.PORT || Constant.PORT;

server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

const io = require('socket.io')(server, {
  cors: {
    origin: ["http://localhost:8080", "https://etuong.github.io"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 30000 // Shut down socket after 30 minutes of inactivity
});

io.on('connection', (socket) => {
  // Ping a response from handshake
  socket.emit('connected');

});

process.on("exit", function (code) {
  server.close();
  console.log("Server exit", code);
});