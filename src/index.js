// @flow
type Props = *

import React, { Component } from 'react'
// $FlowFixMe
import { Iterable } from 'immutable'

const convertedPropMap: WeakMap<*, *> = new WeakMap()

const toJS: Function = (
    WrappedComponent: Class<React.Component<*, *>>
): Class<Component<*, *>> =>
    // $FlowFixMe
    class ToJSWrapper extends Component<*, *> {
        static get displayName(): string {
            return `ToJSWrapper(${getDisplayName(WrappedComponent)})`
        }

        constructor(props: Props) {
            super(props)
            this.state = convertProps(props)
        }

        componentWillReceiveProps(nextProps: Props) {
            this.setState(convertProps(nextProps))
        }

        render() {
            this.props = this.state

            return <WrappedComponent {...this.props} />
        }
    }

const convertProp = (prop: Props): Props => {
    if (!Iterable.isIterable(prop)) return prop // not iterable can't convert
    if (convertedPropMap.has(prop)) return convertedPropMap.get(prop) // already been converted
    const converted: Props = prop.toJS() // convert it

    convertedPropMap.set(prop, converted) // cache it

    return converted // return it.
}

const convertProps = (props: Props): Props =>
    Object.keys(props).reduce((convertedProps, key) => {
        convertedProps[key] = convertProp(props[key])

        return convertedProps
    }, {})

const getDisplayName = (Component: Class<React.Component<*, *>>): string =>
    Component.displayName || Component.name || 'Component'

export default toJS
