type Props = {
  height: string
}

export const Box = (props: Props) => {
  return <div style={{height: props.height}} />
}