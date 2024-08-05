const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const grid = 20;
let count = 0;
let snake = [{ x: grid * 5, y: grid * 5 }];
let direction = { x: grid, y: 0 };
let food = { x: grid * 10, y: grid * 10 };
let gameOver = false;

const gameOverElement = document.getElementById('gameOver');
gameOverElement.classList.add('hidden');

function endGame() {
    gameOver = true;
    gameOverElement.classList.remove('hidden');
}

function startNewGame() {
    snake = [{ x: grid * 5, y: grid * 5 }];
    direction = { x: grid, y: 0 };
    food = { x: grid * 10, y: grid * 10 };
    gameOver = false;
    gameOverElement.classList.add('hidden');
    requestAnimationFrame(gameLoop);
}

document.getElementById('restartButton').addEventListener('click', startNewGame);

// Make sure to call startNewGame() when the page loads
startNewGame();

function gameLoop() {
    if (gameOver) return;

    requestAnimationFrame(gameLoop);

    if (++count < 4) {
        return;
    }

    count = 0;
    
    // Clear the canvas with black instead of default white
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw green walls
    context.strokeStyle = 'green';
    context.lineWidth = 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    snake.unshift({ x: snake[0].x + direction.x, y: snake[0].y + direction.y });

    // Check collision with walls
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        endGame();
        return;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            endGame();
            return;
        }
    }

    if (snake[0].x === food.x && snake[0].y === food.y) {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    } else {
        snake.pop();
    }

    context.fillStyle = 'lime';
    snake.forEach(function (segment) {
        context.fillRect(segment.x, segment.y, grid - 1, grid - 1);
    });

    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'w' && direction.y === 0) {
        direction = { x: 0, y: -grid };
    } else if (e.key === 's' && direction.y === 0) {
        direction = { x: 0, y: grid };
    } else if (e.key === 'a' && direction.x === 0) {
        direction = { x: -grid, y: 0 };
    } else if (e.key === 'd' && direction.x === 0) {
        direction = { x: grid, y: 0 };
    }
});

requestAnimationFrame(gameLoop);