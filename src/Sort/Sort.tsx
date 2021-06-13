import React from 'react'
import './Sort.scss'
import { bubble, insertion } from './Variations'

type BarProps = {
	value: number
}

const Bar = (props: BarProps) => <div
	className='sort-bar'
	style={{ height: `${props.value * 10}px` }}></div>

type SortProps = {

}

type SortState = {
	data: string
	vals: number[]
	options: ((values: number[], callback: (values: number[]) => void) => void)[]
}

const regex = '\\d+(?: \\d+)+'

class Sort extends React.Component<SortProps, SortState> {

	constructor(props: SortProps) {
		super(props)
		this.state = {
			data: '',
			vals: [],
			options: [bubble, insertion]
		}
		this.sort = this.sort.bind(this)
	}

	change(values: string) {
		this.setState({ data: values, vals: values.split(' ').map(k => parseInt(k)) })
	}

	sort() {
		this.state.options[1](this.state.data.split(' ').map(k => parseInt(k)),
			(values: number[]) => this.setState({ vals: values }))
	}

	render() {
		return <div className='container'>
			<label>Enter two or more numbers separated by spaces</label>
			<input className='numbers'
				type="text" id="numbers" value={this.state.data}
				name="numbers" pattern={regex} required
				onChange={e => this.change(e.target.value)} />
			<input type='submit' value='Sort' onClick={() => this.sort()} />
			<br />
			<div className='sort-wrapper'>
				{this.state.vals.map((value, i) => <Bar key={i} value={value} />)}
			</div>
		</div>
	}
}

export default Sort