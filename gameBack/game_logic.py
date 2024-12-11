# game_logic.py
# Backend logic for handling game state, including ball and paddle movements

import json

class Game:
    def __init__(self, mode):
        self.mode = mode
        self.player = {"x": 10, "y": 200, "width": 10, "height": 100}
        self.opponent = {"x": 780, "y": 200, "width": 10, "height": 100}
        self.ball = {"x": 400, "y": 300, "radius": 10, "dir_x": 4, "dir_y": 3}
        self.score = {"player": 0, "opponent": 0}
        self.running = True

    def update_state(self):
        # Update ball position
        self.ball["x"] += self.ball["dir_x"]
        self.ball["y"] += self.ball["dir_y"]

        # Ball collision with top/bottom walls
        if self.ball["y"] - self.ball["radius"] <= 0 or self.ball["y"] + self.ball["radius"] >= 600:
            self.ball["dir_y"] *= -1

        # Ball collision with paddles
        if self._check_collision(self.player):
            self.ball["dir_x"] = abs(self.ball["dir_x"])
        if self._check_collision(self.opponent):
            self.ball["dir_x"] = -abs(self.ball["dir_x"])

        # Ball out of bounds
        if self.ball["x"] < 0:
            self.score["opponent"] += 1
            self._reset_ball(direction=1)
        elif self.ball["x"] > 800:
            self.score["player"] += 1
            self._reset_ball(direction=-1)

        # Opponent AI movement (only in single-player mode)
        if self.mode == "One Player":
            self._move_ai()

    def move_player(self, player_id, direction):
        paddle = self.player if player_id == "player" else self.opponent
        if direction == "up" and paddle["y"] > 0:
            paddle["y"] -= 10
        elif direction == "down" and paddle["y"] + paddle["height"] < 600:
            paddle["y"] += 10

    def get_state(self):
        return {
            "player": self.player,
            "opponent": self.opponent,
            "ball": self.ball,
            "score": self.score
        }

    def _check_collision(self, paddle):
        return (
            self.ball["x"] - self.ball["radius"] <= paddle["x"] + paddle["width"]
            and self.ball["x"] + self.ball["radius"] >= paddle["x"]
            and self.ball["y"] >= paddle["y"]
            and self.ball["y"] <= paddle["y"] + paddle["height"]
        )

    def _reset_ball(self, direction):
        self.ball["x"] = 400
        self.ball["y"] = 300
        self.ball["dir_x"] = direction * 4
        self.ball["dir_y"] = 3

    def _move_ai(self):
        if self.ball["y"] < self.opponent["y"] + self.opponent["height"] // 2:
            self.opponent["y"] -= 5
        elif self.ball["y"] > self.opponent["y"] + self.opponent["height"] // 2:
            self.opponent["y"] += 5

#ex.game loop for WebSocket server
def handle_message(game, message):
    data = json.loads(message)

    if data["action"] == "move":
        game.move_player(data["player"], data["direction"])
    elif data["action"] == "update":
        game.update_state()
        return game.get_state()
    elif data["action"] == "stop":
        game.running = False

# ex.WebSocket communication (implementation depends on the WebSocket library)
def websocket_game_handler(socket, mode):
    game = Game(mode)

    while game.running:
        message = socket.receive() # from client
        response = handle_message(game, message)

        if response:
            socket.send(json.dumps({"type": "update", "data": response})) # to client

    # updates client of game over
    socket.send(json.dumps({"type": "end", "reason": "Game stopped by player."}))
