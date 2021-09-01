import { useState } from 'react'
import { Player } from '../../utils/_interfaces'
import Scoreboard from './../Scoreboard/Scoreboard'
import Prompt from '../Prompt/Prompt'
import './Landing.scss'
 
const Landing = () => {
  
  const [visibilityScoreBoard, setVisibilityScoreboard] = useState(false)

  const openScoreboard = () => {
    setVisibilityScoreboard(true)
  }

  const closeScoreboard = () => {
    setVisibilityScoreboard(false)
  }

  const players: Player[] = [
    { name: "Vicky", score: 0 },
    { name: "Rohan", score: 0 },
    { name: "Rohan", score: 0 }
  ]

  return (
    <div className='landing__wrapper'>
      <p className='landing__logo'>Binguiz</p>
      <div className='landing__controls'>
        <button className='landing__controls-button' onClick={openScoreboard}>Let's Begin</button>
        <button className='landing__controls-button' onClick={closeScoreboard}>Scoreboard</button>
      </div>
      {/* <Scoreboard visibility={visibilityScoreBoard} players={players}/> */}
      <Prompt visibility={visibilityScoreBoard} />
    </div>
  )
}

export default Landing