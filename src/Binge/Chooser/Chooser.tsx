import { Button, TextField } from "@material-ui/core"
import { useState } from "react"
import { Player } from "../../utils/_interfaces"
import './Chooser.scss'

type Props = {
	enter: (event: Player) => void
}

export const Enter = (props: Props) => {

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')

	const enter = () => {
		props.enter({
			id: "!",
			name: name,
			email: email,
			// scores: {
			// 	current: 0,
			// 	overall: 0
			// }
		})
	}

	return (
		<div className='chooser__wrapper'>
			<div className='chooser__modal'>
				<TextField variant="standard" id="outlined-basic" label="Name" onChange={(event) => setName(event.target.value)} />
				<TextField variant="standard" id="outlined-basic" label="Email" onChange={(event) => setEmail(event.target.value)} />
				<Button variant='outlined' color='primary' onClick={enter}>Enter</Button>
			</div>
		</div>
	)
}