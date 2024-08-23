<script setup lang="ts">
import {
    useComponentsStore,
    useComponentConfigStore,
    Component,
    get_component_by_id,
} from '@/store'
import { computed, PropType, ref, watch } from 'vue'

import { TreeSelect } from 'ant-design-vue'
const components_store = useComponentsStore
const current_component_id = computed(() => components_store.current_component_id)
const components_list = computed(() => components_store.components_list)
const { component_config } = useComponentConfigStore

export interface ComponentMethodConfig {
    type: 'componentMethod'
    config: {
        component_id: number
        method: string
    }
}

const props = defineProps({
    modelValue: {
        type: Object as PropType<ComponentMethodConfig['config']>,
        required: false,
        default: () => ({ component_id: 1, method: '' }),
    },
})

const emit = defineEmits<{
    'update:modelValue': [value: ComponentMethodConfig['config']]
    change: [config: ComponentMethodConfig]
}>()

const selectedComponent = ref<Component | null>(null)

const config = computed({
    get: () => props.modelValue,
    set: (value: ComponentMethodConfig['config']) => {
        emit('update:modelValue', value)
        emit('change', { type: 'componentMethod', config: value })
    },
})

const curId = computed({
    get: () => config.value.component_id,
    set: (value) => {
        config.value = { ...config.value, component_id: value }
    },
})

const curMethod = computed({
    get: () => config.value.method,
    set: (value: string) => {
        config.value = { ...config.value, method: value }
    },
})

watch(
    () => props.modelValue,
    (newValue) => {
        if (
            newValue &&
            (newValue.component_id !== config.value.component_id ||
                newValue.method !== config.value.method)
        ) {
            config.value = newValue
        }

        selectedComponent.value = get_component_by_id(newValue.component_id, components_list.value)
    },
    { immediate: true }
)

function componentChange(value: number) {
    if (!current_component_id.value) return
    curId.value = value
    selectedComponent.value = get_component_by_id(value, components_list.value)
}

function componentMethodChange(value: any) {
    if (!current_component_id.value || !selectedComponent.value) return
    curMethod.value = value
}
</script>

<template>
    <div class="mt-40">
        <div class="flex items-center gap-10">
            <div>组件：</div>
            <div>
                <TreeSelect
                    :field-names="{ label: 'name', value: 'id' }"
                    :tree-data="components_list"
                    style="width: 500px; height: 50px"
                    v-model:value="curId"
                    @change="(value) => componentChange(value)" />
            </div>
        </div>
        <div v-if="component_config[selectedComponent?.name!]">
            <div class="flex items-center gap-10 mt-20">
                <div>方法：</div>
                <div>
                    <a-select
                        style="width: 500px; height: 50px"
                        :options="
                            component_config[selectedComponent?.name || ''].methods?.map(
                                (method) => ({
                                    label: method.label,
                                    value: method.name,
                                })
                            )
                        "
                        v-model:value="curMethod"
                        @change="componentMethodChange" />
                </div>
            </div>
        </div>
    </div>
</template>
