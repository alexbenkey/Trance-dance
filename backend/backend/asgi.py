"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from backend.game_server.websocket_client import GameConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

#application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter({
            #"game_server/": GameConsumer.as_asgi(),
            "ws/game/": GameConsumer.as_asgi(),
        })
    ),
})


