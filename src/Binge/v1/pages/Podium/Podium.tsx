import { ROLE_QUIZMASTER } from "../../features/Features"
import { Header } from "../../components/Header/Header"
import { Query } from "../../components/Query/Query"
import { State } from "../../components/State/State"
import './Podium.scss'
import { Game, Player, Snap } from "../../utils/_interfaces"

type Props = {
	player: Player
	quiz: Game
	role: string
	snapshot: Snap
	onNext: () => void
}

export const Podium = (props: Props) => {

	const quizIdCopied = () => {
		navigator.clipboard.writeText(props.snapshot.quiz_id)
	}

	const visNext = () => {
		return props.role === ROLE_QUIZMASTER && (props.snapshot.event_type === "RIGHT" || !props.snapshot.can_pass) && props.quiz.specs.questions !== props.snapshot.question_no
	}

	const teams = [...props.snapshot.teams]

	const rankedTeams = () => {
		return teams.sort((a, b) => b.score - a.score)
	}

	return <div className='board__wrapper'>
		<div className='board__wrapper--background'></div>
		<header className='board__header'>
			<div className='board__header--background'></div>
			<div className='board__header--logo'><Header /></div>
			<div className='board__header--block board__header--top board__header--right'>
				<p className='board__header--value'>Question {props.snapshot.question_no}</p>
			</div>
			<div className='board__header--block board__header--bottom board__header--right'>
				<p className='board__header--value'>Round {props.snapshot.round_no}</p>
			</div>
			<div className='board__header--block board__header--bottom board__header--left'>
				<p className='board__header--value'>{props.player.name}</p>
			</div>
			<div className='board__header--block board__header--top board__header--left board__header--quizid'>
				<p className='board__header--value' onClick={quizIdCopied}>{props.quiz.specs.name}</p>
			</div>
		</header>
		
		<main className='board__content'>
			
			<section  className='board__controls'>
				<Query label={"Next"} onClick={props.onNext} visible={visNext()} />
			</section>
		</main>
		<footer className='board__footer'>
			<State teams={rankedTeams()} currentTeamId={props.snapshot.team_s_turn} />
		</footer>
	</div>
}