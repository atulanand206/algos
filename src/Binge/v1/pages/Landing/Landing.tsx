import { Box } from '../../components/Box/Box'
import './Landing.scss'

type Props = {
	launch: () => void
}

export const Landing = (props: Props) => {

	return (
		<div className='landing__wrapper'>
			<p className='landing__logo'>Binquiz</p>
			<p className='landing__button' onClick={props.launch}>enter</p>
			<Box height='16em' />
		</div>
	)
}