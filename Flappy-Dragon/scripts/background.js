class Background{
    constructor(){
        this.background = new Image();
        this.background.src = "./images/Background.jpg";
        this.x = 0;
        this.speed = 150;


    }
    update(){
        this.move();
        this.draw();
    }
    move(){
        this.x -= this.speed * frametime;
    }

    draw(){
        c.drawImage(this.background,this.x,0,canvas.width,canvas.height);
        c.drawImage(this.background,this.x + canvas.width,0,canvas.width,canvas.height);
        if(this.x <= -canvas.width){
            this.x = 0;
        }
    }
}