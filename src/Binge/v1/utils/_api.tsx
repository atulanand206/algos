import { state } from "../state/State";
import { postHeader } from "./authHeader";

export const host = `${process.env.REACT_APP_REST_SCHEME}://${window.location.hostname}:${5000}`

export const findActiveQuizzes = async (playerId: string) => {
  const response = await fetch(`${host}/quizzes/active`, {
		method: "POST",
		body: JSON.stringify({ player_id: playerId }),
		headers: postHeader()
	})
	const status = response.status;
	switch (status) {
		case 200:
			const quizzes = await response.json();
			console.log(quizzes)
			state.quizzes = quizzes
			break;
		default: ;
	}
}