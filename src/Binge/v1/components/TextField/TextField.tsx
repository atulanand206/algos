import classNames from 'classnames'
import './TextField.scss'

type Props = {
  value: string
  editable: boolean
}

export const TextField = (props: Props) => {

  return <div className={classNames('text-field__wrapper')}>
    <p className={classNames('text-field__value', props.editable && 'text-field__value--editable')} id={props.value} >{props.value}</p>
  </div>
}