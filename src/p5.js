import React, { useState } from 'react';
import Sketch from 'react-p5'; // puts p5 on the window

import { makeStyles, FormControl, MenuItem, Select } from '@material-ui/core'

import { draw, setup } from './sketch';

const availableModels = ['bird', 'ant','ambulance','angel','alarm_clock','antyoga','backpack','barn','basket','bear','bee','beeflower','bicycle','book','brain','bridge','bulldozer','bus','butterfly','cactus','calendar','castle','cat','catbus','catpig','chair','couch','crab','crabchair','crabrabbitfacepig','cruise_ship','diving_board','dog','dogbunny','dolphin','duck','elephant','elephantpig','everything','eye','face','fan','fire_hydrant','firetruck','flamingo','flower','floweryoga','frog','frogsofa','garden','hand','hedgeberry','hedgehog','helicopter','kangaroo','key','lantern','lighthouse','lion','lionsheep','lobster','map','mermaid','monapassport','monkey','mosquito','octopus','owl','paintbrush','palm_tree','parrot','passport','peas','penguin','pig','pigsheep','pineapple','pool','postcard','power_outlet','rabbit','rabbitturtle','radio','radioface','rain','rhinoceros','rifle','roller_coaster','sandwich','scorpion','sea_turtle','sheep','skull','snail','snowflake','speedboat','spider','squirrel','steak','stove','strawberry','swan','swing_set','the_mona_lisa','tiger','toothbrush','toothpaste','tractor','trombone','truck','whale','windmill','yoga','yogabicycle'];

const useStyles = makeStyles({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
})

const vowels = ['a', 'e', 'i', 'o', 'u']

const App = () => {
  const [model, setModel] = useState('ant')
  const classes = useStyles()
  return (
    <div className='App'>
      <h1>Draw Me Something Beautiful</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <h4 style={{paddingRight: '1em'}}>{`Maybe a${vowels.includes(model[0]) ? 'n' : ''}`}</h4>
      <FormControl className={classes.formControl}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={model}
        onChange={e => setModel(e.target.value)}
        >
        {availableModels.sort((a, b) => a-b).map(model => {
          return <MenuItem value={model}>{model}</MenuItem>
        })}
      </Select>
    </FormControl>
        </div>
      <Sketch setup={(p5, parents) => setup(p5, parents, model)} draw={(p5) => draw(p5)} />
    </div>
  );
}

export default App;
