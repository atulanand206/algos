/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { ROLE_PLAYER, ROLE_QUIZMASTER } from '../../features/Features'
import { Lobby, StartButton } from './Lobby'

describe('Lobby', () => {

  const sandbox = sinon.createSandbox()

  it('should render header', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_PLAYER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__header')).length(1)
    expect(wrapper.find('Header')).length(1)
  })

  it('should render quizId', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_QUIZMASTER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__quiz--id')).length(1)
  })

  it('should render quizmaster\'s name', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_QUIZMASTER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('.lobby__quizmaster')).length(1)
  })

  it('should render player\'s name if logged in as a player', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_PLAYER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('PlayerLabel')).length(1)
  })

  it('should not render player\'s name if logged in as a quizmaster', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_QUIZMASTER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('PlayerLabel')).length(0)
  })

  it('should render start button', () => {
    const props = {
      player: {
        id: 'playerId',
        name: 'playerName',
        email: 'playerEmail',
      },
      role: ROLE_PLAYER
    }
    const wrapper = shallow(<Lobby {...props} />)
    expect(wrapper.find('StartButton')).length(1)
  })

  describe('Start Button', () => {
    it('should render start button', () => {
      const props = {
        filled: false,
        role: ROLE_PLAYER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('.lobby__start')).length(1)
    })

    it('should show waiting when waiting for players', () => {
      const props = {
        filled: false,
        role: ROLE_PLAYER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('Query').prop('label')).equal('waiting...')
    })

    it('should show start when players filled and logged in as quizmaster', () => {
      const props = {
        filled: true,
        role: ROLE_QUIZMASTER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('Query').prop('label')).equal('start')
    })

    it('should be visible when waiting for players', () => {
      const props = {
        filled: false,
        role: ROLE_QUIZMASTER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('Query').prop('visible')).equal(true)
    })

    it('should be visible when players filled and logged in as quizmaster', () => {
      const props = {
        filled: true,
        role: ROLE_QUIZMASTER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('Query').prop('visible')).equal(true)
    })

    it('should not be visible when players filled and logged in as player', () => {
      const props = {
        filled: true,
        role: ROLE_PLAYER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      expect(wrapper.find('Query').prop('visible')).equal(false)
    })

    it('should call onStart when clicked', () => {
      const props = {
        filled: true,
        role: ROLE_PLAYER,
        onStart: sandbox.spy()
      }
      const wrapper = shallow(<StartButton {...props} />)
      wrapper.find('Query').simulate('click')
      expect(props.onStart.calledOnce).equal(true)
    })
  })
})