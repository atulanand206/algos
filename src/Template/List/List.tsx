import Item from "../Item/Item"
import { frames } from "../Frames/frames-buttons"

import './List.scss'

const List = () => {
  return <div className='list-wrapper'>{frames.map(i => <Item x={i}/>)}</div>
}

export default List