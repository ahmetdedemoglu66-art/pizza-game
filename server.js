const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// DÜKKANIN ORTAK DURUMU
let dukkanDurumu = {
    toplamPara: 0,
    aktifMusteriler: [],
    acilmisMasalar: 1,
    pizzalar: []
};

let oyuncular = {};

io.on('connection', (socket) => {
    oyuncular[socket.id] = { x: 200, y: 400, pizzaVar: false };
    
    // Bağlanan yeni oyuncuya dükkanın o anki halini gönder
    socket.emit('baslangic', dukkanDurumu);

    socket.on('hareket', (data) => {
        if (oyuncular[socket.id]) {
            oyuncular[socket.id] = data;
            io.emit('guncelle', { oyuncular, dukkanDurumu });
        }
    });

    socket.on('paraKazan', (miktar) => {
        dukkanDurumu.toplamPara += miktar;
        io.emit('guncelle', { oyuncular, dukkanDurumu });
    });

    socket.on('disconnect', () => {
        delete oyuncular[socket.id];
        io.emit('guncelle', { oyuncular, dukkanDurumu });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Sunucu hazır!"));
