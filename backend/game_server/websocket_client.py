import json
from channels.generic.websocket import AsyncWebsocketConsumer
from backend.game_server.game_logic import Game

games = {}  # active games by game_id -- laura??
players = {}  # active players by player_id -- laura??

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.player_id = self.channel_name  # unique player ID -- laura??
        players[self.player_id] = self
        print(f"Player {self.player_id} connected.")

        await self.accept() # accepts socket connection

    async def disconnect(self, close_code):
        print(f"Player {self.player_id} disconnected.")
        if self.player_id in players:
            del players[self.player_id]

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        game_id = data.get("game_id")

        if action == "start":
            mode = data.get("mode")
            game_id = f"game_{self.player_id}"
            games[game_id] = Game(mode)
            await self.send(text_data=json.dumps({
                "type": "started",
                "game_id": game_id,
            }))

        elif action == "move":
            direction = data["data"]["direction"]
            if game_id in games:
                game = games[game_id]
                game.move_player(self.player_id, direction)
                await self.broadcast_game_state(game_id)

        elif action == "disconnect":
            del players[self.player_id]
            await self.close()

    async def broadcast_game_state(self, game_id):
        if game_id in games:
            game_state = games[game_id].get_state()
            message = json.dumps({
                "type": "update",
                "data": game_state,
            })
            for player in players.values():
                await player.send(text_data=message)



# import asyncio
# import json
# import websockets
# from game_logic import Game

# #active games by game_id 
# games = {}
# players = {}

# async def handle_connection(websocket, path):
#     try:
#         player_id = id(websocket) # assigns a unique player ID
#         players[player_id] = websocket
#         print(f"Player {player_id} connected.")

#         async for message in websocket:
#             data = json.loads(message)
#             action = data.get("action")
#             game_id = data.get("game_id")

#             if action == "start":
#                 # new game instance
#                 mode = data.get("mode")
#                 game_id = f"game_{player_id}"  # game ID??
#                 games[game_id] = Game(mode)
#                 await websocket.send(json.dumps({"type": "started", "game_id": game_id}))

#             elif action == "move":
#                 direction = data["data"]["direction"]
#                 if game_id in games:
#                     game = games[game_id]
#                     game.move_player(player_id, direction)
#                     await broadcast_game_state(game_id)  # updates all connected players

#             elif action == "disconnect":
#                 del players[player_id]
#                 await websocket.close()

#     except websockets.exceptions.ConnectionClosed:
#         print(f"Player {player_id} disconnected.")
#         if player_id in players:
#             del players[player_id]

# async def broadcast_game_state(game_id):
#     if game_id in games:
#         game_state = games[game_id].get_state()
#         message = json.dumps({"type": "update", "data": game_state})
#         for player in players.values():
#             await player.send(message)

# async def main():
#     start_server = await websockets.serve(handle_connection, "0.0.0.0", 8000) # not 8765
#     print("Game server running on ws://0.0.0.0:8000") # not 8765
#     await start_server.wait_closed()

# if __name__ == "__main__":
#     asyncio.run(main())