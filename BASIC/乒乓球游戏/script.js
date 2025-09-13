const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 16;
const PLAYER_COLOR = '#38b6ff';
const AI_COLOR = '#ff5e71';
const BALL_COLOR = '#f4d35e';
const NET_COLOR = '#fff';

// State
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 5 * (Math.random() * 2 - 1);
let aiSpeed = 5;

// Game loop
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    for (let y = 0; y < canvas.height; y += 32) {
        ctx.fillStyle = NET_COLOR;
        ctx.fillRect(canvas.width / 2 - 2, y, 4, 16);
    }

    // Draw paddles
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collide with top/bottom walls
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Collide with player paddle
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX *= -1;
        // Add some spin
        ballSpeedY += (ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) * 0.2;
    }

    // Collide with AI paddle
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX *= -1;
        // Add some spin
        ballSpeedY += (ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) * 0.2;
    }

    // Reset if out of bounds (left or right)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI movement (simple: follow ball)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += aiSpeed;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= aiSpeed;
    }
    // Clamp AI position
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() * 2 - 1);
}

// Player controls - mouse moves left paddle center to mouse Y
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.height / rect.height;
    const mouseY = (e.clientY - rect.top) * scale;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();