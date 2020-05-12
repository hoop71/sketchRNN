let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let personDrawing = false;

let width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

let height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const availableModels = [
  'bird',
  'ant',
  'ambulance',
  'angel',
  'alarm_clock',
  'antyoga',
  'backpack',
  'barn',
  'basket',
  'bear',
  'bee',
  'beeflower',
  'bicycle',
  'book',
  'brain',
  'bridge',
  'bulldozer',
  'bus',
  'butterfly',
  'cactus',
  'calendar',
  'castle',
  'cat',
  'catbus',
  'catpig',
  'chair',
  'couch',
  'crab',
  'crabchair',
  'crabrabbitfacepig',
  'cruise_ship',
  'diving_board',
  'dog',
  'dogbunny',
  'dolphin',
  'duck',
  'elephant',
  'elephantpig',
  'everything',
  'eye',
  'face',
  'fan',
  'fire_hydrant',
  'firetruck',
  'flamingo',
  'flower',
  'floweryoga',
  'frog',
  'frogsofa',
  'garden',
  'hand',
  'hedgeberry',
  'hedgehog',
  'helicopter',
  'kangaroo',
  'key',
  'lantern',
  'lighthouse',
  'lion',
  'lionsheep',
  'lobster',
  'map',
  'mermaid',
  'monapassport',
  'monkey',
  'mosquito',
  'octopus',
  'owl',
  'paintbrush',
  'palm_tree',
  'parrot',
  'passport',
  'peas',
  'penguin',
  'pig',
  'pigsheep',
  'pineapple',
  'pool',
  'postcard',
  'power_outlet',
  'rabbit',
  'rabbitturtle',
  'radio',
  'radioface',
  'rain',
  'rhinoceros',
  'rifle',
  'roller_coaster',
  'sandwich',
  'scorpion',
  'sea_turtle',
  'sheep',
  'skull',
  'snail',
  'snowflake',
  'speedboat',
  'spider',
  'squirrel',
  'steak',
  'stove',
  'strawberry',
  'swan',
  'swing_set',
  'the_mona_lisa',
  'tiger',
  'toothbrush',
  'toothpaste',
  'tractor',
  'trombone',
  'truck',
  'whale',
  'windmill',
  'yoga',
  'yogabicycle',
];

function preload() {
  sketchRNN = ml5.sketchRNN('the_mona_lisa');
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
  let canvas = createCanvas(width, height);

  // detects users mouse actions
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNStart);
  background(200);
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
