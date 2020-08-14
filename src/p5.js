import React from 'react'
import Sketch from 'react-p5' // puts p5 on the window

import { draw, setup } from './sketch'

const App = () => {
  const p5Ref = React.useRef()
  return (
    <div className="App">
      <h1>Draw Me Something Beautiful</h1>
      <Sketch setup={(p5, parentRef) => setup(p5, parentRef, p5Ref)} draw={() => draw(p5Ref)} />
    </div>
  )
}

export default App
