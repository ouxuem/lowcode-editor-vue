import { describe, it, expect, beforeEach } from 'vitest'
import { useComponentsStore, Component,get_component_by_id } from './components'

describe('use_components_store', () => {
    let store: typeof useComponentsStore

    beforeEach(() => {
        store = useComponentsStore
        store.components_list = [
            {
                id: 1,
                name: 'Page',
                props: {},
            },
        ]
    })
    /** 添加一个测试用的组件 */
    const add_test_component = (id: number, name: string, parent_id?: number): Component => {
        const new_component: Component = { id, name, props: {} }
        store.add_component(new_component, parent_id)
        return new_component
    }
    /** 验证组件是否在组件列表中 */
    const expect_component_in_store = (component: Component, parent_id?: number) => {
        if (parent_id) {
            const parent = get_component_by_id(parent_id, store.components_list)
            expect(parent?.children).toContainEqual(component)
        } else {
            expect(store.components_list).toContainEqual(component)
        }
    }

    it('初始化一个默认的组件列表', () => {
        expect(store.components_list).toEqual([{ id: 1, name: 'Page', props: {} }])
    })

    it('添加一个没有父组件的组件', () => {
        const new_component = add_test_component(2, 'Header')
        expect_component_in_store(new_component)
    })

    it('添加一个有父组件的组件', () => {
        const new_component = add_test_component(2, 'Header', 1)
        expect_component_in_store(new_component, 1)
    })

    it('删除一个组件', () => {
        const new_component = add_test_component(2, 'Header')
        store.delete_component(2)
        expect(store.components_list).not.toContainEqual(new_component)
    })

    it('更新组件的属性', () => {
        const new_props = { title: 'New Title' }
        store.update_component_props(1, new_props)
        const component = get_component_by_id(1, store.components_list)
        expect(component?.props).toEqual(new_props)
    })

    it('根据ID获取组件', () => {
        const component = get_component_by_id(1, store.components_list)
        expect(component).toEqual({ id: 1, name: 'Page', props: {} })
    })

    it('组件ID不存在时应该返回null', () => {
        const component = get_component_by_id(999, store.components_list)
        expect(component).toBeNull()
    })

    it('更新不存在的组件的属性时不应产生影响', () => {
        const initial_props = { ...store.components_list[0].props }
        store.update_component_props(999, { color: 'blue' })
        expect(store.components_list[0].props).toEqual(initial_props)
    })

    it('删除不存在的组件时不应改变组件列表', () => {
        const initial_length = store.components_list.length
        store.delete_component(999)
        expect(store.components_list).toHaveLength(initial_length)
    })

    it('添加一个有多层父组件的组件', () => {
        const container = add_test_component(2, 'Container', 1)
        const section = add_test_component(3, 'Section', 2)
        const button = add_test_component(4, 'Button', 3)

        const page_component = store.components_list[0]
        expect(page_component.children).toHaveLength(1)
        expect(page_component.children?.[0]).toEqual(container)
        expect(page_component.children?.[0].children?.[0]).toEqual(section)
        expect(page_component.children?.[0].children?.[0].children?.[0]).toEqual(button)

        const retrieved_button = get_component_by_id(4, store.components_list)
        expect(retrieved_button).toBeDefined()
        expect(retrieved_button?.name).toBe('Button')
    })

    it('修改多层父组件中的组件的props', () => {
        add_test_component(2, 'Container', 1)
        add_test_component(3, 'Section', 2)
        add_test_component(4, 'Button', 3)

        const new_props = { text: 'Updated Text', color: 'blue' }
        store.update_component_props(4, new_props)

        const updated_button = get_component_by_id(4, store.components_list)
        expect(updated_button?.props).toEqual(new_props)

        // 验证其他组件的props没有被意外修改
        const page = store.components_list[0]
        const container = page.children?.[0]
        const section = container?.children?.[0]

        expect(page.props).toEqual({})
        expect(container?.props).toEqual({})
        expect(section?.props).toEqual({})
    })
})
