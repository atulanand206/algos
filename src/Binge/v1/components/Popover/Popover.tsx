import { ReactElement } from 'react'
import './Popover.scss'

type Props = {
  content: ReactElement
}

export const Popover = (props: Props) => {
  return (
    <div className='popover__wrapper'>
      {props.content}
    </div>
  )
}