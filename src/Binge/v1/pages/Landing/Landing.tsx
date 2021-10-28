import GoogleLogin from "react-google-login"
import { useSnapshot } from "valtio"
import { Header } from "../../components/Header/Header"
import *  as GameManager from "../../dataStore/GameManager"
import { state } from "../../state/State"
import { Player } from "../../utils/_interfaces"
import './Landing.scss'

type LandingProps = {
}

export const Landing = (props: LandingProps) => {

	const snap = useSnapshot(state)

	const responseFail = (response: any) => {
		console.log(response)
	}

	const responseGoogle = (response: any) => {
		console.log(response)
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
			onFailure={responseFail}
			cookiePolicy={'single_host_origin'}
		/>
	}

	return (
		<div className='landing__wrapper'>
			<div className='landing__header'>
				<Header large/>
			</div>
			<div className='landing__content'>
				{glogin()}
			</div>
		</div>
	)
}
