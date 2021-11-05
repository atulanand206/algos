import GoogleLogin from "react-google-login"
import { Header } from "../../components/Header/Header"
import { Player } from "../../utils/_interfaces"
import './Landing.scss'

type LandingProps = {
	onLogin: (player: Player) => void
}

export const Landing = (props: LandingProps) => {

	const responseFail = (response: any) => {
		console.log(response)
	}

	const responseGoogle = (response: any) => {
		console.log(response)
		const profile = response.profileObj
		const obj: Player = { id: profile.googleId, name: profile.name, email: profile.email }
		console.log(obj)
		props.onLogin(obj)
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
			<header className='landing__header'>
				<Header large/>
			</header>
			<main className='landing__content'>
				{glogin()}
			</main>
		</div>
	)
}
