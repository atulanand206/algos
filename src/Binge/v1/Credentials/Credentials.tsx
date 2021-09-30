import { useEffect, useState } from "react"
import { Box } from "../components/Box/Box"
import { Form } from "../components/Form/Form"
import './Credentials.scss'

type Props = {
	type: string
	enter: (action: string, entries: Map<string, string>) => void
}

export const Header_Credentials = 'credentials?'
export const Header_Specs = 'specs?'
export const Entry_Handle = 'handle'
export const Entry_Name = 'name'
export const Entry_TeamsInAQuiz = 'teams in a quiz'
export const Entry_PlayersInATeam = 'players in a team'
export const Entry_Questions_Count = 'questions in a quiz'
export const Entry_QuizId = 'quiz id'
export const Action_Create = 'create'
export const Action_Join = 'join'
export const Action_Watch = 'watch'
export const Form_Credentials = 'form'
export const Form_QuizMaster = 'quizmaster'
export const Form_Player = 'player'
export const Form_Audience = 'audience'

export const Credentials = (props: Props) => {

	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	useEffect(() => {
		setFormReset(true)
	}, [props.type])

	const submit = (action: string) => {
		props.enter(action, entries)
		entries.clear()
		setEntries(entries)
	}

	const onChange = (entry: string, value: any) => {
		setFormReset(false)
		entries.set(entry, value)
		setEntries(entries)
	}

	const credentialsForm = <Form
		reset={formReset}
		header={Header_Credentials}
		fields={[Entry_Handle, Entry_Name]}
		actions={[Action_Create, Action_Join, Action_Watch]}
		onSubmit={submit}
		onChange={onChange} />

	const quizMasterSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count]}
		actions={[Action_Create]}
		onSubmit={submit}
		onChange={onChange} />

	const playerSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_QuizId]}
		actions={[Action_Join]}
		onSubmit={submit}
		onChange={onChange} />

	const audienceSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_QuizId]}
		actions={[Action_Watch]}
		onSubmit={submit}
		onChange={onChange} />

	const form = () => {
		switch (props.type) {
			case Form_Credentials: return credentialsForm
			case Form_QuizMaster: return quizMasterSpecsForm
			case Form_Player: return playerSpecsForm
			case Form_Audience: return audienceSpecsForm
		}
	}

	return (
		<div className='credentials__wrapper'>
			<p className='credentials__logo'>Binquiz</p>
			{form()}
			<Box height='8em' />
		</div>
	)
}