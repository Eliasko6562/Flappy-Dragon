const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

let player = new Player
let click = false
let clickedLastFrame = false
let pipes = [
    new Pipe(500, 0, 50, 200),
]


function main(){
    clearBackground("white");

    player.update();
    for (let i = 0; i < pipes.length; i++){
        pipes[i].draw();
    }
    player.draw();

    clickedLastFrame = click;
    requestAnimationFrame(main);
}

function clearBackground(color){
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
}



document.addEventListener('keydown', function(e){
    if(e.code == "KeyW"){
        click = true
    }
});

document.addEventListener('keyup', function(e){
    if(e.code == "KeyW"){
        click = false
    }
});

main();