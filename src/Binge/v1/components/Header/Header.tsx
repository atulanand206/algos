import './Header.scss'

type Props = {
	large?: boolean
}

export const Header = (props: Props) => {
	const classN = props.large ? 'header__logo header__logo--large' : 'header__logo header__logo--normal'
	return (
		<p className={classN}>Binquiz</p>
	)
}