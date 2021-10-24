import { Box } from "@material-ui/core"
import GoogleLogin from "react-google-login"
import { useSnapshot } from "valtio"
import *  as GameManager from "../../dataStore/GameManager"
import { state } from "../../state/State"
import { Player } from "../../utils/_interfaces"
import './Landing.scss'

type LandingProps = {
}

export const Landing = (props: LandingProps) => {

	const snap = useSnapshot(state)

	const responseGoogle = (response: any) => {
		const profile = response.profileObj
		const obj: Player = { id: profile.googleId, name: profile.name, email: profile.email }
		console.log(obj)
		GameManager.onLoginSuccess(snap, obj)
	}

	const glogin = () => {
		return <GoogleLogin
			clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
			buttonText="Let's Begin!"
			fetchBasicProfile
			onSuccess={responseGoogle}
			onFailure={responseGoogle}
			cookiePolicy={'single_host_origin'}
		/>
	}

	return (
		<div className='landing__wrapper'>
			<p className='landing__logo'>Binquiz</p>
			{glogin()}
			<Box height='16em' />
		</div>
	)
}
