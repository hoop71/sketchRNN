import React, { Component } from 'react';
import Sketch from 'react-p5'; // puts p5 on the window

import { draw, setup } from './sketch';

export default class App extends Component {
  y = 0;
  direction = '^';

  render() {
    return (
      <div className='App'>
        <h1>Draw Me Something Beautiful</h1>
        <Sketch setup={setup} draw={(p5) => draw(p5)} />
      </div>
    );
  }
}
