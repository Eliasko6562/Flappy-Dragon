class Pipe {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        c.drawImage(pillars,this.x - player.x + player.initialX, this.y, this.w, this.h);
    }
}

function pipeGeneration() {
    if (pipes.length < 8) {
        genPipe();
    }
    if (pipes.length != 0 && pipes[0].x - player.x + 100 + pipes[0].w < 0) {
        pipes.splice(0, 1);
    }
}

function genPipe() {
    let num = Math.floor(Math.random() * (canvas.height - 200));
    pipes.push(new Pipe(pipes[pipes.length - 1].x + 300, - (canvas.height - 200 - num), 75, canvas.height - 200));
    pipes.push(new Pipe(pipes[pipes.length - 1].x,num + 200, 75, canvas.height - 200));
}