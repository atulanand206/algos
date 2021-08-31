import { useState } from 'react';
import './Prompt.scss'
 
const Prompt = () => {
  
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
    </div>
  )
}

export default Prompt