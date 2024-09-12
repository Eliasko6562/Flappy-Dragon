const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let player = new Player();
let click = false;
let clickedLastFrame = false;
let pipes = [new Pipe(canvas.width, -5, 1, 1)];
let frametime = Date.now();

function main() {
    frametime = (Date.now() - frametime) / 1000;
    clearBackground("white");

    player.update();
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
    }
    pipeGeneration();
    player.draw();

    clickedLastFrame = click;
    frametime = Date.now();
    requestAnimationFrame(main);
}

function clearBackground(color) {
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", function (e) {
    if (e.code == "KeyW") {
        click = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code == "KeyW") {
        click = false;
    }
});

main();
