import { useState } from 'react'
import classNames from 'classnames/bind'
import './Prompt.scss'
import { randomInt } from '../../utils/_helpers'

type PromptContainerProps = {
  question: string[]
}

const PromptContainer = (props: PromptContainerProps) => {
  return (
    <div className={classNames(
      'prompt__container', 
      'prompt__container--pos--' + randomInt(5),
      'prompt__container--color--' + randomInt(5)
      )}>
      {props.question.map(line => <p className='prompt__line'>{line}</p>)}
    </div>
  )
}

type AnswerProps = {
  answer: string
}

const Answer = (props: AnswerProps) => {
  return (
    <div className='prompt__answer'>
      {props.answer}
    </div>
  )
}

type Props = {
  question: string[]
  answer: string
  visibility: boolean
  revealed: boolean
}
 
const Prompt = (props: Props) => {

  return (
    <div className={classNames(
        'prompt__wrapper',
        props.visibility && 'prompt__wrapper-visible')} >
      <PromptContainer question={props.question}/>
      {renderAnswer()}
    </div>
  )

  function renderAnswer() {
    return <Answer answer={props.revealed ? props.answer : '. . .'} />
  }
}

export default Prompt