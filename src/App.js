import React from 'react';
import './App.css';

import P5 from './p5';

function App() {
  console.log('loading app')
  return (
    <div className='App'>
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <P5 />
      </div>
    </div>
  );
}

export default App;
