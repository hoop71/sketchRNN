import { rdp } from './rdp';

import { sketchRNN } from './p5'
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let seedPoints = [];
let personDrawing = false;
let p5Instance;

let width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

let height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;


const startDrawing = (p5) => {
  personDrawing = true;
  x = p5.mouseX;
  y = p5.mouseY;
};

const sketchRNNStart = () => {
  personDrawing = false;

  // Perform RDP Line Simplication
  const rdpPoints = []
  const total = seedPoints.length;
  const start = seedPoints[0];
  const end = seedPoints[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, seedPoints, rdpPoints);
  rdpPoints.push(end);
  // Drawing simplified path
  p5Instance.background(255);
  p5Instance.stroke(0);
  p5Instance.strokeWeight(4);
  p5Instance.beginShape();
  p5Instance.noFill();
  for (let v of rdpPoints) {
    p5Instance.vertex(v.x, v.y);
  }
  p5Instance.endShape();

  x = rdpPoints[rdpPoints.length - 1].x;
  y = rdpPoints[rdpPoints.length - 1].y;

  seedPath = [];
  // Converting to SketchRNN states
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i - 1].x,
      dy: rdpPoints[i].y - rdpPoints[i - 1].y,
      pen: 'down',
    };
    seedPath.push(strokePath);
  }

  sketchRNN.generate(seedPath, gotStrokePath);
};

export const setup = (p5, parentRef, type) => {
  p5Instance = p5
  // preload(type);
  let canvas = p5Instance.createCanvas(width, height - 30).parent(parentRef);
  canvas.touchStarted(() => startDrawing(p5Instance));
  canvas.mousePressed(() => startDrawing(p5Instance));
  canvas.mouseReleased(() => sketchRNNStart(p5Instance));
  canvas.touchEnded(() => sketchRNNStart(p5Instance));
  p5Instance.background(200);
  console.log('model loaded');
};

function gotStrokePath(error, strokePath) {
  currentStroke = strokePath;
}

export const draw = (p5) => {
  p5.stroke(0);
  p5.strokeWeight(4);

  if (personDrawing) {
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    seedPoints.push(p5.createVector(p5.mouseX, p5.mouseY));
  }

  if (currentStroke) {
    if (nextPen === 'end') {
      sketchRNN.reset();
      sketchRNNStart(p5);
      currentStroke = null;
      nextPen = 'down';
      return;
    }

    if (nextPen === 'down') {
      p5.line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
};
