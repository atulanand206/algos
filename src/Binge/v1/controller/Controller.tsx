import { useEffect } from 'react'
import { DataStoreManager } from '../dataStore/DataStoreManager'
import { Switcher } from '../Switcher/Switcher'

type Props = {
}

export const Controller = (props: Props) => {

	useEffect(() => {
		DataStoreManager._instance.handlers()
	})

	return (
		<Switcher />
	)
}
