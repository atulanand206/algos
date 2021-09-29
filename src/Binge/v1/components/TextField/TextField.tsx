import './TextField.scss'

type Props = {
  placeholder: string
  onChange: (e: any) => void
}

export const TextField = (props: Props) => {
  return <div className='text-field__wrapper'>
    <input className='text-field__input' type='text' id={props.placeholder} placeholder={props.placeholder} onChange={props.onChange} />
  </div>
}