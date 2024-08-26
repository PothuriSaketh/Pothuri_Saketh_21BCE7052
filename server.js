const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

let gameState = initializeGameState(); // Initialize game state

wss.on('connection', ws => {
    ws.on('message', message => {
        const data = JSON.parse(message);
        handleGameEvent(ws, data);
    });

    ws.send(JSON.stringify({ type: 'game-initialization', gameState }));
});

function initializeGameState() {
    // Initialize the game state here
    return {};
}

function handleGameEvent(ws, data) {
    switch (data.type) {
        case 'player-move':
            if (isValidMove(data.move)) {
                updateGameState(data.move);
                broadcastGameState();
            } else {
                ws.send(JSON.stringify({ type: 'invalid-move', message: 'Invalid move' }));
            }
            break;
        // Handle other event types here
    }
}

function isValidMove(move) {
    // Implement the logic to validate a move
    return true;
}

function updateGameState(move) {
    // Implement the logic to update the game state based on a move
}

function broadcastGameState() {
    const message = JSON.stringify({ type: 'game-state-update', gameState });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
