class Player {
    constructor() {
        this.x = 100
        this.y = 100
        this.scale = 50
        this.jumpPower = 300
        this.gravity = 700
        this.yVelocity = 0
        this.speed = 250

        this.dragonStart = new Image();
        this.dragonStart.src = "../images/dragonStart.png";
        this.dragonEnd = new Image();
        this.dragonEnd.src = "../images/dragonEnd.png";
        this.dragonMid = new Image();
        this.dragonMid.src = "../images/dragonMid.png";
    }

    update() {
        this.input();
        this.applyGravity();
        this.move();
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

    hitbox() {
        for (let i = 0; i < pipes.length; i++) {
            if (this.x + this.scale > pipes[i].x && this.x < pipes[i].x + pipes[i].w && this.y + this.scale > pipes[i].y && this.y < pipes[i].y + pipes[i].h) {
                console.log("hit");
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

function drawRelativeToPlayer(x, y, w, h, color) {
    c.fillStyle = color;
    c.fillRect(x - player.x + 100, y, w, h);
}
