import React, { useState } from 'react';
import Sketch from 'react-p5'; // puts p5 on the window
import * as ml5 from 'ml5';

import {
  makeStyles,
  Button,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';

// import { draw, setup } from './sketch';

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

const useStyles = makeStyles({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
});

const vowels = ['a', 'e', 'i', 'o', 'u'];
export let sketchRNN;

const App = ({ dispatch, state }) => {
  const [model, setModel] = useState('ant');
  const classes = useStyles();

  const draw = (p5) => {
    const { currentStroke, nextPen, personDrawing, x, y } = state;
    p5.stroke(0);
    p5.strokeWeight(4);

    if (personDrawing) {
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
      dispatch({
        type: `SEED_POINTS`,
        payload: p5.createVector(p5.mouseX, p5.mouseY),
      });
    }

    if (currentStroke) {
      if (nextPen === 'end') {
        sketchRNN.reset();
        sketchRNNStart(p5);
        dispatch({
          type: `NEXT_PEN_END`,
          payload: { nextPen: 'down', currentStroke: null },
        });
        return;
      }

      if (nextPen === 'down') {
        p5.line(x, y, x + currentStroke.dx, y + currentStroke.dy);
      }

      dispatch({
        type: `UPDATE`,
        payload: {
          x: x + currentStroke.dx,
          y: y + currentStroke.dy,
          nextPen: currentStroke.pen,
          currentStroke: null,
        },
      });
      sketchRNN.generate(getStrokePath);
    }
  };

  const getStrokePath = (error, strokePath) => {
    dispatch({ type: `SET_CURRENT_STROKE`, payload: strokePath });
  };

  const handleUpdateModel = ({ target }) => {
    const { value } = target;
    reloadSketchRNN(value);
    setModel(value);
  };

  const reloadSketchRNN = (type) => {
    dispatch({ type: `MODLE_LOADING`, payload: true });
    sketchRNN = ml5.sketchRNN(type, (err) => {
      if (err) {
        console.log(err);
      } else {
        dispatch({ type: `MODLE_LOADING`, payload: false });
        console.log('loaded');
      }
    });
  };

  const sketchRNNStart = () => {
    console.log(`starting`);
  };

  const setup = (p5, parentRef, type) => {
    let canvas = p5.createCanvas(width, height - 30).parent(parentRef);
    canvas.touchStarted(() => startDrawing(p5));
    canvas.mousePressed(() => startDrawing(p5));
    canvas.mouseReleased(() =>
      dispatch({ type: `PERSON_DRAWING`, payload: false })
    );
    // canvas.mouseReleased(() => sketchRNNStart(p5));
    // canvas.touchEnded(() => sketchRNNStart(p5));
    p5.background(200);
  };

  const startDrawing = (p5) => {
    dispatch({
      type: `START_DRAWING`,
      payload: {
        personDrawing: true,
        x: p5.mouseX,
        y: p5.mouseY,
      },
    });
  };

  console.log('state', state);
  return (
    <div className='App'>
      <h1>Draw Me Something Beautiful</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <h4 style={{ paddingRight: '1em' }}>{`Maybe a${
          vowels.includes(model[0]) ? 'n' : ''
        }`}</h4>
        <FormControl className={classes.formControl}>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={model}
            onChange={handleUpdateModel}>
            {availableModels
              .sort((a, b) => a - b)
              .map((model) => {
                return (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <Button onClick={() => console.log('draw')}>Draw The Rest</Button>
        {/* <Button onClick={() =>  }>Clear</Button> */}
      </div>
      <Sketch
        draw={(p5) => draw(p5)}
        setup={(p5, parentRef) => setup(p5, parentRef, model)}
        preload={() => {
          sketchRNN = ml5.sketchRNN(model, () => {
            dispatch({
              type: `SET_SKETCHRNN`,
              payload: { sketchRNN, modelLoading: false },
            });
          });
        }}
      />
    </div>
  );
};

export default App;
