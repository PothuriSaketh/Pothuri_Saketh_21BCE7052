# Pawn vs Hero

## Description

This project is a browser-based chess-like game where players can deploy characters and make moves on a 5x5 game board. It features real-time multiplayer capabilities using WebSockets, with turn-based gameplay, move validation, and automatic game state updates.



## Project Structure

The project is organized as follows:

```
chess-like-game/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── node_modules/
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

- **`public/`**: Contains the client-side code (HTML, CSS, and JavaScript).
- **`node_modules/`**: Contains project dependencies.
- **`package.json`**: Project metadata and dependencies.
- **`package-lock.json`**: Dependency tree for consistent installations.
- **`server.js`**: The main server file that sets up the WebSocket server and handles game logic.
- **`README.md`**: This file.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (includes npm)
- Web browser (e.g., Chrome, Firefox)

### Setup

1. **Install Dependencies**

   Navigate to the project directory and install the required dependencies:

   ```bash
   npm install
   ```

2. **Start the Server**

   Run the server with:

   ```bash
   node server.js
   ```

   The server will start on port 3000 by default. You can change this port in `server.js` if needed.

3. **Access the Client**

   Open your web browser and go to `http://localhost:3000`. This will load the client interface from the `public` directory.

## Usage

1. **Deploy Characters:**
   - Enter the deployment configurations for Player 1 and Player 2 in the input fields on the web page.
   - Click the "Deploy" button to set up characters on the board.

2. **Make Moves:**
   - Click on a character to select it.
   - Click on a valid move option to move the character.

3. **Game End:**
   - The game automatically detects the end condition and displays the winner.

4. **Start New Game:**
   - After the game ends, click the "Start New Game" button to reset and begin a new match.

## Development

- **Server-Side:** Built using Node.js with WebSocket for real-time communication and game logic.
- **Client-Side:** Built using HTML, CSS, and JavaScript.

## Author

- **[POTHURI NAGA SAI SAKETH ](mailto: pothurisaketh@gmail.com)**


## Contact

For questions or feedback, please reach out to [POTHURI NAGA SAI SAKETH ](mailto: pothurisaketh@gmail.com).
