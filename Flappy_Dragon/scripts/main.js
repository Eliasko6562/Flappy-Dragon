const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let player = new Player();
let click = false;
let clickedLastFrame = false;
let pipes = [new Pipe(canvas.width, -5, 1, 1)];
let frametime = Date.now();
let pillars = new Image();
    pillars.src = "../images/Pillar.png";
let background = new Background();

function main() {
    frametime = (Date.now() - frametime) / 1000;
    background.update();

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

document.addEventListener("keydown", function (e) {
    if (e.code == "KeyW" || e.code == "Space" || e.code == "ArrowUp") {
        click = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code == "KeyW" || e.code == "Space" || e.code == "ArrowUp"
        
    ) {
        click = false;
    }
});

main();
