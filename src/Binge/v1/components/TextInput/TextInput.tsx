import { useEffect, useState } from 'react'
import './TextInput.scss'

type Props = {
  reset: boolean
  placeholder: string
  onChange: (e: any) => void
}

export const TextInput = (props: Props) => {

  const [text, setText] = useState('')

  useEffect(() => {
    setText('')
  }, [props.reset])

  const onChange = (event: any) => {
    setText(event.target.value)
    props.onChange(event)
  }

  return <div className='text-input__wrapper'>
    <input
      className='text-input__input'
      value={text}
      type='text'
      id={props.placeholder}
      placeholder={`${props.placeholder}...`}
      onChange={onChange}
      autoComplete="off" />
  </div>
}