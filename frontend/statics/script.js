// NEW VERSION WITH BACKEND
const gameMenuElement = document.getElementById("gameMenu");
const instructions1 = document.getElementById("game-instruction1");
const instructions2 = document.getElementById("game-instruction2");
const gameCanvas = document.getElementById("game");
const gameContext = gameCanvas.getContext("2d");

instructions1.style.display = "none";
instructions2.style.display = "none";

const gameMenu = new bootstrap.Modal(gameMenuElement, {
    backdrop: "static",
    keyboard: false,
});

const gameState = {
    mode: null,
    running: false,
    playerId: null, // assigned by the server -- alex/Laura??
};

// handle starting the game based on mode
function startGame(mode) {
    gameState.mode = mode;
    gameState.running = true;

    console.log(`Game started in ${mode} mode.`);
    gameMenu.hide();

    gameCanvas.style.display = "block"; // shows the element

    if (mode === "One Player") {
        alert(`${mode} mode will use backend logic. Initializing connection...`);
        instructions1.style.display = "block";
        initializeGameConnection();
    } if (mode === "Two Players (hot seat)") {
        alert(`${mode} mode is not yet implemented.`);
        instructions2.style.display = "block";
        // initializeGameConnection();
    } if (mode === "Two Players (remote)") {
        alert(`${mode} mode is not yet implemented.`);
        instructions1.style.display = "block";
        // initializeGameConnection();
    } if (mode === "Tournament") {
        alert(`${mode} mode is not yet implemented.`);
        instructions2.style.display = "block";
        // initializeGameConnection();
    }
}

// Event listeners for menu buttons
document.getElementById("onePlayerBtn").addEventListener("click", () => startGame("One Player"));
document.getElementById("twoPlayersBtn").addEventListener("click", () => startGame("Two Players (hot seat)"));
document.getElementById("twoPlayersRemoteBtn").addEventListener("click", () => startGame("Two Players (remote)"));
document.getElementById("tournamentBtn").addEventListener("click", () => startGame("Tournament"));

// Show the menu on page load
window.onload = () => {
    gameMenu.show();
};

// placeholder for initializing server communication
function initializeGameConnection() {
    // const serverUrl = "ws://your-server-address/game";
    const serverUrl = "wss://localhost:8000/"; // not 8765
    const socket = new WebSocket(serverUrl);

    socket.onopen = () => {
        console.log("Connected to the game server.");
        // Inform server about the game mode
        socket.send(JSON.stringify({ action: "start", mode: gameState.mode }));
    };

    socket.onmessage = (event) => {
        const serverMessage = JSON.parse(event.data);
        handleServerMessage(serverMessage);
    };

    socket.onclose = () => {
        console.log("Disconnected from the game server.");
        gameState.running = false;
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        alert("An error occurred with the game server connection."); // errors here
    };

    gameState.socket = socket;
}

// handles messages from the server
function handleServerMessage(message) {
    switch (message.type) {
        case "update":
            // updates game state based on server data
            updateGameState(message.data);
            break;
        case "end":
            alert(`Game over: ${message.reason}`);
            gameState.running = false;
            break;
        default:
            console.warn("Unknown message type:", message.type);
    }
}

// update game state and redraws the canvas based on server updates
function updateGameState(data) {
    const { player, opponent, ball } = data;

    // clear the canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // draw paddles
    gameContext.fillStyle = "white";
    gameContext.fillRect(player.x, player.y, player.width, player.height);
    gameContext.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);

    // draw ball
    gameContext.beginPath();
    gameContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    gameContext.fill();
}





// VERSION 4 -- GAME
// const gameMenuElement = document.getElementById("gameMenu");

// const instructions1 = document.getElementById("game-instruction1");
// instructions1.style.display = "none"; // Hides the element

// const instructions2 = document.getElementById("game-instruction2");
// instructions2.style.display = "none"; // Hides the element

// const gameMenu = new bootstrap.Modal(gameMenuElement, {
//     backdrop: "static",
//     keyboard: false,
// });

// const gameState = {
//     mode: null,
//     running: false,
// };

// function startGame(mode) {
//     gameState.mode = mode;
//     gameState.running = true;

//     console.log(`Game started in ${mode} mode.`);
//     gameMenu.hide();

//     // Show the game canvas now that a mode is selected
//     document.getElementById("game").style.display = "block";

//     // Initialize the game
//     if (mode === "One Player") {
//         instructions1.style.display = "block"; // Shows the element
//         Pong.initialize();
//     }
//     if (mode === "Two Players (hot seat)") {
//         instructions2.style.display = "block"; // Shows the element
//         //Pong.initialize();
//     }
//   if (mode === "Two Players (remote)") {
//         instructions1.style.display = "block"; // Shows the element
//         //Pong.initialize();
//     }
//     if (mode === "Tournament") {
//         instructions2.style.display = "block"; // Shows the element
//         //Pong.initialize();
//     }
    
// }

// // Event listeners for buttons
// document.getElementById("onePlayerBtn").addEventListener("click", () => startGame("One Player"));
// document.getElementById("twoPlayersBtn").addEventListener("click", () => alert("Two Players mode not implemented yet!"));
// document.getElementById("twoPlayersRemoteBtn").addEventListener("click", () => alert("Two Players mode not implemented yet!"));
// document.getElementById("tournamentBtn").addEventListener("click", () => alert("Tournament mode not implemented yet!"));

// // Show menu on page load
// window.onload = () => {
//     console.log("Modal is showing");
//     gameMenu.show();
//     gameMenu._element.addEventListener('hidden.bs.modal', () => {
//         console.log("Modal is hidden, game should start");
//         if (gameState.mode) {
//             Pong.initialize();
//         }
//     });
// };

// gameMenuElement.addEventListener('show.bs.modal', () => {
//     console.log("Modal is about to be shown.");
// });

// gameMenuElement.addEventListener('hidden.bs.modal', () => {
//     console.log("Modal is hidden.");
//     if (gameState.mode) {
//         Pong.initialize();  // Initialize the game once the modal is hidden
//     }
// });


// /** Game Logic */
// const DIR = {
//     IDLE: 0,
//     UP: 1,
//     DOWN: 2,
//     LEFT: 3,
//     RIGHT: 4,
// };

// const Ball = {
//     new: function (incrementedSpeed) {
//         return {
//             x: (this.canvas.width / 2) - 9,
//             y: (this.canvas.height / 2) - 9,
//             width: 20,
//             height: 20,
//             radius: 10,
//             speed: incrementedSpeed || 7, // do we need/use incrementSpeed??
//             velocityX: DIR.IDLE,
//             velocityY: DIR.IDLE,
//         };
//     },
// };

// const Ai = {
//     new: function (side) {
//         return {
//             x: side === "left" ? 10 : this.canvas.width - 30,
//             y: this.canvas.height / 2 - 35,
//             width: 18,
//             height: 180,
//             score: 0,
//             speed: 15,
//             move: DIR.IDLE,
//         };
//     },
// };

// const Net = {
//     new: function () {
//         return {
//             x: this.canvas.width / 2 - 1,
//             y: 0,
//             width: 5,
//             height: 10,
//             gap: 7,
//         };
//     },
// };

// const Game = {
//     initialize: function () {
//         console.log("Game Initialized"); // to rm
//         this.canvas = document.getElementById("game");
//         this.context = this.canvas.getContext("2d");

//         this.canvas.width = 1400;
//         this.canvas.height = 1000;
//         this.canvas.style.width = this.canvas.width / 2 + "px";
//         this.canvas.style.height = this.canvas.height / 2 + "px";

//         this.player = Ai.new.call(this, "left");
//         this.ai = Ai.new.call(this, "right");
//         this.ball = Ball.new.call(this);
//         this.net = Net.new.call(this);

//         this.ai.speed = 5;
//         this.running = this.over = false;
//         this.turn = this.ai;
//         this.timer = 0;
//         this.color = "#000000";

//         Pong.menu();
//         Pong.listen();
//     },
//     menu: function () {
//         Pong.draw();
//         Pong.context.font = "50px Courier New";
//         Pong.context.fillStyle = this.color;

//         this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);

//         this.context.fillStyle = "#ffffff";

//         this.context.fillText("Press any key to start", this.canvas.width / 2, this.canvas.height / 2 + 15);
//     },
//     endGameMenu: function (text) {
//         Pong.context.font = '45px Courier New';
//         Pong.context.fillStyle = this.color;
//         // rectangle behind 'press any key to begin'
//         Pong.context.fillRect(Pong.canvas.width / 2 - 350, Pong.canvas.height / 2 - 48, 700, 100);
//         Pong.context.fillStyle = '#ffffff';
//         Pong.context.fillText(text, Pong.canvas.width / 2, Pong.canvas.height / 2 + 15);

//         setTimeout(function () {
//           Pong = Object.assign({}, Game);
//           Pong.initialize();
//         }, 3000);
//     },
//     loop: function () {
//         Pong.update();
//         Pong.draw();

//         if (!Pong.over) requestAnimationFrame(Pong.loop);
//     },
//     listen: function () {
//         window.addEventListener("keydown", (event) => {
//             if (!Pong.running) {
//                 Pong.running = true;
//                 window.requestAnimationFrame(Pong.loop);
//             }
          
//           if (gameState.mode === "Two Players (remote)" || gameState.mode === "One Player") {
//             switch (event.key) {
//               case 's': // 'S' key
//                 this.player.y += 10;
//                 break;
//               case 'ArrowDown': // down key
//                 this.player.y += 10;
//                 break;
//               case 'w': // 'W' key
//                 this.player.y -= 10;
//                 break;
//               case 'ArrowUp': // Up key
//                 this.player.y -= 10;
//                 break;
//             }
//           }
//           else {
//             switch (event.key) {
//               case 40: // Down arrow
//                 this.ai.y += 10;
//                 break;
//               case 83: // 'S' key
//                 this.player.y += 10;
//                 break;
//               case 38: // Up arrow
//                 this.ai.y -= 10;
//                 break;
//               case 87: // 'W' key
//                 this.player.y -= 10;
//                 break;
//             }
//           }
//         });
//     },
//     // this version needs to be altered in case we have a "real opponent"
//     update: function () {
//       if (!this.over) {
//         // if ball collides with bound limit, correct x and y coordinates
//         if (this.ball.x <= 0) 
//           Pong._resetTurn.call(this, this.ai, this.player);
//         if (this.ball.x >= this.canvas.width - this.ball.radius)
//           Pong._resetTurn.call(this, this.player, this.ai);
//         if (this.ball.y <= 0)
//            this.ball.velocityY = DIR.DOWN;
//         if (this.ball.y >= this.canvas.height - this.ball.radius)
//             this.ball.velocityY = DIR.UP;

//         // movement of paddle if keys pressed
//         if (this.player.move === DIR.UP)
//           this.player.y -= this.player.speed;
//         else if (this.player.move === DIR.DOWN)
//           this.player.y += this.player.speed;

//         // restart the ball on new serve, and random direction
//         if (Pong._turnDelayIsOver.call(this) && this.turn) {
//           this.ball.velocityX = this.turn === this.player ? DIR.LEFT : DIR.RIGHT;
//           this.ball.velocityY = [DIR.UP, DIR.DOWN][Math.round(Math.random())];
//           this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
//           this.turn = null;
//         }

//          // if player collides with bound limit, correct x and y coordinates
//         if (this.player.y <= 0)
//           this.player.y = 0;
//         else if (this.player.y >= (this.canvas.height - this.player.height))
//           this.player.y = this.canvas.height - this.player.height;

//         // movement ball
//         if (this.ball.velocityY === DIR.UP)
//           this.ball.y -= this.ball.speed/1.5;
//         else if (this.ball.velocityY === DIR.DOWN)
//           this.ball.y += this.ball.speed/1.5;
//         if (this.ball.velocityX === DIR.LEFT)
//            this.ball.x -= this.ball.speed;
//         else if (this.ball.velocityX === DIR.RIGHT)
//           this.ball.x += this.ball.speed;

//         // ai UP/DOWN movement
//         if (this.ai.y > this.ball.y - (this.ai.height/2)) {
//           if (this.ball.velocityX === DIR.RIGHT)
//             this.ai.y -= this.ai.speed/1.5;
//           else
//             this.ai.y -= this.ai.speed/4;
//         }
//         if (this.ai.y < this.ball.y - (this.ai.height/2)) {
//           if (this.ball.velocityX === DIR.RIGHT)
//              this.ai.y += this.ai.speed/1.5;
//           else
//             this.ai.y += this.ai.speed/4;
//         }

//         // ai wall collision
//         if (this.ai.y >= this.canvas.height - this.ai.height)
//            this.ai.y = this.canvas.height - this.ai.height;
//         else if (this.ai.y <= 0)
//             this.ai.y = 0;

//         // player-ball collision
//         if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
//           if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
//             this.ball.x = (this.player.x + this.ball.width);
//             this.ball.velocityX = DIR.RIGHT;
//           }
//         }
        
//         // ai-ball collision
//         if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
//                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
//                    this.ball.x = (this.ai.x - this.ball.radius - 7);
//                    // this.ball.x = (this.ai.x - this.ball.width); // quite distant from the wall
//                    this.ball.velocityX = DIR.LEFT;
//                }
//          }
//   }

//         if (this.player.score === 10 || this.ai.score === 10) {
//           this.over = true;
//           if (this.player.score === 10)
//             setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
//           else
//             setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
//         }
//         // else {
//         //   // does the speed need to increase??
//         // }
   
//     },
//     draw: function () {
//         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear frame
//         this.context.fillStyle = this.color;
//         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height); // fill background color
//         this.context.fillStyle = '#ffffff'; // color for the paddles
//         this.context.fillRect(this.player.x, this.player.y, this.player.width, this.player.height); // drawing player
//         this.context.fillRect(this.ai.x, this.ai.y, this.ai.width, this.ai.height); // drawing ai

//         if (Pong._turnDelayIsOver.call(this)) {
//           this.context.beginPath();
//           this.context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI*2, false);
//           this.context.closePath();
//           this.context.fill();
//           // this.context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height); // drawing the ball, makes it square
//         }

//         this.context.fillStyle = '#ffffff'; // color for the net?
//         for (let i = 0; i <= this.canvas.height; i += this.net.height + this.net.gap){
//           this.context.fillRect(this.net.x, this.net.y + i, this.net.width, this.net.height);
//         }

//         this.context.font = '100px Courier New'; // set default canvas font and align center
//         this.context.textAlign = 'center';

//         this.context.fillText(this.player.score.toString(), this.canvas.width/2 - 300, 200);
//         this.context.fillText(this.ai.score.toString(), this.canvas.width/2 + 300, 200);
//         this.context.font = '30px Courier New'; // for the score font
//     },
    
//     _resetTurn: function (winner, loser){
//     this.ball = Ball.new.call(this, this.ball.speed);
//     this.turn = loser;
//     this.timer = (new Date()).getTime();
    
//     winner.score++;
//     },
  
//      _turnDelayIsOver: function () {
//     return ((new Date()).getTime() - this.timer >= 1000);
//     },
// };


// const Pong = Object.assign({}, Game);

