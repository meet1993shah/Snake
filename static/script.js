const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
let score = 0;
let speed = 100;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (keyPressed === 38 && direction !== "DOWN") direction = "UP";
    else if (keyPressed === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (keyPressed === 40 && direction !== "UP") direction = "DOWN";
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Snake
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });

    // Draw Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move Snake
    let newX = snake[0].x;
    let newY = snake[0].y;

    if (direction === "LEFT") newX -= box;
    if (direction === "UP") newY -= box;
    if (direction === "RIGHT") newX += box;
    if (direction === "DOWN") newY += box;

    let newHead = { x: newX, y: newY };

    // Check collision with food
    if (newX === food.x && newY === food.y) {
        score += 10;
        food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
        speed = Math.max(50, speed - 5); // Increase speed
    } else {
        snake.pop(); // Remove last tail segment
    }

    // Check collision with walls or itself
    if (newX < 0 || newX >= canvas.width || newY < 0 || newY >= canvas.height || snake.some(part => part.x === newX && part.y === newY)) {
        return gameOver();
    }

    snake.unshift(newHead); // Add new head

    setTimeout(drawGame, speed);
}

function gameOver() {
    document.getElementById("game-over").style.display = "block";
    document.getElementById("score-display").innerText = `Your Score: ${score}`;
}

function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    speed = 100;
    document.getElementById("game-over").style.display = "none";
    drawGame();
}

drawGame();
