import React from 'react'
import { mount } from 'enzyme'
import toJS from './index'
import { fromJS, List, Map, Set } from 'immutable'

const immutableMap = Map({ message: 'Hello word!' })
const immutableList = List([immutableMap])
const immutableSet = Set([immutableMap])
const immutableDeep = fromJS([{ nestedItems: [{ message: 'Hello word!' }] }])

const MyMapComponent = props => <p>{props.item.message}</p>
const MyListComponent = props => props.items.map((item, i) => <p key={i}>{item.message}</p>)

describe('ToJS HOC', () => {
    it('deserialises Immutable data structures.', () => {
        it('deserialises an Immutable Map to a plain JS Object when passed to props.', () => {
            const WrappedComponent = toJS(MyMapComponent)
            const component = mount(<WrappedComponent item={immutableMap} />)
            const instance = component.instance()

            expect(instance.props.item.message).toBe('Hello word!')
        })

        it('deserialises an Immutable List to a plain JS Array when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableList} />)
            const instance = component.instance()

            expect(instance.props.items[0].message).toBe('Hello word!')
        })

        it('deserialises an Immutable Set to a plain JS Array when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableSet} />)
            const instance = component.instance()

            expect(instance.props.items[0].message).toBe('Hello word!')
        })

        it('deserialises a deep Immutable styructure to a plain JS structure when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableDeep} />)
            const instance = component.instance()

            expect(instance.props.items[0].nestedItems[0].message).toBe('Hello word!')
        })
    })
})
