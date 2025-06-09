const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

// Private url for the API: http://dreamlo.com/lb/fu3D0eAnwk657ekqOwXvUgh25OcucD70OCw0pJ82zOww
const PUBLIC_KEY = "68371aaf8f40bb1514479821";
const PRIVATE_KEY = "fu3D0eAnwk657ekqOwXvUgh25OcucD70OCw0pJ82zOww";
const USE_HTTPS = true;


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
let frametime

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
 


function updateTopScore() {
    dreamlo.initialize(PUBLIC_KEY, PRIVATE_KEY, USE_HTTPS);

    const skip = 0;
    const take = 1;
    dreamlo.getScores(dreamlo.ScoreFormat.Object, dreamlo.SortOrder.PointsDescending, skip, take)
        .then((scores) => {
            const topScore = scores[0];
            let text = "";
            if (topScore) {
                text = topScore.score;
            }
            else {
                text = "No scores yet!";
            }
            $("#topScore").text("T0P: " + text);
        })
        .catch((error) => {
            alert(error);
        });
}

async function uploadScore() {
        const scores = await addScoreToLeaderboard(name);
        goToLeaderboard(scores, name);

        updateTopScore();
    };
    $("#viewLeaderboard").click(async function () {
        const scores = await getScores();
        goToLeaderboard(scores);
    });


function main() {
    if (gameOverFlag){
        music.pause();
        hit.play();
        gameOver();
        uploadScore();
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

function gameStart() {
    $("#menu").fadeOut(300);
    $("#canvas").fadeIn(1000);
    pipes = [new Pipe(canvas.width, -5, 1, 1)];
    player = new Player();
    score = 0;
    gameOverFlag = false;
    music.play();
    main();
}


function liveScore () {
    text(370, 35, "DarkSlateBlue", "30px Comic Sans MS", score); 
    text(369.5, 60, "DarkSlateBlue", "15px Comic Sans MS", highScore);
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
        resetGame();
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

if (window.localStorage.getItem("playerName") === null) {
    const modal = new bootstrap.Modal(document.getElementById('modal'));
    modal.show();

    document.getElementById("changeName").addEventListener("click", function () {
        const nameInput = document.getElementById("playerName").value;
        if (nameInput.trim() !== "") {
            window.localStorage.setItem("playerName", nameInput);
            modal.hide();
            frametime = Date.now();
            main();
        } else {
            alert("Please enter a valid name.");
        }
    });    
} else {
    frametime = Date.now();
    main();
}

