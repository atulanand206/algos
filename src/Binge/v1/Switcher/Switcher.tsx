import { useEffect } from "react";
import { useHistory, Router, Switch, Route } from "react-router-dom";
import { Board } from "../pages/Board/Board";
import { Credentials } from "../pages/Credentials/Credentials";
import { Landing } from "../pages/Landing/Landing";
import { Lobby } from "../pages/Lobby/Lobby";

type SwitchProps = {

}

export const Switcher = (props: SwitchProps) => {

  const history = useHistory();

  useEffect(() => {
    history.push("/")
    console.log(history)
  })

  const onLoginSuccess = () => {
    history.push('/reception')
  }

  return (
    <Router history={history} >
      <div>
        <Switch >
          <Route path="/reception" render={() => <Credentials />} />
          <Route path='/quiz' render={() => <Board />} />
          <Route path='/lobby' render={() => <Lobby />} />
          <Route exact path="/" render={() => <Landing onLoginSuccess={onLoginSuccess} />} />
        </Switch>
      </div>
    </Router>
  )
}
