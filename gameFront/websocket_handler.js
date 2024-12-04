class WebSocketHandler {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.eventHandlers = {}; // Store custom event handlers
    }

    connect() {
        this.socket = new WebSocket(this.url);

        // Handle WebSocket open event
        this.socket.onopen = () => {
            console.log("WebSocket connected.");
            this.triggerEvent("connected");
        };

        // Handle incoming messages
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received:", data);

            // Dispatch custom event handlers
            if (data.type && this.eventHandlers[data.type]) {
                this.eventHandlers[data.type](data.payload);
            }
        };

        // Handle WebSocket close event
        this.socket.onclose = (event) => {
            console.log("WebSocket disconnected.", event);
            this.triggerEvent("disconnected");
        };

        // Handle WebSocket error
        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    // Send a message through the WebSocket
    sendMessage(type, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type, payload });
            this.socket.send(message);
            console.log("Sent:", message);
        } else {
            console.error("WebSocket is not open.");
        }
    }

    // Register an event handler for a specific message type
    on(eventType, callback) {
        this.eventHandlers[eventType] = callback;
    }

    // Trigger an internal custom event
    triggerEvent(eventType, payload = null) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType](payload);
        }
    }

    // Close the WebSocket connection
    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Export a single instance for global use
const wsHandler = new WebSocketHandler("ws://localhost:8000/ws/game/");
export default wsHandler;






// THIS IS TO TEST -- ADD TO MAIN.JS AT SOME POINT
// import wsHandler from './websocket_handler.js'

// wsHandler.connect();
// wsHandler.on("connected", () => {
//     console.log("Connected to the Websocket server.");
// });

// wsHandler.on("disconnected", () => {
//     console.log("Disconnected from the Websocket server.");
// });