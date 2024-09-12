class Player {
    constructor(){
        this.x = 100
        this.y = 100
        this.scale = 50
        this.color = "red"
        this.jumpPower = 3
        this.gravity = 0.05
        this.yVelocity = 0
        this.speed = 1
    }

    update(){
        this.input();
        this.applyGravity();
        this.move();
    }

    input(){
        if(click && !clickedLastFrame){
            this.yVelocity = this.jumpPower;
        }
    }

    applyGravity(){
        this.yVelocity -= this.gravity;
    this.y -= this.yVelocity;
    }

    move(){
        this.x += this.speed;
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(100, this.y, this.scale, this.scale);
    }
}

function drawRelativeToPlayer(x, y, w, h, color){
    c.fillStyle = color;
    c.fillRect(x - player.x, y, w, h);
}