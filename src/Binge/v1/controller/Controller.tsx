import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import * as GameManager from '../dataStore/GameManager'
import { state } from '../state/State'
import { Switcher } from '../Switcher/Switcher'

type Props = {
}

export const Controller = (props: Props) => {

	const snap = useSnapshot(state)

	useEffect(() => {
		GameManager.handlers(snap)
	})

	return (
		<Switcher />
	)
}
