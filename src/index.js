import React, { Component } from 'react'
import { Iterable } from 'immutable'

const convertedPropMap = new WeakMap()

const toJS = WrappedComponent =>
  class ToJSWrapper extends Component {
    constructor(props) {
      super(props)
      this.state = convertProps(props)
    }

    static get displayName() {
      return `ToJSWrapper(${getDisplayName(WrappedComponent)})`
    }

    componentWillReceiveProps(nextProps) {
      this.setState(convertProps(nextProps))
    }

    render() {
      return <WrappedComponent {...this.state} />
    }
  }

const convertProp = prop => {
  if (!Iterable.isIterable(prop)) return prop // not iterable can't convert
  if (convertedPropMap.has(prop)) return convertedPropMap.get(prop) // already been converted
  const converted = prop.toJS() // convert it

  convertedPropMap.set(prop, converted) // cache it

  return converted // return it.
}

const convertProps = props =>
  Object.keys(props).reduce((convertedProps, key) => {
    convertedProps[key] = convertProp(props[key])

    return convertedProps
  }, {})

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component'

export default toJS
