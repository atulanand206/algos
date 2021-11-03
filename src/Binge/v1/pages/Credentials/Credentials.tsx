import { useState } from "react"
import { useSnapshot } from "valtio"
import { Box } from "../../components/Box/Box"
import { Form } from "../../components/Form/Form"
import { Header } from "../../components/Header/Header"
import * as GameManager from "../../dataStore/GameManager"
import { state } from "../../state/State"
import { Game } from "../../utils/_interfaces"
import { Urls } from "../../utils/_urls"
import './Credentials.scss'
import './Quizzes.scss'


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

export const CreateQuiz = () => {
	return <div className='quizzes__item quizzes__item--create' key={`item.key ${-1}`}>
		<button className='quizzes__item__button' onClick={() => Urls.toCreate()}>Create Quiz</button>
	</div>
}
type QuizProps = {
	item: Game
	canJoin: boolean
	onJoin: () => void
	onWatch: () => void
}

export const Quiz = (props: QuizProps) => {
	const { item } = props
	const total = item.specs.teams * item.specs.players
	return <div className='quizzes__item quizzes__item--quiz' key={`item.key ${item.id}`}>
		<div className='quizzes__item--quizmaster'>{item.quizmaster.name}</div>
		<div className='quizzes__item--name'>{item.specs.name}</div>
		<div className='quizzes__item--rounds'>{item.specs.rounds} Rounds</div>
		<div className='quizzes__item--rounds'>{item.specs.questions} Questions</div>
		<div className='quizzes__item--config'>{item.specs.teams} Teams of {item.specs.players} Players</div>
		<div className='quizzes__item--config'>Players {item.players_joined} / {total}</div>
		{props.canJoin && <button className='quizzes__item__button' onClick={props.onJoin}>Join</button>}
		<button className='quizzes__item__button' onClick={props.onWatch}>Watch</button>
	</div>
}

type QuizzesProps = {
	quizzes: Game[]
	onJoin: (quizId: string) => void
	onWatch: (quizId: string) => void
}

export const Quizzes = (props: QuizzesProps) => {
	return <>{props.quizzes.map((item, ix) => {
		return <Quiz
			item={item}
			key={`item.key ${ix}`}
			canJoin={item.can_join}
			onJoin={() => props.onJoin(item.id)}
			onWatch={() => props.onWatch(item.id)} />
	})}	</>
}

type Props = {
	canCreateQuiz: boolean
	quizzes: Game[]
	onJoin: (quizId: string) => void
	onWatch: (quizId: string) => void
}

export const Reception = (props: Props) => {

	return (
		<div className='credentials__wrapper'>
			<Header />
			<div className='quizzes__list' >
				{props.canCreateQuiz ? <CreateQuiz /> : <></>}
				<Quizzes quizzes={props.quizzes} onJoin={props.onJoin} onWatch={props.onWatch} />
			</div>
		</div>
	)
}

type QuizCreatorProps = {
}

export const QuizCreator = (props: QuizCreatorProps) => {

	const snap = useSnapshot(state)
	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = (action: string) => {
		GameManager.createQuiz(snap, entries)
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
		fields={[Entry_Name, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count]}
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
