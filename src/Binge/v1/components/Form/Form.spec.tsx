import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { Form } from './Form'

describe('Form', () => {

  const sandbox = sinon.createSandbox()
  afterEach(() => {
    sandbox.restore()
  })

  it('should render form header', () => {
    const props = {
      header: 'Test header',
      fields: [],
      actions: [],
      reset: false,
      onChange: sandbox.stub(),
      onSubmit: sandbox.stub(),
    }
    const wrapper = shallow(<Form {...props} />)
    expect(wrapper.find('.form__header').text()).equal('Test header')
  })

  it('should render form button', () => {
    const props = {
      header: 'Test header',
      fields: [],
      actions: [],
      reset: false,
      onChange: sandbox.stub(),
      onSubmit: sandbox.stub(),
    }
    const wrapper = shallow(<Form {...props} />)
    expect(wrapper.find('.form__buttons')).length(1)
  })

  it('should render form entries', () => {
    const props = {
      header: 'Test header',
      fields: ['placeholder'],
      actions: ['jump'],
      reset: false,
      onChange: sandbox.stub(),
      onSubmit: sandbox.stub(),
    }
    const wrapper = shallow(<Form {...props} />)
    expect(wrapper.find('TextInput')).length(1)
    expect(wrapper.find('TextInput').prop('placeholder')).equal('placeholder')
  })

  it('should change text on TextInput.onChange', () => {
    const props = {
      header: 'Test header',
      fields: ['placeholder'],
      actions: ['jump'],
      reset: false,
      onChange: sandbox.stub(),
      onSubmit: sandbox.stub(),
    }
    const wrapper = shallow(<Form {...props} />)
    wrapper.find('TextInput').simulate('change', { target: { value: 'test' } })
    expect(props.onChange.calledOnce).equal(true)   
    expect(props.onChange.args[0][1]).equal('test')
  })

  it('should submit form with mentioned action', () => {
    const props = {
      header: 'Test header',
      fields: ['how are you', 'who are you'],
      actions: ['jump'],
      reset: false,
      onChange: sandbox.stub(),
      onSubmit: sandbox.stub(),
    }
    const wrapper = shallow(<Form {...props} />)
    wrapper.find('Query').simulate('click')
    expect(props.onSubmit.calledOnce).equal(true)   
    expect(props.onSubmit.args[0][0]).equal('jump')
  }) 
})

