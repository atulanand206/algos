import './Item.scss'

type Props = {
    x: any;
}

const Item = (props: Props) => {
  return <div className='item-wrapper'>
    {props.x}</div>
}

export default Item