document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const scoreDisplay = document.getElementById("score");
  const startButton = document.getElementById("start-button");
  const gameOverDisplay = document.getElementById("game-over");
  const controls = document.getElementById("controls");
  const upBtn = document.getElementById("up-btn");
  const leftBtn = document.getElementById("left-btn");
  const downBtn = document.getElementById("down-btn");
  const rightBtn = document.getElementById("right-btn");

  const boardSize = 20;
  const boardWidth = gameBoard.clientWidth / boardSize;
  const boardHeight = gameBoard.clientHeight / boardSize;

  let snake;
  let direction;
  let food;
  let score;
  let intervalId;

  function startGame() {
    snake = [{ x: 10, y: 0 }]; // sets start position
    direction = { x: 0, y: 1 }; // sets start direction
    food = spawnFood();
    score = 0; // initializes score counter
    scoreDisplay.textContent = score;
    gameBoard.classList.remove("hidden");
    gameOverDisplay.classList.remove("flex");
    clearInterval(intervalId);
    intervalId = setInterval(updateGame, 100); // movement speed in ms
    drawGame();
  }

  // randomizes food location
  function spawnFood() {
    let foodX, foodY;
    do {
      foodX = Math.floor(Math.random() * boardWidth);
      foodY = Math.floor(Math.random() * boardHeight);
    } while (
      snake.some((segment) => segment.x === foodX && segment.y === foodY)
    );
    return { x: foodX, y: foodY };
  }

  function updateGame() {
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // ends game
    if (
      head.x < 0 ||
      head.x >= boardWidth ||
      head.y < 0 ||
      head.y >= boardHeight ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      clearInterval(intervalId);
      gameBoard.classList.add("hidden");
      gameOverDisplay.classList.add("flex");
      controls.classList.add("hidden");
      startButton.classList.remove("hidden");
      console.log("Game Over");
      return;
    }

    snake.unshift(head);

    // increases score
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
    gameBoard.innerHTML = "";

    // creates and sets position for snake segments
    snake.forEach((segment) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = `${segment.x * boardSize}px`;
      snakeElement.style.top = `${segment.y * boardSize}px`;
      snakeElement.style.width = `${boardSize}px`;
      snakeElement.style.height = `${boardSize}px`;
      snakeElement.classList.add("snake");
      gameBoard.appendChild(snakeElement);
    });

    // creates and sets position for food element
    const foodElement = document.createElement("div");
    foodElement.style.left = `${food.x * boardSize}px`;
    foodElement.style.top = `${food.y * boardSize}px`;
    foodElement.style.width = `${boardSize}px`;
    foodElement.style.height = `${boardSize}px`;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
  }

  let activeButton = null;

  // change direction logic
  function changeDirection(event) {
    const key = event.keyCode;
    const LEFT = 37,
      UP = 38,
      RIGHT = 39,
      DOWN = 40;
    
    // sets parameters for arrow keys on desktop
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

  // sets parameters for touchscreen devices
  function handleControlClick(btnId) {
    switch (btnId) {
      case "left-btn":
        if (direction.x === 0) direction = { x: -1, y: 0 };
        break;
      case "up-btn":
        if (direction.y === 0) direction = { x: 0, y: -1 };
        break;
      case "right-btn":
        if (direction.x === 0) direction = { x: 1, y: 0 };
        break;
      case "down-btn":
        if (direction.y === 0) direction = { x: 0, y: 1 };
        break;
    }
  }

  // improves repsonsiveness by allowing no-lift sliding on touchscreen devices
  function touchStartHandler(event) {
    event.preventDefault();
    activeButton = event.target;
    handleControlClick(activeButton.id);
  }

  function touchMoveHandler(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (
      element &&
      element !== activeButton &&
      element.classList.contains("control-btn")
    ) {
      activeButton = element;
      handleControlClick(activeButton.id);
    }
  }

  function touchEndHandler(event) {
    activeButton = null;
  }

  // uses arrow keys to change direction
  document.addEventListener("keydown", changeDirection);
  startButton.addEventListener("click", startGame);

  // emulates a dpad on touch screen devices
  const buttons = [upBtn, leftBtn, downBtn, rightBtn];
  buttons.forEach((btn) => {
    btn.addEventListener("touchstart", touchStartHandler);
    btn.addEventListener("touchmove", touchMoveHandler);
    btn.addEventListener("touchend", touchEndHandler);

    // adds click event listeners for use with a mouse on desktop
    btn.addEventListener("click", (event) =>
      handleControlClick(event.target.id)
    );
  });
});
