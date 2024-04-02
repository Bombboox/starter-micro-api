//Rendering
const canvas = document.getElementById("ab");
const ctx = canvas.getContext("2d");

//Game Stuff
const PLAYER_SPEED = 5;
const keyboard = [];
const players = {};
var px = py = 0;
var moving = false;
var animationFrame;

socket.on('move', ({x, y, playerId}) => {
    players[playerId].x = x;
    players[playerId].y = y;
});

socket.on('playerJoined', (playerId) => {
    players[playerId] = {playerId: playerId, x:0, y:0};
    emitMovement();
});

socket.on('playerLeft', (playerId) => {
    delete players[playerId];
});

socket.on('currentPlayers', (users) => {
    console.log(users);
    for(user in users) {
        let playerId = users[user];
        players[playerId] = {x: 0, y: 0, playerId: playerId};
    }
});

function initialize() {
    document.addEventListener('keydown', (e) => {keyboard[e.keyCode] = true});
    document.addEventListener('keyup', (e) => {keyboard[e.keyCode] = false});

    animationFrame = requestAnimationFrame(draw);
}

function draw() {
    animationFrame = requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    for(const player in players) {
        let p = players[player];
        ctx.fillRect(p.x, p.y, 25, 25);
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(px, py, 25, 25);

    movement();

    if(moving) {
        emitMovement();
    }
}

function emitMovement() {
    socket.emit('move', {roomId: roomId, x : px, y: py});
}

function movement() {
    let ix = px; 
    let iy = py;

    if(keyboard[37]) {
        px -= PLAYER_SPEED;
    }
    if(keyboard[38]) {
        py -= PLAYER_SPEED;
    }
    if(keyboard[39]) {
        px += PLAYER_SPEED;
    }
    if(keyboard[40]) {
        py += PLAYER_SPEED;
    }

    if(ix == px && iy == py) {
        moving = false
    } else {
        moving = true;
    }
}