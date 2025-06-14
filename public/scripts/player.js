class Player {
    constructor() {
        this.initialX = 100;
        this.x = this.initialX;
        this.y = 100
        this.scale = 50
        this.jumpPower = 300
        this.gravity = 700
        this.yVelocity = 0
        this.speed = 250

        this.dragonStart = new Image();
        this.dragonStart.src = "./images/dragonStart.png";
        this.dragonEnd = new Image();
        this.dragonEnd.src = "./images/dragonEnd.png";
        this.dragonMid = new Image();
        this.dragonMid.src = "./images/dragonMid.png";
    }

    update() {
        this.input();
        this.applyGravity();
        this.move();
        this.scoreCounting();
        this.hitbox();
    }

    input() {
        if (click && !clickedLastFrame) {
            this.yVelocity = this.jumpPower;
        }
    }

    applyGravity() {
        this.yVelocity -= this.gravity * frametime;
        this.y -= this.yVelocity * frametime;

        if (this.y + this.scale > canvas.height) {
            this.y = canvas.height - this.scale;
            this.yVelocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.yVelocity = 0;
        }
    }

    scoreCounting() {
        for (let i = 0; i < pipes.length; i += 2) {
            if (this.x > pipes[i].x + pipes[i].w && !pipes[i].passed) {
                if (this.x - this.speed * frametime <= pipes[i].x + pipes[i].w) {
                    pipes[i].passed = true;
                    if (i + 1 < pipes.length) {
                        pipes[i + 1].passed = true;
                    }
                    score += 1;
                }
            }
        }
    }

    hitbox() {
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];

            if (
                ( // if player is between pipes on x axies
                    this.x + 15 > pipe.x && this.x + 15 < pipe.x + pipe.w ||
                    this.x + this.scale - 15 > pipe.x && this.x + this.scale - 15 < pipe.x + pipe.w
                ) && ( // and if player is between pipes on y axis
                    this.y + 8 > pipe.y && this.y + 8 < pipe.y + pipe.h ||
                    this.y + this.scale > pipe.y && this.y + this.scale < pipe.y + pipe.h
                )
            // this.x < pipes[i].x + pipes[i].w &&
            // this.x + this.scale > pipes[i].x &&
            // this.y < pipes[i].y + pipes[i].h &&
            // this.y + this.scale > pipes[i].y
            ) {
                gameOverFlag = true;
                highScore = Math.max(score, highScore);
                window.localStorage.setItem("highScore", highScore);
                pipes = [pipes[i]];
                break
            }
        }
    }

    move() {
        this.x += this.speed * frametime;
    }

    draw() {
        if (this.yVelocity < -75   ) {
            c.drawImage(this.dragonStart, 100, this.y, this.scale, this.scale); 
        } else if ( this.yVelocity <= -5) {
            c.drawImage(this.dragonMid, 100, this.y, this.scale, this.scale);
        } else if (this.yVelocity > -3) {
            c.drawImage(this.dragonEnd, 100, this.y, this.scale, this.scale);
        }
    }
}

/*function drawRelativeToPlayer(x, y, w, h, color) {
    c.fillStyle = color;
    c.fillRect(x - player.x + 100, y, w, h);
}*/

function text(x, y, color, font, text) {
    c.fillStyle = color;
    c.font = font;
    c.fillText(text, x, y);
}

function textCenter(x, y, color, font, text) {
    c.fillStyle = color;
    c.font = font;
    c.fillText(text, x - (c.measureText(text).width / 2), y);
}

function gameOver() {
    const centerX = canvas.width / 2;
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    pipes[0].draw();
    player.draw();
    textCenter(centerX, 200, "red", "50px Arial", "Game Over");
    textCenter(centerX, 250, "red", "25px Arial", "Score: " + score);
    textCenter(centerX, 300, "red", "25px Arial", "Best: " + highScore);
    textCenter(centerX, 350, "red", "25px Arial", "Press 'r' to restart");
    submitScore(score);
}

async function submitScore(score) {
  if (!scoreSubmitted) {
    scoreSubmitted = true;

    const playerName = window.localStorage.getItem("playerName");
    const storedToken = window.localStorage.getItem("playerToken");

    if (!storedToken) {
      console.warn("No player token found, cannot submit score.");
      return;
    }

    if (score < 1000) { // Anti-cheat max score
      try {
        await fetch("https://flappy-dragon.eliascomastantine.workers.dev/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: playerName, score: score, token: storedToken })
        });
        console.log("Score submitted.");
        fetchLeaderboard();
      } catch (err) {
        console.error("Failed to submit score:", err);
      }
    } else {
      console.warn("Score too high, not submitting.");
    }
  }
}
