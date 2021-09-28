type Props = {
	launch: () => void
}

export const Landing = (props: Props) => {

	return (
		<div className='landing__wrapper'>
			<p className='landing__logo'>Binquiz</p>
			<div className='landing__controls'>
				<p className='landing__controls-button' onClick={props.launch}>Let's Begin</p>
			</div>
		</div>
	)
}