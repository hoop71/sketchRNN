// React
import React, { useReducer } from 'react';

// CSS
import './App.css';

// Material
import { makeStyles } from '@material-ui/core';

// Components
import P5 from './p5';

const initialState = {
  currentStroke: null,
  x: null,
  y: null,
  nextPen: 'down',
  modelLoading: true,
  seedPath: [],
  seedPoints: [],
  personDrawing: false,
  sketchRNN: null,
};

const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case `MODLE_LOADING`:
      return { ...state, modelLoading: payload };
    case `NEXT_PEN_END`:
      return { ...state, ...payload };
    case `PERSON_DRAWING`:
      return { ...state, personDrawing: payload };
    case `SEED_POINTS`:
      return { ...state, seedPoints: state.seedPoints.concat(payload) };
    case `SET_CURRENT_STROKE`:
      return { ...state, ...payload };
    case `START_DRAWING`:
      return { ...state, ...payload };
    case `SET_SKETCHRNN`:
      const { sketchRNN, modelLoading } = payload;
      return { ...state, sketchRNN, modelLoading };
    default:
      throw new Error();
  }
};

const useStyles = makeStyles({
  app: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function App() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className='App'>
      <div className={classes.app}>
        <P5 dispatch={dispatch} state={state} />
      </div>
    </div>
  );
}

export default App;
