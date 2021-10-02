import './Query.scss'

type QueryProps = {
	label: string
	disabled?: boolean
	hidden?: boolean
	onClick: () => void
}

export const Query = (props: QueryProps) => {
	return (
		<button className='query__button' onClick={props.onClick}>{props.label}</button>
	)
}