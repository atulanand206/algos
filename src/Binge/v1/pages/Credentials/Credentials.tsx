import { useState } from "react"
import { useSnapshot } from "valtio"
import { Box } from "../../components/Box/Box"
import { Form } from "../../components/Form/Form"
import { Header } from "../../components/Header/Header"
import * as GameManager from "../../dataStore/GameManager"
import { state } from "../../state/State"
import './Credentials.scss'

type Props = {
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

export const Reception = (props: Props) => {
	
	const snap = useSnapshot(state)
	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = (action: string) => {
		GameManager.onPlayerCreated(snap, action)
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
		header={''}
		fields={[]}
		actions={[Action_Create, Action_Join, Action_Watch]}
		onSubmit={submit}
		onChange={onChange} />

	return (
		<div className='credentials__wrapper'>
			<Header />
			{credentialsForm}
			<Box height='8em' />
		</div>
	)
}

export const QuizCreator = (props: Props) => {
	
	const snap = useSnapshot(state)
	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = (action: string) => {
		GameManager.formEntered(snap, action, entries)
		entries.clear()
		setEntries(entries)
	}

	const onChange = (entry: string, value: any) => {
		setFormReset(false)
		entries.set(entry, value)
		setEntries(entries)
	}

	const quizMasterSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count]}
		actions={[Action_Create]}
		onSubmit={submit}
		onChange={onChange} />

	return (
		<div className='credentials__wrapper'>
			<Header />
			{quizMasterSpecsForm}
			<Box height='8em' />
		</div>
	)
}

export const QuizJoiner = (props: Props) => {
	
	const snap = useSnapshot(state)
	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = (action: string) => {
		GameManager.formEntered(snap, action, entries)
		entries.clear()
		setEntries(entries)
	}

	const onChange = (entry: string, value: any) => {
		setFormReset(false)
		entries.set(entry, value)
		setEntries(entries)
	}

	const playerSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_QuizId]}
		actions={[Action_Join]}
		onSubmit={submit}
		onChange={onChange} />


	return (
		<div className='credentials__wrapper'>
			<Header />
			{playerSpecsForm}
			<Box height='8em' />
		</div>
	)
}

export const QuizWatcher = (props: Props) => {
	
	const snap = useSnapshot(state)
	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = (action: string) => {
		GameManager.formEntered(snap, action, entries)
		entries.clear()
		setEntries(entries)
	}

	const onChange = (entry: string, value: any) => {
		setFormReset(false)
		entries.set(entry, value)
		setEntries(entries)
	}

	const audienceSpecsForm = <Form
		reset={formReset}
		header={Header_Specs}
		fields={[Entry_QuizId]}
		actions={[Action_Watch]}
		onSubmit={submit}
		onChange={onChange} />

	return (
		<div className='credentials__wrapper'>
			<Header />
			{audienceSpecsForm}
			<Box height='8em' />
		</div>
	)
}