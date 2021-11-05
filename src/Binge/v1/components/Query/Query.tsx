import './Query.scss'

type QueryProps = {
	label: string
	visible?: boolean
	onClick: () => void
}

export const Query = (props: QueryProps) => {
	if (!props.visible) return <></>
	return (
		<button
			className='query__button'
			hidden={props.visible}
			onClick={props.onClick}>{props.label}</button>
	)
}