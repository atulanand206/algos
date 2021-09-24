import React from "react";
import { Point } from "../Jigsaw/Jigsaw";

export const TSvg = (points: Point[]) => {
	return (
		<svg>
			<circle cx={50} cy={50} r={10} fill="red" />
		</svg>
	)
}

type BodyProps = {

}

type BodyState = {
	
}

class TSvgBody extends React.Component<BodyProps, BodyState> {
	static defaultProps = { multiplier: 20 };

  prepareData() {
    // let d = [`M ${this.props.x} ${this.props.y}`];

    // let collector = this.props.data.map(chunk => {
    //   let xNext = this.props.x + chunk[0] * this.props.multiplier;
    //   let yNext = this.props.y - chunk[1] * this.props.multiplier;
    //   return `L ${xNext} ${yNext}`;
    // });

    // return d.concat(collector).join(' ');
    return []
  }

  render() {
    let d = this.prepareData();
    return(
      <path 
      // d={d}
        stroke="orange"
        strokeWidth={1}
        fill="none"
      />
    )
  }
}