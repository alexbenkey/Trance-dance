const serverUrl = "ws://localhost:8000/ws/game_server/";

let socket;

function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
        return;
    }

    socket = new WebSocket(serverUrl);

    socket.onopen = () => {
        console.log("Connected to the game server.");
        //initializeGame(); // Perform any necessary setup
        if (gameMode) {
            socket.send(JSON.stringify({action: "start", mode: gameMode}));
        }
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
        alert(`WebSocket error: ${error.message}`);  // More detailed error message
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
export {connectWebSocket, sendPlayerAction};
