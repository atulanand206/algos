/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { ROLE_PLAYER, ROLE_QUIZMASTER } from '../../features/Features'
import { StartButton } from './Lobby'

describe('Start Button', () => {
  
  const sandbox = sinon.createSandbox()

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