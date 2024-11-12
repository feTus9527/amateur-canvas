import { getClockFaceRadius } from "./util.js";
import {
  BOLD_MARKER_LINE_COLOR,
  BOLD_MARKER_LINE_HEIGHT,
  BOLD_MARKER_LINE_WIDTH,
  CANVAS_SIZE,
  CLOCK_NUMBER_MARGIN,
  CLOCK_NUMBER_SIZE,
  HOUR_HAND_HEIGHT,
  HOUR_HAND_OVERFLOW_HEIGHT,
  HOUR_HAND_POINTER,
  HOUR_HAND_POINTER_CONTROL_X,
  HOUR_HAND_POINTER_HEIGHT,
  HOUR_HAND_WIDTH,
  MINUTE_HAND_HEIGHT,
  MINUTE_HAND_OVERFLOW_HEIGHT,
  MINUTE_HAND_POINTER,
  MINUTE_HAND_POINTER_CONTROL_X,
  MINUTE_HAND_POINTER_HEIGHT,
  MINUTE_HAND_WIDTH,
  NORMAL_MARKER_LINE_COLOR,
  NORMAL_MARKER_LINE_HEIGHT,
  NORMAL_MARKER_LINE_WIDTH,
  SECOND_HAND_COLOR,
  SECOND_HAND_HEIGHT,
  SECOND_HAND_OVERFLOW_HEIGHT,
  SECOND_HAND_WIDTH,
} from "./config.js";

export const drawClockFace = ({ ctx, date }) => {
  const clockFaceRadius = getClockFaceRadius(CANVAS_SIZE);
  // basic clock face
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, clockFaceRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // bolder marker
  ctx.save();
  ctx.strokeStyle = BOLD_MARKER_LINE_COLOR;
  ctx.lineWidth = BOLD_MARKER_LINE_WIDTH;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -clockFaceRadius);
    ctx.lineTo(0, BOLD_MARKER_LINE_HEIGHT - clockFaceRadius);
    ctx.rotate(Math.PI / 6);
    ctx.stroke();
  }
  ctx.restore();

  // normal marker
  ctx.save();
  ctx.strokeStyle = NORMAL_MARKER_LINE_COLOR;
  ctx.lineWidth = NORMAL_MARKER_LINE_WIDTH;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    if (i % 5 !== 0) {
      ctx.moveTo(0, -clockFaceRadius);
      ctx.lineTo(0, NORMAL_MARKER_LINE_HEIGHT - clockFaceRadius);
    }
    ctx.rotate(Math.PI / 30);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  // hour number
  ctx.font = CLOCK_NUMBER_SIZE;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (Math.PI / 6) * i - Math.PI / 2;
    ctx.fillText(
      i + "",
      (clockFaceRadius - CLOCK_NUMBER_MARGIN) * Math.cos(angle),
      (clockFaceRadius - CLOCK_NUMBER_MARGIN) * Math.sin(angle),
    );
  }
  ctx.restore();

  return { ctx, date };
};

export const drawHourHand = ({ ctx, date }) => {
  // hour hand
  ctx.save();
  ctx.rotate(
    ((date.getHours() % 12) * Math.PI) / 6 +
      (date.getMinutes() * Math.PI) / 360,
  );
  ctx.beginPath();
  ctx.lineWidth = HOUR_HAND_WIDTH;
  ctx.moveTo(0, HOUR_HAND_OVERFLOW_HEIGHT);
  ctx.lineTo(0, HOUR_HAND_OVERFLOW_HEIGHT - HOUR_HAND_HEIGHT);
  if (HOUR_HAND_POINTER) {
    ctx.quadraticCurveTo(
      -HOUR_HAND_POINTER_CONTROL_X,
      HOUR_HAND_OVERFLOW_HEIGHT - HOUR_HAND_HEIGHT,
      0,
      HOUR_HAND_OVERFLOW_HEIGHT - HOUR_HAND_HEIGHT - HOUR_HAND_POINTER_HEIGHT,
    );
    ctx.quadraticCurveTo(
      HOUR_HAND_POINTER_CONTROL_X,
      HOUR_HAND_OVERFLOW_HEIGHT - HOUR_HAND_HEIGHT,
      0,
      HOUR_HAND_OVERFLOW_HEIGHT - HOUR_HAND_HEIGHT,
    );
    ctx.fill();
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
  return { ctx, date };
};

export const drawMinuteHand = ({ ctx, date }) => {
  // minute hand
  ctx.save();
  ctx.rotate(
    (date.getMinutes() * Math.PI) / 30 + (date.getSeconds() * Math.PI) / 1800,
  );
  ctx.beginPath();
  ctx.lineWidth = MINUTE_HAND_WIDTH;
  ctx.moveTo(0, MINUTE_HAND_OVERFLOW_HEIGHT);
  ctx.lineTo(0, MINUTE_HAND_OVERFLOW_HEIGHT - MINUTE_HAND_HEIGHT);
  if (MINUTE_HAND_POINTER) {
    ctx.quadraticCurveTo(
      -MINUTE_HAND_POINTER_CONTROL_X,
      MINUTE_HAND_OVERFLOW_HEIGHT - MINUTE_HAND_HEIGHT,
      0,
      MINUTE_HAND_OVERFLOW_HEIGHT -
        MINUTE_HAND_HEIGHT -
        MINUTE_HAND_POINTER_HEIGHT,
    );
    ctx.quadraticCurveTo(
      MINUTE_HAND_POINTER_CONTROL_X,
      MINUTE_HAND_OVERFLOW_HEIGHT - MINUTE_HAND_HEIGHT,
      0,
      MINUTE_HAND_OVERFLOW_HEIGHT - MINUTE_HAND_HEIGHT,
    );
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
  return { ctx, date };
};

export const drawSecondHand = ({ ctx, date }) => {
  // second hand
  ctx.save();
  ctx.rotate((date.getSeconds() * Math.PI) / 30);
  ctx.beginPath();
  ctx.lineWidth = SECOND_HAND_WIDTH;
  ctx.strokeStyle = SECOND_HAND_COLOR;
  ctx.moveTo(0, SECOND_HAND_OVERFLOW_HEIGHT);
  ctx.lineTo(0, SECOND_HAND_OVERFLOW_HEIGHT - SECOND_HAND_HEIGHT);
  ctx.stroke();
  ctx.restore();
  return { ctx, date };
};
