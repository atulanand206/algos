/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { ROLE_PLAYER, ROLE_QUIZMASTER } from '../../features/Features'
import { Lobby } from './Lobby'

describe('Lobby', () => {

  const sandbox = sinon.createSandbox()

  const propsPlayer = {
    player: {
      id: 'playerId',
      name: 'playerName',
      email: 'playerEmail',
    },
    role: ROLE_PLAYER,
    quiz: {
      id: 'quizId',
      quizmaster: {
        id: 'quizmasterId',
        name: 'quizmasterName',
        email: 'quizmasterEmail',
      },
      tags: [],
      specs: {
        name: 'quizName',
        questions: 2,
        teams: 1,
        players: 1,
        rounds: 2,
      },
      active: true,
      can_join: true,
      players_joined: 1,
    },
    teams: [
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
        players: [],
        score: 0,
      }
    ],
    onStart: sandbox.stub(),
  }

  const propsQuizmaster = {
    player: {
      id: 'quizmasterId',
      name: 'quizmasterName',
      email: 'quizmasterEmail',
    },
    role: ROLE_QUIZMASTER,
    quiz: {
      id: 'quizId',
      quizmaster: {
        id: 'quizmasterId',
        name: 'quizmasterName',
        email: 'quizmasterEmail',
      },
      tags: [],
      specs: {
        name: 'quizName',
        questions: 2,
        teams: 1,
        players: 1,
        rounds: 2,
      },
      active: true,
      can_join: true,
      players_joined: 1,
    },
    teams: [
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
        players: [],
        score: 0,
      }
    ],
    onStart: sandbox.stub(),
  }

  it('should render header', () => {
    const props = propsPlayer
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__header')).length(1)
    expect(wrapper.find('Header')).length(1)
  })

  it('should render quizId', () => {
    const props = propsQuizmaster
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__quiz--id')).length(1)
  })

  it('should render quizmaster\'s name', () => {
    const props = propsQuizmaster
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__quizmaster')).length(1)
  })

  it('should render player\'s name if logged in as a player', () => {
    const props = propsPlayer
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('PlayerLabel')).length(1)
  })

  it('should not render player\'s name if logged in as a quizmaster', () => {
    const props = propsQuizmaster
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('PlayerLabel')).length(0)
  })

  it('should render roster', () => {
    const props = propsPlayer
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('Roster')).length(1)
  })

  it('should render start button', () => {
    const props = propsPlayer
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('StartButton')).length(1)
  })

})