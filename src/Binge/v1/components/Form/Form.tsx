import { TextField } from "../TextField/TextField"
import './Form.scss'

type Props = {
  header: string
  fields: string[]
  actions: string[]
  onSubmit: (action: string, entries: Map<string, string>) => void
}

export const Form = (props: Props) => {

  const entries = new Map()

  return (
    <div className='form__wrapper'>
      <div className='form__header'>{props.header}</div>
      {props.fields.map((entry) => <TextField placeholder={entry} onChange={(event) => entries.set(entry, event.target.value)} />)}
      <div className='form__buttons'>{props.actions.map((action) => <button className='form__button' onClick={() => props.onSubmit(action, entries)}>{action}</button>)}</div>
    </div>
  )
}