import React from 'react';
import logo from './logo.svg';
import './App.css';

import P5 from './p5';

function App() {
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
