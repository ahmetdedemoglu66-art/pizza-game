const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let dukkan = {
    oyuncular: {},
    toplamPara: 0
};

io.on('connection', (socket) => {
    console.log('Yeni ortak: ' + socket.id);
    dukkan.oyuncular[socket.id] = { x: 200, y: 300, pizzaVar: false };

    socket.on('hareket', (data) => {
        if (dukkan.oyuncular[socket.id]) {
            dukkan.oyuncular[socket.id] = data;
            io.emit('guncelle', dukkan);
        }
    });

    socket.on('paraKazan', (miktar) => {
        dukkan.toplamPara += miktar;
        io.emit('guncelle', dukkan);
    });

    socket.on('disconnect', () => {
        delete dukkan.oyuncular[socket.id];
        io.emit('guncelle', dukkan);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Dükkan açık!"));
