const boardSize = 5;
        let gameBoard = [];
        let currentPlayer = 'player1';
        let deletedCharacters = [];

        function initializeBoard() {
            console.log("Initializing board...");
            const boardElement = document.getElementById('game-board');
            boardElement.innerHTML = ''; // Clear the board

            gameBoard = []; // Reset the game board array

            for (let i = 0; i < boardSize; i++) {
                gameBoard[i] = [];
                for (let j = 0; j < boardSize; j++) {
                    gameBoard[i][j] = null; // Empty cell

                    const cellElement = document.createElement('div');
                    cellElement.className = 'cell';
                    cellElement.id = `cell-${i}-${j}`;
                    cellElement.addEventListener('click', () => handleCellClick(i, j));
                    boardElement.appendChild(cellElement);
                }
            }
        }


        function deployCharacters() {
            const player1Deployment = document.getElementById('player1-deployment').value.split(',');
            const player2Deployment = document.getElementById('player2-deployment').value.split(',');

            if (player1Deployment.length !== 5 || player2Deployment.length !== 5) {
                alert("Each player must deploy exactly 5 characters.");
                return;
            }

            // Deploy Player 1 characters
            for (let i = 0; i < 5; i++) {
                gameBoard[0][i] = `player1-${player1Deployment[i]}`;
            }

            // Deploy Player 2 characters
            for (let i = 0; i < 5; i++) {
                gameBoard[4][i] = `player2-${player2Deployment[i]}`;
            }

            updateBoard();
            document.getElementById('deploy-btn').disabled = true; // Disable deployment after setting up
        }

        function updateBoard() {
            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    const cellElement = document.getElementById(`cell-${i}-${j}`);
                    cellElement.textContent = gameBoard[i][j] ? gameBoard[i][j].split('-')[1].toUpperCase() : '';
                    cellElement.className = `cell ${gameBoard[i][j] ? gameBoard[i][j].split('-')[0] : ''}`;
                }
            }
        }

        function handleCellClick(x, y) {
            if (gameBoard[x][y] && gameBoard[x][y].startsWith(currentPlayer)) {
                const characterElement = document.getElementById(`cell-${x}-${y}`);
                characterElement.classList.add('selected');
                const validMoves = calculateValidMoves(x, y);
                if (currentPlayer === 'player1') {
                    characterElement.classList.add('player1');
                } else {
                    characterElement.classList.add('player2');
                }
                if (validMoves.length > 0) {
                    showMoveOptions(validMoves, x, y);
                }
            }
        }

        function calculateValidMoves(x, y) {
            const character = gameBoard[x][y].split('-')[1];
            const moves = [];

            if (character.startsWith('p')) { // Pawn
                if (x > 0) moves.push({x: x - 1, y, command: 'F'});
                if (x < boardSize - 1) moves.push({x: x + 1, y, command: 'B'});
                if (y > 0) moves.push({x, y: y - 1, command: 'L'});
                if (y < boardSize - 1) moves.push({x, y: y + 1, command: 'R'});
            } else if (character.startsWith('h1')) { // Hero1
                if (x > 1) moves.push({x: x - 2, y, command: 'F'});
                if (x < boardSize - 2) moves.push({x: x + 2, y, command: 'B'});
                if (y > 1) moves.push({x, y: y - 2, command: 'L'});
                if (y < boardSize - 2) moves.push({x, y: y + 2, command: 'R'});
            } else if (character.startsWith('h2')) { // Hero2
                if (x > 1 && y > 1) moves.push({x: x - 2, y: y - 2, command: 'FL'});
                if (x > 1 && y < boardSize - 2) moves.push({x: x - 2, y: y + 2, command: 'FR'});
                if (x < boardSize - 2 && y > 1) moves.push({x: x + 2, y: y - 2, command: 'BL'});
                if (x < boardSize - 2 && y < boardSize - 2) moves.push({x: x + 2, y: y + 2, command: 'BR'});
            }

            // Filter out moves that are out of bounds, target friendly characters, or are invalid
            return moves.filter(move => isValidMove(move, x, y));
        }

        function isValidMove(move, startX, startY) {
            const targetCell = gameBoard[move.x][move.y];
            if (move.x < 0 || move.x >= boardSize || move.y < 0 || move.y >= boardSize) {
                return false; // Out of bounds
            }
            if (targetCell && targetCell.startsWith(currentPlayer)) {
                return false; // Targeting a friendly character
            }
            return true;
        }

        function showMoveOptions(validMoves, startX, startY) {
            const moveOptionsContainer = document.getElementById('move-options');
            moveOptionsContainer.innerHTML = '';

            validMoves.forEach(move => {
                const btn = document.createElement('button');
                btn.className = 'move-btn';
                btn.textContent = `Move ${move.command} to (${move.x}, ${move.y})`;
                btn.onclick = () => makeMove(move, startX, startY);
                moveOptionsContainer.appendChild(btn);
            });
        }

        function makeMove(move, startX, startY) {
            const character = gameBoard[startX][startY];
            const path = calculatePath(startX, startY, move.x, move.y);

            // Remove opponent's characters in the path for Hero1 and Hero2
            path.forEach(position => {
                if (gameBoard[position.x][position.y] && gameBoard[position.x][position.y].startsWith(opponent(currentPlayer))) {
                    gameBoard[position.x][position.y] = null;
                }
            });

            // Move character to new position
            gameBoard[move.x][move.y] = character;
            gameBoard[startX][startY] = null;

            // Log the move
            logMove(move, character);

            // Check for win condition
            checkWinCondition();

            // Switch to the next player
            currentPlayer = opponent(currentPlayer);
            updateTurnDisplay(currentPlayer);
            updateBoard();
            document.getElementById('move-options').innerHTML = ''; // Clear move options
        }

        function calculatePath(startX, startY, endX, endY) {
            const path = [];
            const dx = Math.sign(endX - startX);
            const dy = Math.sign(endY - startY);

            let x = startX + dx;
            let y = startY + dy;

            while (x !== endX || y !== endY) {
                path.push({ x, y });
                x += dx;
                y += dy;
            }

            path.push({ x: endX, y: endY });
            return path;
        }

        function opponent(player) {
            return player === 'player1' ? 'player2' : 'player1';
        }

        function updateTurnDisplay(player) {
            document.getElementById('player-turn').textContent = player === 'player1' ? 'Player 1 (Red)' : 'Player 2 (Blue)';
        }

        function logMove(move, character) {
            const logContainer = document.getElementById('log-container');
            let currentColumn = logContainer.lastElementChild;

            // If no columns exist or the current column has 6 items, create a new column
            if (!currentColumn || currentColumn.children.length >= 6) {
                const newColumn = document.createElement('ul');
                newColumn.style.marginRight = '20px'; // Add some space between columns
                logContainer.appendChild(newColumn);
                currentColumn = newColumn;
            }

            const listItem = document.createElement('li');
            listItem.textContent = `${character.toUpperCase()} moved ${move.command} to (${move.x}, ${move.y})`;
            currentColumn.appendChild(listItem);
        }

        function makeMove(move, startX, startY) {
            const character = gameBoard[startX][startY];
            const path = calculatePath(startX, startY, move.x, move.y);

            // Remove opponent's characters in the path for Hero1 and Hero2
            path.forEach(position => {
                if (gameBoard[position.x][position.y] && gameBoard[position.x][position.y].startsWith(opponent(currentPlayer))) {
                    deletedCharacters.push(gameBoard[position.x][position.y]); // Track deleted character
                    gameBoard[position.x][position.y] = null;
                }
            });

            // Move character to new position
            gameBoard[move.x][move.y] = character;
            gameBoard[startX][startY] = null;

            // Log the move
            logMove(move, character);

            // Update the deleted characters display
            updateDeletedCharacters();

            // Check for win condition
            checkWinCondition();

            // Switch to the next player
            currentPlayer = opponent(currentPlayer);
            updateTurnDisplay(currentPlayer);
            updateBoard();
            document.getElementById('move-options').innerHTML = ''; // Clear move options
        }
        function updateDeletedCharacters() {
            const deletedList = document.getElementById('deleted-list');
            deletedList.innerHTML = ''; // Clear previous list

            deletedCharacters.forEach(character => {
                const listItem = document.createElement('li');
                listItem.textContent = `${character.toUpperCase()} was deleted`;
                deletedList.appendChild(listItem);
            });
        }

        function checkWinCondition() {
            let player1Alive = false;
            let player2Alive = false;

            for (let i = 0; i < boardSize; i++) {
                for (let j = 0; j < boardSize; j++) {
                    if (gameBoard[i][j] && gameBoard[i][j].startsWith('player1')) {
                        player1Alive = true;
                    }
                    if (gameBoard[i][j] && gameBoard[i][j].startsWith('player2')) {
                        player2Alive = true;
                    }
                }
            }

            if (!player1Alive || !player2Alive) {
                endGame(player1Alive ? 'Player 1 (Red)' : 'Player 2 (Blue)');
            }
        }

        function endGame(winner) {
            const gameOverScreen = document.getElementById('game-over-screen');
            const winnerDisplay = document.getElementById('winner');
            winnerDisplay.textContent = `${winner} wins!`;

            gameOverScreen.style.display = 'block';
        }

        function startNewGame() {
            console.log("Starting a new game...");
            document.getElementById('game-over-screen').style.display = 'none';
            document.getElementById('log-container').innerHTML = ''; // Clear log container
            document.getElementById('deleted-list').innerHTML = '';
            deletedCharacters = [];
            document.getElementById('deploy-btn').disabled = false;
            document.getElementById('player1-deployment').value = '';
            document.getElementById('player2-deployment').value = '';
            currentPlayer = 'player1';
            updateTurnDisplay(currentPlayer);
            initializeBoard();
        }




        // Initialize the game board on page load
        window.onload = initializeBoard();