const express = require('express');
const bodyParser = require('body-parser');
const uuid = require("uuid");
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3000',
  'http://localhost:8080',
  'http://bomberman.matejsladek.com',
  'https://bomberman-238517.appspot.com'];
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

function movePlayer(data) {
  io.emit('movePlayer', data);
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (room.id === data.roomId) {
      for (let j = 0; j < room.players.length; j++) {
        const player = room.players[j];
        if (player.id === data.player.playerId) {
          player.x = data.player.x;
          player.y = data.player.y;
        }
      }
    }
  }
}

function placeBomb(data) {
  io.emit('placeBomb', data);
}

function playerDead(data) {
  io.emit('playerDead', data);
}

function disconnect(socket) {
  console.log('disconnect');
  const playerId = socket.myId;
  for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      removePlayer(room.id, playerId);
  }
}

function login(socket, data) {
  console.log('login', data);
  socket.myId = data.myId;
}

io.on('connection', function (socket) {
  socket.on("login", (data) => login(socket, data));
  socket.on("movePlayer", movePlayer);
  socket.on('disconnect', () => disconnect(socket));
  socket.on('placeBomb', placeBomb);
  socket.on('playerDead', playerDead);
});

const rooms = [{
  id: 1,
  state: 'pending',
  size: 4,
  players: [],
},
  {
    id: 2,
    state: 'pending',
    size: 4,
    players: [],
  }];

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/joinRoom/:roomId/:playerId', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const playerId = req.params.playerId;
  console.log('joinRoom', playerId);
  for (let i = 0; i < rooms.length; i++) {
    const id = rooms[i].id;
    if (id === roomId) {
      const exists = rooms[i].players.filter(player => player.id === playerId);
      if (exists.length > 0) continue;
      rooms[i].players.push({
        id: playerId,
        alive: true,
        pos: {
          x: 0,
          y: 0,
        }
      });
    }
  }
  io.emit('changePlayers', rooms);
  res.json(rooms);
});

function resetGame(idx){
  for (let i = 0; i < rooms.length; i++) {
    const id = rooms[i].id;
    if (id === idx) {
      rooms[i].state = "pending";
    }
  }
}

function removePlayer(roomId, playerId) {
  for (let i = 0; i < rooms.length; i++) {
    const id = rooms[i].id;
    if (id === roomId) {
      const players = [];
      for (let j = 0; j < rooms[i].players.length; j++) {
        if (rooms[i].players[j].id !== playerId) {
          players.push(rooms[i].players[j]);
        }
      }
      rooms[i].players = players;
      if(players.length === 0){
        resetGame(id);
      }
    }
  }
  io.emit('playerDead', {
    roomId,
    playerId,
  });
  io.emit('changePlayers', rooms);
}

app.get('/leaveRoom/:roomId/:playerId', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  const playerId = req.params.playerId;
  removePlayer(roomId, playerId);
  res.json(rooms);
});

app.get('/startGame/:roomId', (req, res) => {
  const roomId = parseInt(req.params.roomId);
  for (let i = 0; i < rooms.length; i++) {
    const id = rooms[i].id;
    if (id === roomId) {
      rooms[i].state = 'started';
    }
  }
  const id = uuid.v4();
  io.emit('startGame', {roomId, id});
  res.sendStatus(200);
});

app.get('/movePlayer', (req, res) => {
  const roomId = req.body;
  for (let i = 0; i < rooms.length; i++) {
    const id = rooms[i].id;
    if (id === roomId) {
      rooms[i].state = 'started';
    }
  }
  io.emit('startGame', {roomId});
  res.sendStatus(200);
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));