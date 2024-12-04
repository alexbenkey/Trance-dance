class Game:
    def __init__(self):
        self.ball = {"x": 700, "y": 500, "velocityX": 5, "velocityY": 5}
        self.player = {"y": 400, "score": 0}
        self.ai = {"y": 400, "score": 0}
        self.canvas = {"width": 1400, "height": 1000}
    
    def update_ball(self):
        self.ball["x"] += self.ball["velocityX"]
        self.ball["y"] += self.ball["velocityY"]

        # bounce logic
        if self.ball["y"] <= 0 or self.ball["y"] >= self.canvas["height"]:
            self.ball["velocityY"] *= 1
            