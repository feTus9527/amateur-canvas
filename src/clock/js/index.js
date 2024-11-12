import { CANVAS_SIZE } from "./config.js";
import {
  drawClockFace,
  drawHourHand,
  drawMinuteHand,
  drawSecondHand,
} from "./draw.js";

const drawClock = (canvas) => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    resolve({ ctx, date: new Date() });
  })
    .then(drawClockFace)
    .then(drawHourHand)
    .then(drawMinuteHand)
    .then(drawSecondHand);
};

(() => {
  const canvas = document.createElement("canvas");
  new Promise((resolve) => {
    drawClock(canvas).then(() => {
      document.querySelector("#app").appendChild(canvas);
    });
    resolve();
  }).then(() => {
    const ticking = () =>
      setInterval(async () => {
        await drawClock(canvas);
      }, 1000);
    ticking();
    let timer = null;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        clearInterval(timer);
        timer = null;
      } else {
        timer = ticking;
      }
    });
  });
})();
