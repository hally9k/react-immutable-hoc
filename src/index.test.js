import React, { Component } from 'react'
import { mount } from 'enzyme'
import toJS from './index'
import { Map } from 'immutable'

const MyComponent = props => {
  return <p>{props.item.message}</p>
}

class MyOtherComponent extends Component {
  render() {
    return <p>{this.props.item.message}</p>
  }
}

describe('ToJS HOC', () => {
  it('confirms that true is true.', () => {
    const WrappedComponent = toJS(MyOtherComponent)
    const component = mount(<WrappedComponent item={Map({ message: 'Hello word!' })} />)
    const instance = component.instance()
    expect(instance.props.item.message).toBe('Hello word!')
  })
})
