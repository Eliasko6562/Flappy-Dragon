const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let whoosh = new Audio();
    whoosh.src = "./sounds/Whooosh.mp3";
let descend = new Audio();
    descend.src = "./sounds/fchuuu.mp3";
let music = new Audio();
    music.src = "./sounds/music.mp3";




let player = new Player();
let click = false;
let clickedLastFrame = false;
let pipes = [new Pipe(canvas.width, -5, 1, 1)];
let frametime = Date.now();
let pillars = new Image();
    pillars.src = "./images/Pillar.png";
let background = new Background();
let score = 0;
let highScore = window.localStorage.getItem("highScore");
if (highScore == null) {
    highScore = 0;
}
let gameOverFlag = false;


function main() {
    if (gameOverFlag){
        gameOver();
        
        return;
    }

    frametime = (Date.now() - frametime) / 1000;
    background.update();

    player.update();
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
    }
    if (!gameOverFlag) {
        pipeGeneration();
    }
    music.play();
    liveScore();
    player.draw();
   
  

    clickedLastFrame = click;
    frametime = Date.now();
    requestAnimationFrame(main);
}

function liveScore () {
    text(20, 35, "white", "20px Comic Sans MS", "Score: " + score); 
    text(20, 60, "white", "20px Comic Sans MS", "Best: " + highScore);
}
  
// PC controls

document.addEventListener("keydown", function (e) {
    if ((e.code == "KeyW" || e.code == "Space" || e.code == "ArrowUp") && !gameOverFlag) {
        click = true;
        whoosh.pause();
        whoosh.currentTime = 0;
        whoosh.play();

    }
    if (e.code == "KeyR" && gameOverFlag) {
        location.reload();
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code == "KeyW" || e.code == "Space" || e.code == "ArrowUp"
        
    ) {
        click = false;
    }
});



// Mobile touch controls

document.addEventListener("touchstart", function (e) {
    click = true;
});

document.addEventListener("touchend", function (e) {
    click = false;
});

main();
