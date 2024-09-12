class Player {
    constructor() {
        this.x = 100
        this.y = 100
        this.scale = 50
        this.color = "red"
        this.jumpPower = 700
        this.gravity = 12
        this.yVelocity = 0
        this.speed = 250
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
        this.yVelocity -= this.gravity;
        this.y -= this.yVelocity * frametime;

        // Check if player has reached the bottom of the canvas
        if (this.y + this.scale > canvas.height) {
            this.y = canvas.height - this.scale;
            this.yVelocity = 0;
        }

        // Check if player has reached the top of the canvas
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
        c.fillStyle = this.color;
        c.fillRect(100, this.y, this.scale, this.scale);
    }
}

function drawRelativeToPlayer(x, y, w, h, color) {
    c.fillStyle = color;
    c.fillRect(x - player.x + 100, y, w, h);
}
