# routing.py
from django.urls import re_path
from game_server.websocker_client import GameConsumer

websocket_urlpatterns = [
    re_path(r'ws/game/$', GameConsumer.as_asgi()),
]