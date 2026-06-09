const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname)));

// Room storage
const rooms = {};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('createRoom', ({ username }) => {
    let code;
    do { code = generateCode(); } while (rooms[code]);

    rooms[code] = {
      code,
      host: socket.id,
      players: {
        [socket.id]: { id: socket.id, username, hp: 100, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0 }, state: 'idle', score: 0 }
      },
      started: false
    };

    socket.join(code);
    socket.roomCode = code;
    socket.username = username;

    socket.emit('roomCreated', { code, players: rooms[code].players });
    console.log(`Room ${code} created by ${username}`);
  });

  socket.on('joinRoom', ({ code, username }) => {
    const room = rooms[code];
    if (!room) { socket.emit('joinError', { message: 'Room not found.' }); return; }
    if (Object.keys(room.players).length >= 4) { socket.emit('joinError', { message: 'Room is full (max 4 players).' }); return; }
    if (room.started) { socket.emit('joinError', { message: 'Game already in progress.' }); return; }

    room.players[socket.id] = { id: socket.id, username, hp: 100, pos: { x: 2, y: 0, z: 2 }, rot: { x: 0, y: 0 }, state: 'idle', score: 0 };
    socket.join(code);
    socket.roomCode = code;
    socket.username = username;

    socket.emit('roomJoined', { code, players: room.players, isHost: false });
    socket.to(code).emit('playerJoined', { player: room.players[socket.id] });
    console.log(`${username} joined room ${code}`);
  });

  socket.on('startGame', () => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    room.started = true;
    io.to(code).emit('gameStarted', { missionId: 'mission_01' });
  });

  socket.on('playerUpdate', (data) => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room || !room.players[socket.id]) return;
    Object.assign(room.players[socket.id], data);
    socket.to(code).emit('playerUpdated', { id: socket.id, ...data });
  });

  socket.on('playerShoot', (data) => {
    const code = socket.roomCode;
    if (!rooms[code]) return;
    socket.to(code).emit('playerShot', { id: socket.id, ...data });
  });

  socket.on('playerDamage', ({ targetId, amount }) => {
    const code = socket.roomCode;
    const room = rooms[code];
    if (!room || !room.players[targetId]) return;
    room.players[targetId].hp = Math.max(0, (room.players[targetId].hp || 100) - amount);
    io.to(code).emit('playerDamaged', { id: targetId, hp: room.players[targetId].hp });
  });

  socket.on('zombieSync', (data) => {
    const code = socket.roomCode;
    if (!rooms[code] || rooms[code].host !== socket.id) return;
    socket.to(code).emit('zombieSynced', data);
  });

  socket.on('chatMessage', ({ text }) => {
    const code = socket.roomCode;
    if (!rooms[code]) return;
    io.to(code).emit('chatMessage', { username: socket.username, text });
  });

  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    const room = rooms[code];
    delete room.players[socket.id];
    socket.to(code).emit('playerLeft', { id: socket.id });

    if (Object.keys(room.players).length === 0) {
      delete rooms[code];
      console.log(`Room ${code} deleted (empty)`);
    } else if (room.host === socket.id) {
      room.host = Object.keys(room.players)[0];
      io.to(code).emit('hostChanged', { newHost: room.host });
    }
    console.log(`${socket.username || socket.id} disconnected from room ${code}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Last Light Protocol server running on port ${PORT}`));
