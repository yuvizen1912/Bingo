const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const BingoBot = require('./botLogic'); // Import the Bot

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

let calledNumbers = [];
let gameInterval;
let computerRival; // Variable to hold the bot instance

io.on('connection', (socket) => {
    socket.on('startGame', () => {
        calledNumbers = [];
        computerRival = new BingoBot(); // Create a new bot for this game
        
        // Send the bot's card to the frontend so the player can see their rival
        socket.emit('botCardGenerated', computerRival.card);

        clearInterval(gameInterval);
        
        gameInterval = setInterval(() => {
            if (calledNumbers.length >= 75) return clearInterval(gameInterval);
            
            let nextNum;
            do {
                nextNum = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbers.includes(nextNum));
            
            calledNumbers.push(nextNum);
            io.emit('nextNumber', nextNum);

            // Let the bot check its card
            const botWins = computerRival.processNumber(nextNum);
            if (botWins) {
                io.emit('gameOver', 'The Computer won! Better luck next time.');
                clearInterval(gameInterval);
            }
        }, 3000);
    });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));