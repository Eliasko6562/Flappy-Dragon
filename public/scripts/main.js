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
let scoreSubmitted = false;

music.loop = true;
 
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

const savedName = window.localStorage.getItem("playerName");

if (!savedName) {
    const modalEl = document.getElementById('modal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    const nameInput = document.getElementById("playerName");
    const confirmButton = document.getElementById("changeName");

    // Autofocus when modal opens
    modalEl.addEventListener('shown.bs.modal', () => {
        nameInput.focus();
    });

    // Submit name via Enter key
    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            confirmButton.click();
        }
    });

    confirmButton.addEventListener("click", () => {
        const name = nameInput.value.trim();
        if (name !== "") {
            window.localStorage.setItem("playerName", name);
            modal.hide();
            startGame();
        } else {
            alert("Please enter a valid name.");
        }
    });
} else {
    startGame();
}

function startGame() {
    frametime = Date.now();
    music.loop = true;

    // Only play after interaction
    if (!music.muted) {
        music.play().catch(err => {
            console.warn("Music play blocked:", err);
        });
    }

    main();
    fetchLeaderboard();
}

function resetGame() {
    score = 0;
    gameOverFlag = false;
    scoreSubmitted = false;
    player = new Player();
    
    pipes = [new Pipe(canvas.width, -5, 1, 1)];
    player.x = player.initialX;
    player.y = 100;
    // start the game loop again
    frametime = Date.now();
    main();
}

function fetchLeaderboard() {
    fetch("https://flappy-dragon.eliascomastantine.workers.dev/leaderboard")
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#leaderboard tbody");
            tbody.innerHTML = "";
            data.forEach((entry, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.username}</td>
                    <td>${entry.score}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error("Leaderboard fetch error:", err));
}

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