/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { ROLE_PLAYER } from '../../features/Features'
import { Podium } from './Podium'

describe('Podium', () => {

  const sandbox = sinon.createSandbox()

  const player = {
    id: 'playerId',
    name: 'playerName',
    email: 'playerEmail',
  }

  const quizmaster = {
    id: 'quizmasterId',
    name: 'quizmasterName',
    email: 'quizmasterEmail',
  }

  const teams = [
    {
      id: 'teamId',
      name: 'teamName',
      players: [
        {
          id: 'playerId',
          name: 'playerName',
          email: 'playerEmail',
        }
      ],
      score: 0,
    },
    {
      id: 'teamId2',
      name: 'teamName',
      players: [
        {
          id: 'playerId2',
          name: 'playerName2',
          email: 'playerEmail2',
        }
      ],
      score: 0,
    }
  ]

  const specs = {
    name: 'quizName',
    questions: 2,
    teams: 1,
    players: 1,
    rounds: 2,
  }

  const quiz = {
    id: 'quizId',
    quizmaster: quizmaster,
    tags: [],
    specs: specs,
    active: true,
    can_join: true,
    players_joined: 1,
  }
  
  const snapshot = {
    quiz_id: 'quizId',
    round_no: 2,
    teams: teams,
    question_no: 1,
    question_id: '',
    team_s_turn: '',
    event_type: 'JOIN',
    score: 0,
    timestamp: new Date().toUTCString(),
    question: [],
    answer: [],
    hint: [],
    can_pass: false
  }

  const propsBoard = {
    player: player,
    quiz: quiz,
    role: ROLE_PLAYER,
    snapshot: snapshot,
    answerRevealed: false,
    onPass: sandbox.spy(),
    onNext: sandbox.spy(),
    onRight: sandbox.spy(),
    onFinish: sandbox.spy(),
  }

  it('should render header', () => {
    const props = propsBoard
    const wrapper = shallow(<Podium {...props} />)
    expect(wrapper.find('.board__header--logo')).length(1)
  })

  it('should render header blocks with details', () => {
    const props = propsBoard
    const wrapper = shallow(<Podium {...props} />)
    expect(wrapper.find('.board__header--block')).length(4)
    expect(wrapper.find('.board__header--value').at(0).text()).equal('Question 1')
    expect(wrapper.find('.board__header--value').at(1).text()).equal('Round 2')
    expect(wrapper.find('.board__header--value').at(2).text()).equal('playerName')
    expect(wrapper.find('.board__header--value').at(3).text()).equal('quizName')
  })

  it('should render question', () => {
    const props = propsBoard
    const wrapper = shallow(<Podium {...props} />)
    expect(wrapper.find('.board__questions')).length(1)
    expect(wrapper.find('.board__questions--line')).length(0)
  })

  it('should not render answer when not revealed', () => {
    const props = propsBoard
    const wrapper = shallow(<Podium {...props} />)
    expect(wrapper.find('.board__answer')).length(0)
  })

})