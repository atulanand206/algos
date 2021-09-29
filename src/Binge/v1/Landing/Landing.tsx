import './Landing.scss'

type Props = {
	enter: () => void
}

export const Landing = (props: Props) => {

	return (
		<div className='landing__wrapper'>
			<p className='landing__logo'>Binquiz</p>
			<p className='landing__button' onClick={props.enter}>enter</p>
		</div>
	)
}