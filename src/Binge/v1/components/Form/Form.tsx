import { Query } from "../Query/Query"
import { TextInput } from "../TextInput/TextInput"
import './Form.scss'

type Props = {
  header: string
  fields: string[]
  actions: string[]
  reset: boolean
  onChange: (entry: string, value: string) => void
  onSubmit: (action: string) => void
}

export const Form = (props: Props) => {
  return (
    <div className='form__wrapper'>
      <div className='form__header'>{props.header}</div>
      {props.fields.map((entry) => <TextInput key={entry} placeholder={entry} reset={props.reset} onChange={(event) => props.onChange(entry, event.target.value)} />)}
      <div className='form__buttons'>{props.actions.map((action) => <Query key={action} visible={true} label={action} onClick={() => props.onSubmit(action)}></Query>)}</div>
    </div>
  )
}