const canvas1 = document.createElement("canvas");
const canvas2 = document.createElement("canvas");
canvas1.width = canvas2.width = 800;
canvas1.height = canvas2.height = 600;

const app = document.querySelector("#app");
app.append(canvas1, canvas2);

const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");

let shapeType = "line";
let color = "#000000";
let strokeWidth = 1;

// toolbar events
const lineBtnEl = document.querySelector("#line-btn");
lineBtnEl.addEventListener("click", function (e) {
  if (!lineBtnEl.classList.contains("active")) {
    document.querySelector(".active")?.classList.remove("active");
    lineBtnEl.classList.add("active");
  }
  shapeType = "line";
});

const rectBtnEl = document.querySelector("#rect-btn");
rectBtnEl.addEventListener("click", function (e) {
  if (!rectBtnEl.classList.contains("active")) {
    document.querySelector(".active")?.classList.remove("active");
    rectBtnEl.classList.add("active");
  }
  shapeType = "rect";
});

const circleBtnEl = document.querySelector("#circle-btn");
circleBtnEl.addEventListener("click", function (e) {
  if (!circleBtnEl.classList.contains("active")) {
    document.querySelector(".active")?.classList.remove("active");
    circleBtnEl.classList.add("active");
  }
  shapeType = "circle";
});

const fillBtnEl = document.querySelector("#fill-btn");
fillBtnEl.addEventListener("click", function (e) {
  if (!fillBtnEl.classList.contains("active")) {
    document.querySelector(".active")?.classList.remove("active");
    fillBtnEl.classList.add("active");
  }
  shapeType = "fill";
});

const eraserBtnEl = document.querySelector("#eraser-btn");
eraserBtnEl.addEventListener("click", function (e) {
  if (!eraserBtnEl.classList.contains("active")) {
    document.querySelector(".active")?.classList.remove("active");
    eraserBtnEl.classList.add("active");
  }
  shapeType = "eraser";
});

const strokeSelectEl = document.querySelector("#stroke-select");
strokeSelectEl.addEventListener("change", function (e) {
  strokeWidth = e.target.value;
});

const colorPickerEl = document.querySelector("#color-picker");
colorPickerEl.addEventListener("change", function (e) {
  color = e.target.value;
});

const clearBtnEl = document.querySelector("#clear-btn");
clearBtnEl.addEventListener("click", function (e) {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
});

const saveBtnEl = document.querySelector("#save-btn");
saveBtnEl.addEventListener("click", function (e) {
  const a = document.createElement("a");
  a.href = canvas1.toDataURL();
  a.download = "save picture";
  a.click();
});

// utils
function setStrokeStyle(ctx) {
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
}

function point2Index(data, x, y) {
  return data.width * 4 * y + x * 4;
}

function hex2rgb(color) {
  color = color.replace("#", "");
  const r = eval("0x" + color.substring(0, 2));
  const g = eval("0x" + color.substring(2, 4));
  const b = eval("0x" + color.substring(4, 6));
  return [r, g, b];
}

// shape class
class Shape {
  constructor(ctx, type, x, y) {
    this.ctx = ctx;
    this.type = type;
    this.x = x;
    this.y = y;
    this.endX = x;
    this.endY = y;
    this.points = [];
  }

  draw() {
    switch (this.type) {
      case "line":
        this.drawLine();
        break;
      case "rect":
        this.drawRect();
        break;
      case "circle":
        this.drawCircle();
        break;
      case "eraser":
        this.drawEraser();
        break;
      case "fill":
        this.drawFill();
        break;
    }
  }

  drawLine() {
    this.ctx.beginPath();
    this.ctx.save();
    setStrokeStyle(this.ctx);
    this.ctx.moveTo(this.x, this.y);
    this.points.forEach((point) => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawRect() {
    this.ctx.beginPath();
    this.ctx.save();
    setStrokeStyle(this.ctx);
    const x = Math.min(this.x, this.endX);
    const y = Math.min(this.y, this.endY);
    const w = Math.abs(this.x - this.endX);
    const h = Math.abs(this.y - this.endY);
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.restore();
  }

  drawCircle() {
    this.ctx.beginPath();
    this.ctx.save();
    setStrokeStyle(this.ctx);
    const r1 = Math.abs(this.x - this.endX) / 2;
    const r2 = Math.abs(this.y - this.endY) / 2;
    const x = Math.min(this.x, this.endX) + r1;
    const y = Math.min(this.y, this.endY) + r2;
    this.ctx.ellipse(x, y, r1, r2, 0, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawEraser() {
    this.ctx.beginPath();
    this.ctx.save();
    this.ctx.globalCompositeOperation = "destination-out";
    setStrokeStyle(this.ctx);
    this.ctx.moveTo(this.x, this.y);
    this.points.forEach((point) => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawFill() {
    const baseImageData = this.ctx.getImageData(this.x, this.y, 1, 1);
    const imageData = this.ctx.getImageData(
      0,
      0,
      canvas1.width,
      canvas1.height,
    );

    const [r, g, b] = hex2rgb(color);

    function change(x, y) {
      const stack = [[x, y, 0]];
      const visited = new Set();
      while (stack.length > 0) {
        const [x, y] = stack.shift();
        if (x < 0 || y < 0 || x > canvas1.width || y > canvas1.height) {
          continue;
        }
        const key = `${x},${y}`;
        if (visited.has(key)) {
          continue;
        }
        const i = point2Index(imageData, x, y);
        if (
          baseImageData.data[0] === imageData.data[i] &&
          baseImageData.data[1] === imageData.data[i + 1] &&
          baseImageData.data[2] === imageData.data[i + 2] &&
          baseImageData.data[3] === imageData.data[i + 3]
        ) {
          visited.add(key);

          imageData.data[i] = r;
          imageData.data[i + 1] = g;
          imageData.data[i + 2] = b;
          imageData.data[i + 3] = 255;

          stack.push([x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y]);
        }
      }
    }

    change(this.x, this.y);
    this.ctx.putImageData(imageData, 0, 0);
  }
}

// draw event
const baseArea = canvas2.getBoundingClientRect();
canvas2.addEventListener("mousedown", function (e) {
  const x = e.clientX - baseArea.left;
  const y = e.clientY - baseArea.top;
  const shape = new Shape(ctx2, shapeType, x, y);

  if (shapeType === "fill") {
    shape.ctx = ctx1;
    shape.draw();
  } else {
    if (shapeType === "eraser") {
      ctx1.save();
      setStrokeStyle(ctx1);
      ctx1.beginPath();
      ctx1.moveTo(x, y);
    } else {
      ctx2.save();
      setStrokeStyle(ctx2);
      ctx2.beginPath();
      ctx2.moveTo(x, y);
    }
    const handleMouseMove = function (e) {
      const ex = e.clientX - baseArea.left;
      const ey = e.clientY - baseArea.top;
      switch (shapeType) {
        case "line":
          ctx2.lineTo(ex, ey);
          ctx2.stroke();
          shape.points.push({ x: ex, y: ey });
          break;
        case "rect":
        case "circle":
          shape.endX = ex;
          shape.endY = ey;
          ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
          shape.draw();
          break;
        case "eraser":
          ctx1.globalCompositeOperation = "destination-out";
          ctx1.lineTo(ex, ey);
          ctx1.stroke();
          shape.points.push({ x: ex, y: ey });
          break;
      }
    };
    const handleMouseUp = function (e) {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      ctx2.restore();
      ctx1.restore();
      shape.ctx = ctx1;
      if (shape.type !== "eraser") {
        shape.draw();
      }
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }
});
