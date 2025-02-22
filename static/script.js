const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;  // Head size
const bodyBox = 15;  // Smaller body segments
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let score = 0;
let speed = 100;

// More fruit emojis for variety
const fruits = ["🍎", "🍌", "🍒", "🍊", "🍇", "🍓", "🍍", "🥝", "🍉", "🥭"];
let currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
let food = { x: randomPosition(), y: randomPosition() };

let touchStartX = 0;
let touchStartY = 0;

// Add both keyboard and touch event listeners
document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", startTouch, false);
canvas.addEventListener("touchend", endTouch, false);

function randomPosition() {
    return Math.floor(Math.random() * (canvas.width / box)) * box;
}

// Handle keyboard inputs for controlling direction
function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (keyPressed === 38 && direction !== "DOWN") direction = "UP";
    else if (keyPressed === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (keyPressed === 40 && direction !== "UP") direction = "DOWN";
}

// Handle touch events for swipe controls
function startTouch(event) {
    touchStartX = event.changedTouches[0].pageX;
    touchStartY = event.changedTouches[0].pageY;
}

function endTouch(event) {
    let touchEndX = event.changedTouches[0].pageX;
    let touchEndY = event.changedTouches[0].pageY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe (left or right)
        if (diffX > 0 && direction !== "LEFT") {
            direction = "RIGHT";
        } else if (diffX < 0 && direction !== "RIGHT") {
            direction = "LEFT";
        }
    } else {
        // Vertical swipe (up or down)
        if (diffY > 0 && direction !== "UP") {
            direction = "DOWN";
        } else if (diffY < 0 && direction !== "DOWN") {
            direction = "UP";
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake with realistic head and smaller body segments
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            // Head with eyes and tongue
            ctx.fillStyle = "limegreen";
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();

            // Eyes
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 3, snake[i].y + box / 3, 2, 0, Math.PI * 2);
            ctx.arc(snake[i].x + (2 * box) / 3, snake[i].y + box / 3, 2, 0, Math.PI * 2);
            ctx.fill();

            // Tongue
            ctx.fillStyle = "red";
            ctx.fillRect(snake[i].x + box / 2 - 2, snake[i].y + box, 4, 6);
        } else {
            // Smaller body segments (rectangles), fully connected
            ctx.fillStyle = "green";
            ctx.fillRect(snake[i].x, snake[i].y, bodyBox, bodyBox); // Smaller body segments, connected
        }
    }

    // Draw Fruit Emoji
    ctx.font = `${box}px Arial`;
    ctx.fillText(currentFruit, food.x, food.y + box - 2);

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
        speed = Math.max(50, speed - 5); // Increase speed

        // Generate new food position & type
        food = { x: randomPosition(), y: randomPosition() };
        currentFruit = fruits[Math.floor(Math.random() * fruits.length)];
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
