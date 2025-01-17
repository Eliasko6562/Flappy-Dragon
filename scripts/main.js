const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");


let whoosh = new Audio();
    whoosh.src = "./sounds/Whooosh.mp3";
let descend = new Audio();
    descend.src = "./sounds/fchuuu.mp3";
let music = new Audio();
    music.src = "./sounds/music.mp3";
let hit = new Audio();
    hit.src = "./sounds/AAAHHHHHH.mp3";

let player = new Player();

let click = false;
let clickedLastFrame = false;
let frametime = Date.now();

let pipes = [new Pipe(canvas.width, -5, 1, 1)];

let pillars = new Image();
    pillars.src = "./images/Pillar.png";
let background = new Background();

let score = 0;
let highScore = window.localStorage.getItem("highScore");
if (highScore == null) {
    highScore = 0;
}

let gameOverFlag = false;

music.loop = true;
music.play();

function main() {
    if (gameOverFlag){
        music.pause();
        hit.play();
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
    liveScore();
    player.draw();
   
  

    clickedLastFrame = click;
    frametime = Date.now();
    requestAnimationFrame(main);
}

function liveScore () {
    text(20, 35, "DarkSlateBlue", "25px Comic Sans MS", "Score: " + score); 
    text(20, 65, "DarkSlateBlue", "25px Comic Sans MS", "Best: " + highScore);
}

// Retrieve mute settings from localStorage
let isMusicMuted = window.localStorage.getItem("isMusicMuted") === "true";
let isSfxMuted = window.localStorage.getItem("isSfxMuted") === "true";

// Apply mute settings
music.muted = isMusicMuted;
whoosh.muted = isSfxMuted;
hit.muted = isSfxMuted;

document.getElementById("musicButton").addEventListener("click", function() {
    music.muted = !music.muted;
    window.localStorage.setItem("isMusicMuted", music.muted);
    if (!music.muted) {
        music.play();
    } else {
        music.pause();
    }
});

document.getElementById("sfxButton").addEventListener("click", function() {
    whoosh.muted = !whoosh.muted;
    hit.muted = !hit.muted;
    window.localStorage.setItem("isSfxMuted", whoosh.muted);
});

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
    if (e.code == "KeyW" || e.code == "Space" || e.code == "ArrowUp") {
        click = false;
    }
});

// Mobile touch controls
document.addEventListener("touchstart", function (e) {
    if (!e.target.classList.contains('sfx-button') && !e.target.classList.contains('music-button')) {
        click = true;
    }
});

document.addEventListener("touchend", function (e) {
    if (!e.target.classList.contains('sfx-button') && !e.target.classList.contains('music-button')) {
        click = false;
    }
});

main();