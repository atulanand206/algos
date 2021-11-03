/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { Landing } from './Landing'

describe('Landing', () => {

  const sandbox = sinon.createSandbox()

  it('should render header', () => {
    const props = {
      onLogin: sandbox.stub(),
    }
    const wrapper = shallow(<Landing {...props} />)
    expect(wrapper.find('.landing__header')).length(1)
  })

  it('should render google login button', () => {
    const props = {
      onLogin: sandbox.stub(),
    }
    const wrapper = shallow(<Landing {...props} />)
    expect(wrapper.find('y')).length(1)
  })

})