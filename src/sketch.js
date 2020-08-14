import { rdp } from './rdp'

let x, y
let seedPath = []
let seedPoints = []

export const startDrawing = (p5Ref) => {
  x = p5Ref.current.mouseX
  y = p5Ref.current.mouseY
}

export const resetSeeds = () => {
  seedPath = []
  seedPoints = []
}

export const sketchRNNStart = ({ p5Ref, ml5Ref, setPersonDrawing, currentStrokeRef }) => {
  if (setPersonDrawing) setPersonDrawing(false)

  // Perform RDP Line Simplication
  const rdpPoints = []
  const total = seedPoints.length
  const start = seedPoints[0]
  const end = seedPoints[total - 1]
  rdpPoints.push(start)

  rdp(0, total - 1, seedPoints, rdpPoints)
  rdpPoints.push(end)

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

  // Converting to SketchRNN states
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i - 1].x,
      dy: rdpPoints[i].y - rdpPoints[i - 1].y,
      pen: 'down'
    }
    seedPath.push(strokePath)
  }
  ml5Ref.current.generate(seedPath, (_, strokePath) =>
    gotStrokePath({ currentStrokeRef, strokePath })
  )
}

const gotStrokePath = ({ currentStrokeRef, strokePath }) => {
  currentStrokeRef.current = strokePath
}

export const draw = ({
  p5Ref,
  ml5Ref,
  personDrawing,
  setPersonDrawing,
  nextPenRef,
  currentStrokeRef
}) => {
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

  if (currentStrokeRef.current) {
    if (nextPenRef.current === 'end') {
      console.log('nextPenRef', nextPenRef.current)
      ml5Ref.current.reset()
      sketchRNNStart({ p5Ref, ml5Ref, setPersonDrawing, currentStrokeRef })
      currentStrokeRef.current = null
      nextPenRef.current = 'down'
      return
    }

    if (nextPenRef.current === 'down') {
      p5Ref.current.line(x, y, x + currentStrokeRef.current.dx, y + currentStrokeRef.current.dy)
    }
    x += currentStrokeRef.current.dx
    y += currentStrokeRef.current.dy
    nextPenRef.current = currentStrokeRef.current.pen
    currentStrokeRef.current = null
    ml5Ref.current.generate((_, strokePath) => gotStrokePath({ currentStrokeRef, strokePath }))
  }
}
