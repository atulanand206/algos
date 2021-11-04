import { expect } from 'chai'
import { shallow } from 'enzyme'
import { TextField } from './TextField'

describe('Text Field', function () {

  it('should have a text field', () => {
    const props = {
      value: 'random value',
      editable: false,
    }
    const wrapper = shallow(
      <TextField {...props} />
    )
    const textFields = wrapper.find('.text-field__value')
    expect(textFields).length(1)
    expect(textFields.at(0).text()).equal('random value')
  })
})