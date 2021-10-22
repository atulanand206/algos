import { Box } from "@material-ui/core"
import GoogleLogin from "react-google-login"
import { DataStoreManager } from "../../dataStore/DataStoreManager"
import { Player } from "../../utils/_interfaces"

type LandingProps = {
	onLoginSuccess: () => void
}

export const Landing = (props: LandingProps) => {

	const responseGoogle = (response: any) => {
		const profile = response.profileObj
		const obj: Player = { id: profile.googleId, name: profile.name, email: profile.email }
		DataStoreManager._instance.onLoginSuccess(obj, props.onLoginSuccess)
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
