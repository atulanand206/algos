import { useState } from 'react'
import { Player } from '../../utils/_interfaces'
import Scoreboard from './../Scoreboard/Scoreboard'
import Prompt from '../Prompt/Prompt'
import './Landing.scss'

const sampleQuestion = [
  'X was created by a knight who was a physician by profession in the late 19th century.',
  'Y, a character similar to X is seen performing the same acts as X and keeps getting in and out of houses without any trouble and usually with the owner’s consent.',
  'The countries of X and Y are geographically divided by 21 miles. There have been many records for traversing these 21 miles in the history of the continent.',
  'ID X, Y and the 21 miles stretch.'
]
 
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
      <Prompt question={sampleQuestion} visibility={visibilityScoreBoard} />
    </div>
  )
}

export default Landing