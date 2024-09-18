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
let score = 0;


function main() {
    frametime = (Date.now() - frametime) / 1000;
    background.update();

    player.update();
    checkCollision(player, pipes[0]);
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
    }
    pipeGeneration();
    player.draw();
   
  

    clickedLastFrame = click;
    frametime = Date.now();
    requestAnimationFrame(main);
}

function checkCollision(player, pipe) {
    // Simple collision detection logic
    if (player.x < pipe.x + pipe.width &&
           player.x + player.width > pipe.x &&
           player.y < pipe.y + pipe.height &&
           player.y + player.height > pipe.y) {
        return true;
           } else {
               return false;
           }
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
