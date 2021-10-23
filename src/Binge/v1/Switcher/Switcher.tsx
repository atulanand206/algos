import { Switch, Route, BrowserRouter } from "react-router-dom"
import { Board } from "../pages/Board/Board"
import { QuizCreator, QuizJoiner, QuizWatcher, Reception } from "../pages/Credentials/Credentials"
import { Landing } from "../pages/Landing/Landing"
import { Lobby } from "../pages/Lobby/Lobby"
import './../controller/Controller.scss'

type SwitchProps = {}

export const Switcher = (props: SwitchProps) => {
  return (
    <div className='quiz__wrapper'>
      <BrowserRouter >
        <Switch >
          <Route path="/reception" component={Reception} />
          <Route path="/create" component={QuizCreator} />
          <Route path="/join" component={QuizJoiner} />
          <Route path="/watch" component={QuizWatcher} />
          <Route path='/quiz' component={Board} />
          <Route path='/lobby' component={Lobby} />
          <Route exact path="/" component={Landing} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}
