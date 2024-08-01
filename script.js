// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');

    const boardSize = 20;
    const boardWidth = gameBoard.offsetWidth / boardSize;
    const boardHeight = gameBoard.offsetHeight / boardSize;

    let snake;
    let direction;
    let food;
    let score;
    let intervalId;

    function startGame() {
        snake = [{ x: 10, y: 0 }];
        direction = { x: 0, y: 1 }; // Set initial direction to move right
        food = spawnFood();
        score = 0;
        scoreDisplay.textContent = score;
        clearInterval(intervalId);
        intervalId = setInterval(updateGame, 100);
        drawGame();
    }

    function spawnFood() {
        let foodX, foodY;
        do {
            foodX = Math.floor(Math.random() * boardWidth);
            foodY = Math.floor(Math.random() * boardHeight);
        } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
        return { x: foodX, y: foodY };
    }

    function updateGame() {
        const head = { ...snake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(intervalId);
            alert('Game Over');
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = score;
            food = spawnFood();
        } else {
            snake.pop();
        }

        drawGame();
    }

    function drawGame() {
        gameBoard.innerHTML = '';
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.left = `${segment.x * boardSize}px`;
            snakeElement.style.top = `${segment.y * boardSize}px`;
            snakeElement.classList.add('snake');
            gameBoard.appendChild(snakeElement);
        });

        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x * boardSize}px`;
        foodElement.style.top = `${food.y * boardSize}px`;
        foodElement.classList.add('food');
        gameBoard.appendChild(foodElement);
    }

    function changeDirection(event) {
        const key = event.keyCode;
        const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;

        switch (key) {
            case LEFT:
                if (direction.x === 0) direction = { x: -1, y: 0 };
                break;
            case UP:
                if (direction.y === 0) direction = { x: 0, y: -1 };
                break;
            case RIGHT:
                if (direction.x === 0) direction = { x: 1, y: 0 };
                break;
            case DOWN:
                if (direction.y === 0) direction = { x: 0, y: 1 };
                break;
        }
    }

    document.addEventListener('keydown', changeDirection);
    startButton.addEventListener('click', startGame);
});
