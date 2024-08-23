<script setup lang="ts">
import { useComponentsStore, useComponentConfigStore, ComponentSetter } from '@/store'
import { computed, ref, watch } from 'vue'
const components_store = useComponentsStore
const component_config_store = useComponentConfigStore
const current_component_id = computed(() => components_store.current_component_id)
const current_component = computed(() => components_store.current_component)
const component_config = computed(() => component_config_store.component_config)
import { Select, Input } from 'ant-design-vue'

const form_state = ref<any>({})

watch(
    current_component,
    (newVal) => {
        if (newVal) {
            form_state.value = { ...form_state.value, ...newVal }
        }
    },
    { deep: true, immediate: true }
)

function renderFormElement(setting: ComponentSetter) {
    const { type } = setting

    if (type === 'select') {
        return Select
    } else if (type === 'input') {
        return Input
    }
}
</script>

<template>
    <div v-if="current_component_id && current_component">
        <a-form :model="form_state" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="组件id">
                <a-input :value="form_state.id" disabled />
            </a-form-item>
            <a-form-item label="组件名称">
                <a-input :value="form_state.name" disabled />
            </a-form-item>
            <a-form-item label="组件描述">
                <a-input :value="form_state.desc" disabled />
            </a-form-item>
            <template v-for="setter in component_config[current_component.name]?.setter" :key="setter.name">
                <a-form-item :label="setter.label" name="setter.name">
                    <component :is="renderFormElement(setter)" :options="setter.type === 'select' ? setter.options : undefined" v-model:value="form_state.props[setter.name]" />
                </a-form-item>
            </template>
        </a-form>
    </div>
</template>

<style scoped></style>
