import { useEffect, useState } from 'react'
import './TextField.scss'

type Props = {
  reset: boolean
  placeholder: string
  onChange: (e: any) => void
}

export const TextField = (props: Props) => {

  const [text, setText] = useState('')

  useEffect(() => {
    setText('') 
  }, [props.reset])

  const onChange = (event: any) => {
    setText(event.target.value)
    props.onChange(event)
  }

  return <div className='text-field__wrapper'>
    <input
      className='text-field__input'
      value={text}
      type='text'
      id={props.placeholder}
      placeholder={`${props.placeholder}...`}
      onChange={onChange}
      autoComplete="off" />
  </div>
}