// React
import React from 'react'
import Sketch from 'react-p5' // puts p5 on the window

// Libraries
import * as ml5 from 'ml5'

// Components
import { Select } from 'components'
import { Button } from '@material-ui/core'

// Utils
import { draw, resetSeeds, sketchRNNStart, startDrawing } from './sketch'

// Simple get window height
let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
let height =
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

const App = () => {
  const p5Ref = React.useRef() // holds p5 ref
  const ml5Ref = React.useRef() // hold ml5 ref

  // What are we drawing and is it loaded
  const [drawModel, setDrawModel] = React.useState('catpig')
  const [modelLoading, setModelLoading] = React.useState(true)

  // Are we currently drawing?
  const [personDrawing, setPersonDrawing] = React.useState(false)
  const nextPenRef = React.useRef('down')
  const currentStrokeRef = React.useRef(null)

  React.useEffect(() => {
    const setModel = async () => {
      setModelLoading(true)
      try {
        const model = await ml5.sketchRNN(drawModel, () => {
          ml5Ref.current = model
          console.log(`ml5 loaded`)
          setModelLoading(false)
        })
      } catch (err) {
        setModelLoading(false)
        console.warn('There was an error loading the model', err)
      }
    }
    setModel()
  }, [drawModel])

  const handleEndDrawing = () => {
    setPersonDrawing(false)
    sketchRNNStart({ p5Ref, ml5Ref, currentStrokeRef })
  }

  const handleStartDrawing = () => {
    setPersonDrawing(true)
    startDrawing(p5Ref)
  }

  const handleStop = () => {
    nextPenRef.current = 'down'
    currentStrokeRef.current = null
    setPersonDrawing(false)
    resetSeeds()
    ml5Ref.current.reset()
  }

  const setup = (p5, parentRef) => {
    p5Ref.current = p5
    let canvas = p5Ref.current.createCanvas(width, height - 30).parent(parentRef)
    canvas.touchStarted(handleStartDrawing)
    canvas.mousePressed(handleStartDrawing)
    canvas.mouseReleased(handleEndDrawing)
    canvas.touchEnded(handleEndDrawing)
    p5Ref.current.background(200)
  }

  console.log(`Person Drawing: ${personDrawing}`)

  return (
    <div className="App">
      <h1>Draw Me Something Beautiful</h1>
      <Select drawModel={drawModel} setDrawModel={setDrawModel} />
      <Button onClick={handleStop} color="primary" variant="contained">
        Stop Drawing
      </Button>
      <Button onClick={() => p5Ref.current.clear()} color="primary" variant="contained">
        Reset
      </Button>
      {modelLoading ? (
        <h1>loading...</h1>
      ) : (
        <Sketch
          setup={setup}
          draw={() =>
            draw({
              p5Ref,
              ml5Ref,
              personDrawing,
              setPersonDrawing,
              handleStartDrawing,
              nextPenRef,
              currentStrokeRef
            })
          }
        />
      )}
    </div>
  )
}

export default App
