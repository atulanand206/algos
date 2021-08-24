import { useState } from 'react';
import Scoreboard from './../Scoreboard/Scoreboard';
import './Landing.scss'
 
const Landing = () => {
  
  const [visibilityScoreBoard, setVisibilityScoreboard] = useState(false);

  const openScoreboard = () => {
    setVisibilityScoreboard(true)
  }

  const closeScoreboard = () => {
    setVisibilityScoreboard(false)
  }

  return (
    <div className='landing__wrapper'>
      <p className='landing__logo'>Binguiz</p>
      <div className='landing__controls'>
        <button className='landing__controls-button' onClick={openScoreboard}>Let's Begin</button>
        <button className='landing__controls-button' onClick={closeScoreboard}>Scoreboard</button>
      </div>
      <Scoreboard visibility={visibilityScoreBoard}/>
    </div>
  )
}

export default Landing