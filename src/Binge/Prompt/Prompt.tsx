import { useState } from 'react'
import classNames from 'classnames/bind'
import { QueryBoard } from '../Query/Query'
import './Prompt.scss'

type PromptContainerProps = {
  
}

const PromptContainer = (props: PromptContainerProps) => {
  return (
    <div className='prompt__container'>
      <p className='prompt__line'>X was created by a knight who was a physician by profession in the late 19th century.</p>
      <p className='prompt__line'>Y, a character similar to X is seen performing the same acts as X and keeps getting in and out of houses without any trouble and usually with the owner’s consent.</p>
      <p className='prompt__line'>The countries of X and Y are geographically divided by 21 miles. There have been many records for traversing these 21 miles in the history of the continent.</p>
      <p className='prompt__line'>ID X, Y and the 21 miles stretch.</p>
    </div>
  )
}

type Props = {
  visibility: boolean
}
 
const Prompt = (props: Props) => {

  return (
    <div className={classNames(
        'prompt__wrapper',
        props.visibility && 'prompt__wrapper-visible')} >
      <PromptContainer />
      <QueryBoard />
    </div>
  )
}

export default Prompt