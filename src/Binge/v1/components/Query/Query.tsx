import './Query.scss'

type QueryProps = {
	label: string
	disabled?: boolean
	hidden?: boolean
	onClick: () => void
}

export const Query = (props: QueryProps) => {
	return (
		<button
			className='query__button'
			disabled={props.disabled}
			hidden={props.hidden}
			onClick={props.onClick}>{props.label}</button>
	)
}