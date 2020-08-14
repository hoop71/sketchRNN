import { rdp } from './rdp'

let currentStroke
let x, y
let nextPen = 'down'
let seedPath = []
let seedPoints = []
let personDrawing = false

export const startDrawing = (p5Ref) => {
  personDrawing = true
  x = p5Ref.current.mouseX
  y = p5Ref.current.mouseY
}

export const sketchRNNStart = (p5Ref, ml5Ref) => {
  console.log(`P%: ${p5Ref}current.`)
  personDrawing = false

  // Perform RDP Line Simplication
  const rdpPoints = []
  const total = seedPoints.length
  const start = seedPoints[0]
  const end = seedPoints[total - 1]
  rdpPoints.push(start)
  let a = rdp(0, total - 1, seedPoints, rdpPoints)
  console.log(`AAAAa ${a}`)
  rdpPoints.push(end)
  console.log(`RDPPOINTS: ${rdpPoints}`)
  // Drawing simplified path
  p5Ref.current.background(255)
  p5Ref.current.stroke(0)
  p5Ref.current.strokeWeight(4)
  p5Ref.current.beginShape()
  p5Ref.current.noFill()
  for (let v of rdpPoints) {
    p5Ref.current.vertex(v.x, v.y)
  }
  p5Ref.current.endShape()

  x = rdpPoints[rdpPoints.length - 1].x
  y = rdpPoints[rdpPoints.length - 1].y

  seedPath = []
  console.log(rdpPoints)
  // Converting to SketchRNN states
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i - 1].x,
      dy: rdpPoints[i].y - rdpPoints[i - 1].y,
      pen: 'down'
    }
    seedPath.push(strokePath)
  }
  debugger
  ml5Ref.current.generate(seedPath, gotStrokePath)
}

function gotStrokePath(error, strokePath) {
  currentStroke = strokePath
}

export const draw = (p5Ref, ml5Ref) => {
  p5Ref.current.stroke(0)
  p5Ref.current.strokeWeight(4)

  if (personDrawing) {
    p5Ref.current.line(
      p5Ref.current.mouseX,
      p5Ref.current.mouseY,
      p5Ref.current.pmouseX,
      p5Ref.current.pmouseY
    )
    seedPoints.push(p5Ref.current.createVector(p5Ref.current.mouseX, p5Ref.current.mouseY))
  }

  if (currentStroke) {
    if (nextPen === 'end') {
      ml5Ref.current.reset()
      sketchRNNStart(p5Ref, ml5Ref)
      currentStroke = null
      nextPen = 'down'
      return
    }

    if (nextPen === 'down') {
      p5Ref.current.line(x, y, x + currentStroke.dx, y + currentStroke.dy)
    }
    x += currentStroke.dx
    y += currentStroke.dy
    nextPen = currentStroke.pen
    currentStroke = null
    ml5Ref.current.generate(gotStrokePath)
  }
}
