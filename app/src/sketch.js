import * as ml5 from 'ml5';
import { rdp } from './rdp';

let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let seedPoints = [];
let personDrawing = false;

let width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

let height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

function preload() {
  sketchRNN = ml5.sketchRNN('the_mona_lisa');
}

const startDrawing = (p5) => {
  personDrawing = true;
  x = p5.mouseX;
  y = p5.mouseY;
};

const sketchRNNStart = (p5) => {
  personDrawing = false;

  // Perform RDP Line Simplication
  const rdpPoints = [];
  const total = seedPoints.length;
  const start = seedPoints[0];
  const end = seedPoints[total - 1];
  rdpPoints.push(start);
  rdp(0, total - 1, seedPoints, rdpPoints);
  rdpPoints.push(end);

  // Drawing simplified path
  p5.background(255);
  p5.stroke(0);
  p5.strokeWeight(4);
  p5.beginShape();
  p5.noFill();
  for (let v of rdpPoints) {
    p5.vertex(v.x, v.y);
  }
  p5.endShape();

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

export const setup = (p5, parentRef) => {
  console.log(p5);
  console.log('PR: ', parentRef);
  preload();
  let canvas = p5.createCanvas(width, height - 30).parent(parentRef);
  canvas.touchStarted(() => startDrawing(p5));
  canvas.mousePressed(() => startDrawing(p5));
  canvas.mouseReleased(() => sketchRNNStart(p5));
  canvas.touchEnded(() => sketchRNNStart(p5));
  p5.background(200);
  //sketchRNN.generate(gotStrokePath);
  console.log('model loaded');
  p5 = p5;
};

function gotStrokePath(error, strokePath) {
  //console.error(error);
  //console.log(strokePath);
  currentStroke = strokePath;
}

export const draw = (p5) => {
  console.log(p5);
  p5.stroke(0);
  p5.strokeWeight(4);

  if (personDrawing) {
    p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    seedPoints.push(p5.createVector(p5.mouseX, p5.mouseY));
  }

  if (currentStroke) {
    if (nextPen == 'end') {
      sketchRNN.reset();
      sketchRNNStart(p5);
      currentStroke = null;
      nextPen = 'down';
      return;
    }

    if (nextPen == 'down') {
      p5.line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
};
