// React
import React from 'react'
import Sketch from 'react-p5' // puts p5 on the window

// Libraries
import * as ml5 from 'ml5'

// Utils
import { draw, sketchRNNStart, startDrawing } from './sketch'

let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
let height =
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

const App = () => {
  const p5Ref = React.useRef()
  const ml5Ref = React.useRef()
  const drawModel = React.useState('catpig')
  const [modelLoading, setModelLoading] = React.useState(true)

  React.useEffect(() => {
    const setModel = async () => {
      try {
        const model = await ml5.sketchRNN('catpig', () => {
          console.log(`ml5 loaded`)
          setModelLoading(false)
        })
        ml5Ref.current = model
      } catch (err) {
        console.warn('There was an error loading the model', err)
      }
    }
    setModel()
  }, [drawModel])

  const setup = (p5, parentRef) => {
    p5Ref.current = p5
    let canvas = p5Ref.current.createCanvas(width, height - 30).parent(parentRef)
    canvas.touchStarted(() => startDrawing(p5Ref, ml5Ref))
    canvas.mousePressed(() => startDrawing(p5Ref, ml5Ref))
    canvas.mouseReleased(() => sketchRNNStart(p5Ref, ml5Ref))
    canvas.touchEnded(() => sketchRNNStart(p5Ref, ml5Ref))
    p5Ref.current.background(200)
  }

  return (
    <div className="App">
      <h1>Draw Me Something Beautiful</h1>
      {modelLoading ? (
        <h1>loading...</h1>
      ) : (
        <Sketch setup={setup} draw={() => draw(p5Ref, ml5Ref)} />
      )}
    </div>
  )
}

export default App
