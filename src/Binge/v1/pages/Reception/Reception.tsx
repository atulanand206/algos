import { useState } from "react"
import { Box } from "../../components/Box/Box"
import { Form } from "../../components/Form/Form"
import { Header } from "../../components/Header/Header"
import { Game, Specs } from "../../utils/_interfaces"
import { Urls } from "../../utils/_urls"
import './Reception.scss'
import './Quizzes.scss'


export const Header_Credentials = 'credentials?'
export const Header_Specs = 'specs?'
export const Entry_Handle = 'handle'
export const Entry_Name = 'name'
export const Entry_TeamsInAQuiz = 'teams in a quiz'
export const Entry_PlayersInATeam = 'players in a team'
export const Entry_Questions_Count = 'questions in a quiz'
export const Entry_Rounds_Count = 'rounds in a question'
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
	return <article className='quizzes__item quizzes__item--quiz' key={`item.key ${item.id}`}>
		<div className='quizzes__item--name'><p className='quizzes__item--value'>{item.specs.name}</p></div>
		<div className='quizzes__item--quizmaster'><p className='quizzes__item--value'>{item.quizmaster.name}</p></div>
		<div className='quizzes__item--rounds'><p className='quizzes__item--value'>{item.specs.rounds}</p></div>
		<div className='quizzes__item--questions'><p className='quizzes__item--value'>{item.specs.questions}</p></div>
		<div className='quizzes__item--config'><p className='quizzes__item--value'>{item.specs.teams} of {item.specs.players}</p></div>
		<div className='quizzes__item--players'><p className='quizzes__item--value'>{item.players_joined} / {total}</p></div>
		<div className='quizzes__item__button-container'>
			{props.canJoin && <button className='quizzes__item__button' onClick={props.onJoin}>Join</button>}
			<button className='quizzes__item__button' onClick={props.onWatch}>Watch</button>
		</div>
	</article>
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
			<section className='quizzes__list' >
				{props.canCreateQuiz ? <CreateQuiz /> : <></>}
				<Quizzes quizzes={props.quizzes} onJoin={props.onJoin} onWatch={props.onWatch} />
			</section>
		</div>
	)
}

type QuizCreatorProps = {
	onCreate: (specs: Specs) => void
}

export const QuizCreator = (props: QuizCreatorProps) => {

	const [entries, setEntries] = useState(new Map())
	const [formReset, setFormReset] = useState(false)

	const submit = () => {
		const specs = {
			name: entries.get(Entry_Name) || 'Binquiz live',
			teams: parseInt(entries.get(Entry_TeamsInAQuiz) || '4'),
			players: parseInt(entries.get(Entry_PlayersInATeam) || '4'),
			questions: parseInt(entries.get(Entry_Questions_Count) || '20'),
			rounds: parseInt(entries.get(Entry_Questions_Count) || '2'),
		}
		props.onCreate(specs)
		entries.clear()
		setEntries(entries)
	}

	const onChange = (entry: string, value: any) => {
		setFormReset(false)
		entries.set(entry, value)
		setEntries(entries)
		console.log(entry, value, entries)
	}

	return (
		<div className='credentials__wrapper'>
			<Header />
			<Form
				reset={formReset}
				header={Header_Specs}
				fields={[Entry_Name, Entry_TeamsInAQuiz, Entry_PlayersInATeam, Entry_Questions_Count, Entry_Rounds_Count]}
				actions={[Action_Create]}
				onSubmit={submit}
				onChange={onChange} />
			<Box height='8em' />
		</div>
	)
}
