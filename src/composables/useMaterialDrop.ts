import { get_component_by_id, useComponentConfigStore, useComponentsStore } from '@/store'
import { computed } from 'vue'
import { useDrop } from 'vue3-dnd'

export interface ItemType {
    type: string
    drag_type?: 'move' | 'add'
    id: number
}

export const useMaterialDrop = (accept: string[], id: number) => {
    const { add_component, delete_component } = useComponentsStore
    const { component_config } = useComponentConfigStore
    const components_list = computed(() => useComponentsStore.components_list)
    const [collect, drop] = useDrop(() => ({
        accept,
        drop: (item: ItemType, monitor) => {
            const didDrop = monitor.didDrop()
            if (didDrop) return

            if (item.drag_type === 'move') {
                const component = get_component_by_id(item.id, components_list.value)!
                if (component.id === id) return
                delete_component(item.id)
                add_component(component, id)
            } else {
                const config = component_config[item.type]
                add_component(
                    {
                        id: new Date().getTime(),
                        name: item.type,
                        // props: config.default_props,
                        props:
                            typeof config.default_props === 'function'
                                ? config.default_props()
                                : config.default_props,
                        desc: config.desc,
                        styles: {},
                    },
                    id
                )
            }
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }))
    return {
        collect,
        drop,
    }
}
