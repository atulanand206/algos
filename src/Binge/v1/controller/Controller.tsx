import { useEffect } from 'react'
import { GameManager } from '../dataStore/GameManager'
import { Switcher } from '../Switcher/Switcher'

type Props = {
}

export const Controller = (props: Props) => {

	useEffect(() => {
		GameManager._instance.handlers()
	})

	return (
		<Switcher />
	)
}
