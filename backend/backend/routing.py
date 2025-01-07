# routing.py
from django.urls import re_path
from game_server.websocker_client import consumers

websocket_urlpatterns = [
    re_path(r"^ws/game_server/$", consumers.GameConsumer.as_asgi()),
]