import React from 'react'
import { Point } from './../Jigsaw/Jigsaw';

interface Props {
	translateXWrapper: number
	translateYWrapper: number
	translateYImage: number
	visibility: boolean
	path: string
	start: Point
}

interface State {

}

class Block extends React.Component<Props, State> {
	render() {
		return <div className='canvas-image-block' >
			<div className='canvas-image-wrapper'
				style={{
					transform: `translateX(${this.props.translateXWrapper}px) translateY(${this.props.translateYWrapper}px)`
				}}
			>
				<img className='canvas-image'
					style={{
						clipPath: this.props.path, 
						transform: `translateY(-${this.props.translateYImage}px)`, 
						display: this.props.visibility ? 'block' : 'none'
					}}
					src='anne1.jpeg' alt="Jigsaw#1"
				/>
			</div>
		</div>
	}
}

export default Block