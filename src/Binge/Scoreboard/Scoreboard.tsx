import classNames from 'classnames/bind'
import './Scoreboard.scss'

type Props = {
  visibility: Boolean;
}

const Scoreboard = (props: Props) => {

  return (
    <div className={classNames(
      'scoreboard__wrapper', 
      props.visibility && 'scoreboard__wrapper-visible')} >
      Babes
    </div>
  )
}

export default Scoreboard