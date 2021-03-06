/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { QuizCreator, Reception } from './Reception'

describe('Reception', () => {

  const sandbox = sinon.createSandbox()
  afterEach(() => {
    sandbox.restore()
  })

  it('should render header', () => {
    const props = {
      canCreateQuiz: true,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    expect(wrapper.find('Header')).length(1)
  })

  it('should render create button if can create quiz', () => {
    const props = {
      canCreateQuiz: true,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    expect(wrapper.find('CreateQuiz')).length(1)
  })

  it('should not render create button if cant create quiz', () => {
    const props = {
      canCreateQuiz: false,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    expect(wrapper.find('CreateQuiz')).length(0)
  })

  it('should render quizzes', () => {
    const props = {
      canCreateQuiz: false,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    expect(wrapper.find('Quizzes')).length(1)
  })

  it('should call props.onJoin when clicked quizzes onJoin', () => {
    const props = {
      canCreateQuiz: false,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    wrapper.find('Quizzes').simulate('join')
    expect(props.onJoin.calledOnce).equal(true)
  })

  it('should call props.onWatch when clicked quizzes onWatch', () => {
    const props = {
      canCreateQuiz: false,
      quizzes: [],
      onJoin: sandbox.stub(),
      onWatch: sandbox.stub(),
    }
    const wrapper = shallow(<Reception {...props} />)
    wrapper.find('Quizzes').simulate('watch')
    expect(props.onWatch.calledOnce).equal(true)
  })
})