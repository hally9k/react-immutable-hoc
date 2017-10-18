import React from 'react'
import { mount } from 'enzyme'
import toJS from './index'
import { fromJS, List, Map, Set } from 'immutable'

const plainJSObject = { message: 'Hello word!' }
const immutableMap = Map(plainJSObject)
const anotherImmutableMap = Map(plainJSObject)

const immutableList = List([immutableMap])
const immutableSet = Set([immutableMap])
const immutableDeep = fromJS([{ nestedItems: [plainJSObject] }])

const MyMapComponent = props => <p>{props.item.message}</p>
const MyListComponent = props => props.items.map((item, i) => <p key={i}>{item.message}</p>)

describe('ToJS HOC', () => {
    it('Surfaces the appropriate display name for the wrapped component.', () => {
      const WrappedComponent = toJS(MyMapComponent)
      const component = mount(<WrappedComponent item={immutableMap} />)

      expect(component.name()).toBe('ToJSWrapper(MyMapComponent)')
    })
    describe('deserialises Immutable data structures.', () => {
        it('deserialises an Immutable Map to a plain JS Object when passed to props.', () => {
            const WrappedComponent = toJS(MyMapComponent)
            const component = mount(<WrappedComponent item={immutableMap} />)
            const componentInstance = component.instance()

            expect(componentInstance.props.item.message).toBe('Hello word!')
        })

        it('deserialises an Immutable List to a plain JS Array when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableList} />)
            const componentInstance = component.instance()

            expect(componentInstance.props.items[0].message).toBe('Hello word!')
        })

        it('deserialises an Immutable Set to a plain JS Array when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableSet} />)
            const componentInstance = component.instance()

            expect(componentInstance.props.items[0].message).toBe('Hello word!')
        })

        it('deserialises a deep Immutable structure to a plain JS structure when passed to props.', () => {
            const WrappedComponent = toJS(MyListComponent)
            const component = mount(<WrappedComponent items={immutableDeep} />)
            const componentInstance = component.instance()

            expect(componentInstance.props.items[0].nestedItems[0].message).toBe('Hello word!')
        })
    })
    describe('Passes through plain JS data structures.', () => {
      it('Passes through the string passed to props.', () => {
        const WrappedComponent = toJS(MyMapComponent)
        const component = mount(<WrappedComponent item={'A string.'} />)
        const componentInstance = component.instance()

        expect(componentInstance.props.item).toBe('A string.')
      })
      it('Passes through the reference to the original plain JS object passed to props.', () => {
        const WrappedComponent = toJS(MyMapComponent)
        const component = mount(<WrappedComponent item={plainJSObject} />)
        const componentInstance = component.instance()

        expect(componentInstance.props.item).toBe(plainJSObject)
      })
    })
    describe('Caches previously serialised Immutable data structures.', () => {
      it('Returns the same plain JS object instance for the same given Immutable Map.', () => {
        const WrappedComponent = toJS(MyMapComponent)
        const component = mount(<WrappedComponent item={immutableMap} />)
        const componentInstance = component.instance()

        const anotherComponent = mount(<WrappedComponent item={immutableMap} />)
        const anotherComponentInstance = anotherComponent.instance()


        expect(componentInstance.props.item).toBe(anotherComponentInstance.props.item)
      })
    })
})
