/* eslint-disable jest/valid-expect */
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { Landing } from './Landing'

describe('Landing', () => {

  it('should render header', () => {
    const wrapper = shallow(<Landing />)
    expect(wrapper.find('.landing__header')).length(1)
  })

  it('should render google login button', () => {
    const wrapper = shallow(<Landing />)
    expect(wrapper.find('y')).length(1)
  })

})