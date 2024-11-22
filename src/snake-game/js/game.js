import { CANVAS_SIZE, CELL_NUM } from "./config.js";

class Cell {
  constructor(
    x,
    y,
    color,
    width = CANVAS_SIZE / CELL_NUM,
    height = CANVAS_SIZE / CELL_NUM,
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      (this.x * CANVAS_SIZE) / CELL_NUM,
      (this.y * CANVAS_SIZE) / CELL_NUM,
      this.width,
      this.height,
    );
    ctx.restore();
  }

  clear(ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

class Food extends Cell {
  constructor(x, y) {
    super(x, y, "#1b971b");
  }
}

class SnakeHead extends Cell {
  constructor(x, y) {
    super(x, y, "#ba0bcd");
  }
}

class SnakeBody extends Cell {
  constructor(x, y) {
    super(x, y, "#c168cd");
  }
}

class Snake {
  constructor(x, y) {
    this.head = new SnakeHead(x, y);
    this.body = [];
  }

  draw(ctx) {
    this.head.draw(ctx);
  }
}

class Game {
  constructor(el) {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    this.board = canvas;
    this.grid = Array(CELL_NUM)
      .fill(0)
      .map(() => Array(CELL_NUM).fill(0));
    el.appendChild(canvas);
  }

  run() {
    this.drawGrid();
    this.drawFood();
    this.drawSnake();
  }

  drawGrid() {
    const ctx = this.board.getContext("2d");
    ctx.clearRect(0, 0, this.board.width, this.board.height);
    ctx.save();
    ctx.strokeStyle = "#aaa";
    for (let i = 0; i <= CELL_NUM; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * this.board.width) / CELL_NUM);
      ctx.lineTo(this.board.width, (i * this.board.width) / CELL_NUM);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo((i * this.board.height) / CELL_NUM, 0);
      ctx.lineTo((i * this.board.height) / CELL_NUM, this.board.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFood() {
    const ctx = this.board.getContext("2d");
    const { x, y } = this.generateRandomPosition(1);
    this.food = new Food(x, y);
    this.food.draw(ctx);
  }

  drawSnake() {
    const ctx = this.board.getContext("2d");
    const { x, y } = this.generateRandomPosition(2);
    this.snake = new Snake(x, y);
    this.snake.draw(ctx);
  }

  generateRandomPosition(type) {
    let x, y;
    while (true) {
      x = Math.floor(Math.random() * (CANVAS_SIZE + 1)) % CELL_NUM;
      y = Math.floor(Math.random() * (CANVAS_SIZE + 1)) % CELL_NUM;
      if (this.grid[x][y] === 0) {
        this.grid[x][y] = type;
        break;
      }
    }
    return { x, y };
  }
}

export default Game;
