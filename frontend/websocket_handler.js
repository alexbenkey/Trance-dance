// const wsHandler = new WebSocketHandler("ws://localhost:8000/ws/game/");
// const serverUrl = "ws://your-server-address/game"; // replace with server URL
// const serverUrl = "ws://localhost:8000/"; 
const serverUrl = "wss://localhost:8000/ws/game/";

let socket;

function connectWebSocket() {
    socket = new WebSocket(serverUrl);

    socket.onopen = () => {
        console.log("Connected to the game server.");
        initializeGame(); // Perform any necessary setup
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleServerMessage(message);
    };

    socket.onclose = () => {
        console.log("Disconnected from the game server.");
        alert("Connection to the game server lost.");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

function sendPlayerAction(action, data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action, data }));
    } else {
        console.warn("WebSocket is not open. Unable to send data.");
    }
}

function handleServerMessage(message) {
    switch (message.type) {
        case "update":
            updateGameCanvas(message.data);
            break;
        case "end":
            alert(`Game Over: ${message.reason}`);
            break;
        default:
            console.warn("Unknown message type received:", message.type);
    }
}

// paddle movement to the server
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        sendPlayerAction("move", { direction: "up" });
    } else if (event.key === "ArrowDown") {
        sendPlayerAction("move", { direction: "down" });
    } else if (event.key === "s") { // needed??
        sendPlayerAction("move", { direction: "down" });
    } else if (event.key === "w") { // needed??
        sendPlayerAction("move", { direction: "up" });
    }
});

//initiate WebSocket connection
connectWebSocket();
