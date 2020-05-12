let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let personDrawing = false;

function preload() {
  sketchRNN = ml5.sketchRNN('cat');
}

function startDrawing() {
  personDrawing = true;
  x = mouseX;
  y = mouseY;
}

function sketchRNNStart() {
  personDrawing = false;
  sketchRNN.generate(seedPath, gotStrokePath);
}

function setup() {
  let canvas = createCanvas(600, 600);

  // detects users mouse actions
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNStart);
  background(255);
  // sketchRNN.generate(gotStrokePath);
  console.log('model loaded');
}

function gotStrokePath(err, strokePath) {
  // console.log(strokePath);
  currentStroke = strokePath;
}

function draw() {
  stroke(0);
  strokeWeight(4);
  if (personDrawing) {
    let strokePath = {
      dx: mouseX - pmouseX, // mouse postion - previous
      dy: mouseY - pmouseY,
      pen: 'down',
    };
    line(x, y, x + strokePath.dx, y + strokePath.dy);
    x += strokePath.dx;
    y += strokePath.dy;

    seedPath.push(strokePath);
  }

  if (currentStroke) {
    console.log('draw machine');
    if (nextPen === 'end') {
      noLoop(); // kill sketch and stop
      return;
    }

    if (nextPen === 'down') {
      console.log('down');
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }

    // currentStroke.pen looks at next dx, dy, where the draw ended
    nextPen = currentStroke.pen;
    x += currentStroke.dx;
    y += currentStroke.dy;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
}
