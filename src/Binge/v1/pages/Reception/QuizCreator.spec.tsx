/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { QuizCreator } from './Reception'

describe('QuizCreator', () => {

  const sandbox = sinon.createSandbox()
  afterEach(() => {
    sandbox.restore()
  })

  it('should render header', () => {
    const props = {
      onCreate: sandbox.stub(),
    }
    const wrapper = shallow(<QuizCreator {...props} />)
    expect(wrapper.find('Header')).length(1)
  })

  it('should render quiz creator form', () => {
    const props = {
      onCreate: sandbox.stub(),
    }
    const wrapper = shallow(<QuizCreator {...props} />)
    expect(wrapper.find('Form')).length(1)
    expect(wrapper.find('Form').at(0).prop('header')).equal('specs?')
    expect(wrapper.find('Form').at(0).prop('fields')).deep.equal(
      ['name', 'teams in a quiz', 'players in a team',
        'questions in a quiz', 'rounds in a question'])
    expect(wrapper.find('Form').at(0).prop('actions')).deep.equal(['create'])
  })
})