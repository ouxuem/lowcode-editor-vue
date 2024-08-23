<script setup lang="ts">
import { ComponentPublicInstance, PropType, computed, ref } from 'vue'
import type { Component } from '@/store'
import { useComponentConfigStore } from '@/store'
import { message } from 'ant-design-vue'
import { ActionConfig } from './ActionModal.vue'

const config_store = useComponentConfigStore
const all_component_config = computed(() => config_store.component_config)

const get_component_config = (name: string) => all_component_config.value[name]

const component_refs = ref<Record<number, any>>({})

const props = defineProps({
    components: {
        type: Array as PropType<Component[]>,
        required: true,
    },
    ProdMode: {
        type: Boolean,
        required: false,
    },
    DevMode: {
        type: Boolean,
        required: false,
    },
})

const component_to_render = (component: Component) => {
    const config = get_component_config(component.name)
    if (!config) return null
    return props.ProdMode ? config.prod : props.DevMode ? config.dev : null
}

const handle_event = (cur_component: Component) => {
    const props: Record<string, any> = {}

    all_component_config.value?.[cur_component.name].events?.forEach((event) => {
        const event_config = cur_component.props[event.name]
        if (event_config) {
            props[event.name] = (...args: any[]) => {
                event_config?.actions?.forEach((item: ActionConfig) => {
                    if (item.type === 'goToLink') {
                        window.location.href = item.url
                    } else if (item.type === 'showMessage') {
                        if (item.config.type === 'success') {
                            message.success(item.config.text)
                        } else if (item.config.type === 'error') {
                            message.error(item.config.text)
                        }
                    } else if (item.type === 'customJS') {
                        const func = new Function('context', 'args', item.code)
                        func(
                            {
                                name: cur_component.name,
                                props: cur_component.props,
                                ShowMessage(content: string) {
                                    message.success(content)
                                },
                            },
                            args
                        )
                    } else if (item.type === 'componentMethod') {
                        const component = component_refs.value[item.config.component_id]
                        if (component) {
                            component[item.config.method]?.(...args)
                        }
                    }
                })
            }
        }
    })
    return props
}

const handle_dev_event = (cur_component: Component) => {
    const props = { ...cur_component.props }
    all_component_config.value?.[cur_component.name].events?.forEach((event) => {
        delete props[event.name]
    })
    return props
}

const setComponentRef = (el: ComponentPublicInstance | null, id: number) => {
    if (props.ProdMode && el) {
        component_refs.value[id] = el
    }
}
</script>

<template>
    <template v-for="component in props.components" :key="component.id">
        <component
            :is="component_to_render(component)"
            v-if="component_to_render(component)"
            :ref="(el: ComponentPublicInstance) => setComponentRef(el, component.id)"
            v-bind="{
                id: component.id,
                name: component.name,
                styles: component.styles,
                ...get_component_config(component.name)?.default_props,
                ...(props.DevMode ? handle_dev_event(component) : component.props),
                ...(props.ProdMode ? handle_event(component) : {}),
            }">
            <template v-if="component.children && component.children.length">
                <recursive-component
                    :components="component.children"
                    :ProdMode="props.ProdMode"
                    :DevMode="props.DevMode" />
            </template>
        </component>
    </template>
</template>
