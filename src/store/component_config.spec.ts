import { describe, it, expect, beforeEach } from 'vitest'
import { useComponentConfigStore } from './component_config'
import Button from '../editor/material/component/MaterialList/component/Button.vue'
import Container from '../editor/material/component/Container.vue'
describe('useComponentConfigStore', () => {
    let store: typeof useComponentConfigStore

    beforeEach(() => {
        store = useComponentConfigStore
    })

    it('初始化包含 Container 和 Button 的组件配置', () => {
        const { component_config } = store

        expect(component_config.Container).toBeDefined()
        expect(component_config.Button).toBeDefined()
        expect(component_config.Container.component).toEqual(Container)
        expect(component_config.Button.component).toEqual(Button)
    })

    it('Container 组件应该有正确的默认属性', () => {
        const { component_config } = store

        expect(component_config.Container.name).toEqual('Container')
        expect(component_config.Container.default_props).toEqual({})
    })

    it('Button 组件应该有正确的默认属性', () => {
        const { component_config } = store

        expect(component_config.Button.name).toEqual('Button')
        expect(component_config.Button.default_props).toEqual({
            type: 'primary',
            text: '按钮',
        })
    })

    it('应该能够注册新的组件', () => {
        const NewComponent = { template: '<div>New Component</div>' }
        store.register_component('NewComponent', {
            name: 'NewComponent',
            default_props: { foo: 'bar' },
            component: NewComponent,
        })

        expect(store.component_config.NewComponent).toBeDefined()
        expect(store.component_config.NewComponent.name).toEqual('NewComponent')
        expect(store.component_config.NewComponent.default_props).toEqual({ foo: 'bar' })
        expect(store.component_config.NewComponent.component).toEqual(NewComponent)
    })

    it('注册新组件不应影响现有组件', () => {
        const initialComponentCount = Object.keys(store.component_config).length

        const NewComponent = { template: '<div>New Component</div>' }
        store.register_component('AnotherComponent', {
            name: 'AnotherComponent',
            default_props: {},
            component: NewComponent,
        })

        expect(Object.keys(store.component_config).length).toBe(initialComponentCount + 1)
        expect(store.component_config.Container).toBeDefined()
        expect(store.component_config.Button).toBeDefined()
    })
})
