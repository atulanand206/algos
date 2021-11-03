import { useState } from "react"
import { useSnapshot } from "valtio"
import { Box } from "../../components/Box/Box"
import { Form } from "../../components/Form/Form"
import { Header } from "../../components/Header/Header"
import * as GameManager from "../../dataStore/GameManager"
import { state } from "../../state/State"
import { Urls } from "../../utils/_urls"
import './Credentials.scss'
import './Quizzes.scss'

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

export const CreateQuiz = () => {
	return <div className='quizzes__item quizzes__item--create' key={`item.key ${-1}`}>
		<button className='quizzes__item__button' onClick={() => Urls.toCreate()}>Create Quiz</button>
	</div>
}

export const QuizzesList = () => {

	const scrollContainer = document.querySelector("div");

	if (scrollContainer) {
		scrollContainer.addEventListener("wheel", (evt) => {
				evt.preventDefault();
				scrollContainer.scrollLeft += evt.deltaY;
		});
	}

	const snap = useSnapshot(state);
	console.log(JSON.stringify(snap))
  return (
    <div className='quizzes__list' >
			{snap.can_create_quiz && CreateQuiz()}
      {snap.quizzes.map((item, ix) => {
				const total = item.specs.teams * item.specs.players
        return <div className='quizzes__item quizzes__item--quiz' key={`item.key ${ix}`}>
					<div className='quizzes__item--quizmaster'>{item.quizmaster.name}</div>
					<div className='quizzes__item--name'>{item.specs.name}</div>
					<div className='quizzes__item--rounds'>{item.specs.rounds} Rounds</div>
					<div className='quizzes__item--rounds'>{item.specs.questions} Questions</div>
					<div className='quizzes__item--config'>{item.specs.teams} Teams of {item.specs.players} Players</div>
					<div className='quizzes__item--config'>Players {item.players_joined} / {total}</div>
					{item.can_join && <button className='quizzes__item__button' onClick={() => GameManager.joinPlayer(snap, item.id)}>Join</button>}
					<button className='quizzes__item__button' onClick={() => GameManager.joinAudience(snap, item.id)}>Watch</button>
				</div>
			})}	
    </div>
  );
}

export const Reception = (props: Props) => {
	return (
		<div className='credentials__wrapper'>
			<Header />
			{QuizzesList()}
		</div>
	)
}

export const QuizCreator = (props: Props) => {

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
