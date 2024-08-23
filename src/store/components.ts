import { reactive, watch } from 'vue'

import type { Properties as CSSProperties } from 'csstype'

function createPersistentStore<T extends object>(
    store: T,
    options: {
        name: string
        storage?: Storage
        whitelist?: (keyof T)[]
        blacklist?: (keyof T)[]
    }
): T {
    const { name, storage = localStorage, whitelist, blacklist } = options

    // 尝试从存储中加载状态
    const savedState = storage.getItem(name)
    if (savedState) {
        const parsedState = JSON.parse(savedState)
        Object.keys(parsedState).forEach((key) => {
            if (
                (!whitelist || whitelist.includes(key as keyof T)) &&
                (!blacklist || !blacklist.includes(key as keyof T))
            ) {
                ;(store as any)[key] = parsedState[key]
            }
        })
    }

    // 监视状态变化并保存
    watch(
        () => store,
        (state) => {
            const stateToPersist = {} as Partial<T>
            Object.keys(state).forEach((key) => {
                if (
                    (!whitelist || whitelist.includes(key as keyof T)) &&
                    (!blacklist || !blacklist.includes(key as keyof T))
                ) {
                    ;(stateToPersist as any)[key] = (state as any)[key]
                }
            })
            storage.setItem(name, JSON.stringify(stateToPersist))
        },
        { deep: true }
    )

    return store
}

export interface Component {
    id: number
    name: string
    props: any
    children?: Component[]
    parent_id?: number
    desc: string
    styles?: CSSProperties
}

interface StoreType {
    components_list: Component[]
    current_component: Component | null
    current_component_id: number | null
    mode: 'edit' | 'preview'
    /** 添加组件 */
    add_component: (component: Component, parent_id?: number) => void
    delete_component: (component_id: number) => void
    update_component_props: (component_id: number, props: any) => void
    update_component_styles: (
        component_id: number,
        styles: CSSProperties,
        replace?: boolean
    ) => void
    set_cur_component_id: (component_id: number | null) => void
    set_mode: (mode: 'edit' | 'preview') => void
}

// export const useComponentsStore = reactive<StoreType>({
//     components_list: [
//         {
//             id: 1,
//             name: 'Page',
//             props: {},
//             desc: '页面',
//         },
//     ],
//     current_component: null,
//     current_component_id: null,
//     mode: 'edit',
//     add_component: (component, parent_id?) => {
//         if (parent_id) {
//             // 如果指定了父组件 ID，则将新组件添加为其子组件
//             const parent_component = get_component_by_id(
//                 parent_id,
//                 useComponentsStore.components_list
//             )
//             if (parent_component) {
//                 parent_component.children = parent_component.children || []
//                 parent_component.children.push(component)
//                 component.parent_id = parent_id
//             }
//         } else {
//             useComponentsStore.components_list.push(component)
//         }
//     },
//     delete_component: (component_id) => {
//         if (!component_id) return

//         // 递归删除组件的辅助函数
//         const remove_component = (components: Component[], id: number): Component[] => {
//             return components.filter((component) => {
//                 if (component.id !== id) {
//                     if (component.children) {
//                         component.children = remove_component(component.children, id)
//                     }
//                     return true
//                 }
//                 return false
//             })
//         }

//         useComponentsStore.components_list = remove_component(
//             useComponentsStore.components_list,
//             component_id
//         )
//     },
//     update_component_props: (component_id, props) => {
//         const component = get_component_by_id(component_id, useComponentsStore.components_list)
//         if (component) {
//             component.props = { ...component.props, ...props }
//         }
//     },
//     set_cur_component_id: (component_id) => {
//         useComponentsStore.current_component_id = component_id
//         useComponentsStore.current_component = get_component_by_id(
//             component_id,
//             useComponentsStore.components_list
//         )
//     },

//     update_component_styles: (component_id, styles, replace) => {
//         const component = get_component_by_id(component_id, useComponentsStore.components_list)
//         if (component) {
//             if (Object.keys(styles).length === 0) {
//                 component.styles = {}
//             } else {
//                 component.styles = replace ? { ...styles } : { ...component.styles, ...styles }
//             }
//         }
//     },

//     set_mode: (mode) => {
//         useComponentsStore.mode = mode
//     },
// })

export const useComponentsStore = createPersistentStore(
    reactive<StoreType>({
        components_list: [
            {
                id: 1,
                name: 'Page',
                props: {},
                desc: '页面',
            },
        ],
        current_component: null,
        current_component_id: null,
        mode: 'edit',
        add_component: (component, parent_id?) => {
            if (parent_id) {
                // 如果指定了父组件 ID，则将新组件添加为其子组件
                const parent_component = get_component_by_id(
                    parent_id,
                    useComponentsStore.components_list
                )
                if (parent_component) {
                    parent_component.children = parent_component.children || []
                    parent_component.children.push(component)
                    component.parent_id = parent_id
                }
            } else {
                useComponentsStore.components_list.push(component)
            }
        },
        delete_component: (component_id) => {
            if (!component_id) return

            // 递归删除组件的辅助函数
            const remove_component = (components: Component[], id: number): Component[] => {
                return components.filter((component) => {
                    if (component.id !== id) {
                        if (component.children) {
                            component.children = remove_component(component.children, id)
                        }
                        return true
                    }
                    return false
                })
            }

            useComponentsStore.components_list = remove_component(
                useComponentsStore.components_list,
                component_id
            )
        },
        update_component_props: (component_id, props) => {
            const component = get_component_by_id(component_id, useComponentsStore.components_list)
            if (component) {
                component.props = { ...component.props, ...props }
            }
        },
        set_cur_component_id: (component_id) => {
            useComponentsStore.current_component_id = component_id
            useComponentsStore.current_component = get_component_by_id(
                component_id,
                useComponentsStore.components_list
            )
        },

        update_component_styles: (component_id, styles, replace) => {
            const component = get_component_by_id(component_id, useComponentsStore.components_list)
            if (component) {
                if (Object.keys(styles).length === 0) {
                    component.styles = {}
                } else {
                    component.styles = replace ? { ...styles } : { ...component.styles, ...styles }
                }
            }
        },

        set_mode: (mode) => {
            useComponentsStore.mode = mode
        },
    }),
    {
        name: 'components-store',
        storage: localStorage, 
        blacklist: ['current_component', 'current_component_id', 'mode']
    }
)

export const get_component_by_id = (
    id: number | null,
    components: Component[]
): Component | null => {
    if (!id) return null
    for (const component of components) {
        if (component.id === id) return component
        if (component.children) {
            const result = get_component_by_id(id, component.children)
            if (result) return result
        }
    }
    return null
}


