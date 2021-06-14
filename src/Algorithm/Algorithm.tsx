import React from 'react'
import Sort from '../Sort/Sort'
import './Algorithm.scss'

type Props = {

}

type State = {
    tech: number
}

const pieces = ['Bubble', 'Insertion']

class Algorithm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            tech: 0
        }
    }

    click = (idx: number) => {
        this.setState({tech: idx})
    }

    render() {
        return <div>
            <div className='horizontal-list'>
                {pieces.map((piece, ix) =>
                    <div className='recycler-cell-item' key={ix} onClick={(e) => this.click(ix)}>
                        <div className='recycler-cell-content' key={ix} >{piece}</div>
                    </div>)}
            </div>
            <Sort technique={this.state.tech}/>
        </div>
    }
}

export default Algorithm