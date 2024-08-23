<script setup lang="ts">
import { useComponentsStore, useComponentConfigStore, ComponentSetter } from '@/store'
import { computed, ref, watch, onMounted } from 'vue'
import { Select, Input, InputNumber } from 'ant-design-vue'
import CssEditor from './CssEditor.vue'
import { debounce } from 'lodash-es'
import styleToObject from 'style-to-object'
const components_store = useComponentsStore
const component_config_store = useComponentConfigStore
const current_component_id = computed(() => components_store.current_component_id)
const current_component = computed(() => components_store.current_component)
const component_config = computed(() => component_config_store.component_config)

const form_state = ref<any>({})
const debouncedUpdateStyle = ref<Function>()
const debouncedEditChange = ref<Function>()
const setcss = ref(`.comp{\n\n}`)
watch(
    current_component,
    (newVal) => {
        if (newVal) {
            const styles = { ...newVal.styles } as { [key: string]: any }
            for (const key in styles) {
                if (typeof styles[key] === 'string' && styles[key].endsWith('px')) {
                    styles[key] = parseInt(styles[key])
                }
            }
            form_state.value = { ...form_state.value, ...newVal, styles }
        }
    },
    { deep: true, immediate: true }
)

watch(
    current_component_id,
    (newVal) => {
        if (newVal) {
            setcss.value = toCSSStr(current_component.value?.styles)
        }
    },
    { deep: true, immediate: true }
)

function toCSSStr(css?: Record<string, any>) {
    let str = `.comp {\n`
    for (let key in css) {
        let value = css[key]
        if (!value) {
            continue
        }
        if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
            value += 'px'
        }

        str += `\t${key}: ${value};\n`
    }
    str += `}`
    return str
}

function renderFormElement(setting: ComponentSetter) {
    const { type } = setting

    if (type === 'select') {
        return Select
    } else if (type === 'input') {
        return Input
    } else if (type === 'input_number') {
        return InputNumber
    }
}

onMounted(() => {
    debouncedUpdateStyle.value = debounce((name: string, value: number | string) => {
        if (typeof value === 'number' && !isNaN(value)) {
            form_state.value.styles[name] = `${value}px`
        } else {
            delete form_state.value.styles[name]
        }
        components_store.update_component_styles(current_component_id.value!, {
            ...form_state.value.styles,
        })
    }, 300)

    debouncedEditChange.value = debounce((value) => {
        setcss.value = value
        let cssObj: Record<string, any> = {}
        try {
            const cssStr = value
                .replace(/\/\*.*\*\//, '') // 去掉注释 /** */
                .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
                .replace('}', '') // 去掉 }

            styleToObject(cssStr, (name, value) => {
                cssObj[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value
            })
            components_store.update_component_styles(
                current_component_id.value!,
                { ...form_state.value.styles, ...cssObj },
                true
            )
        } catch (e) {}
    }, 500)
})

function updateStyle(name: string, value: number | string) {
    debouncedUpdateStyle.value?.(name, value)
}

function editChange(value: string) {
    debouncedEditChange.value?.(value)
}

const getInputNumberValue = computed(() => (setter: ComponentSetter) => {
    const value = form_state.value.styles[setter.name]
    if (value === undefined || value === '') return undefined
    return value
})
</script>

<template>
    <div v-if="current_component_id && current_component">
        <a-form :model="form_state" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <template
                v-for="setter in component_config[current_component.name]?.styles_setter"
                :key="setter.name">
                <a-form-item :label="setter.label" name="setter.name">
                    <component
                        :is="renderFormElement(setter)"
                        :value="
                            setter.type === 'input_number'
                                ? getInputNumberValue(setter)
                                : form_state.styles[setter.name]
                        "
                        :options="setter.type === 'select' ? setter.options : undefined"
                        :addonAfter="setter.type === 'input_number' ? 'px' : undefined"
                        @update:value="(val: any) => updateStyle(setter.name, val)" />
                </a-form-item>
            </template>
            <div class="h-200 border-[1px] border-[#ccc] z-10">
                <CssEditor :value="setcss" :on-change="(val) => editChange(val)" />
            </div>
        </a-form>
    </div>
</template>

<style scoped></style>
