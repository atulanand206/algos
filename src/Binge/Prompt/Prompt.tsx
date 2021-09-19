import { useState } from 'react'
import classNames from 'classnames/bind'
import { QueryBoard } from '../Query/Query'
import './Prompt.scss'
import { State } from '../State/State'

type PromptContainerProps = {
  question: string[]
}

const PromptContainer = (props: PromptContainerProps) => {
  return (
    <div className='prompt__container'>
      {props.question.map(line => <p className='prompt__line'>{line}</p>)}
    </div>
  )
}

type Props = {
  question: string[]
  visibility: boolean
}
 
const Prompt = (props: Props) => {

  return (
    <div className={classNames(
        'prompt__wrapper',
        props.visibility && 'prompt__wrapper-visible')} >
      <PromptContainer question={props.question}/>
      <QueryBoard />
      <State />
    </div>
  )
}

export default Prompt