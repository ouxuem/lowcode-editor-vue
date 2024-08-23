<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { PropType, computed, watch } from 'vue'
const components_store = useComponentsStore
const current_component_id = computed(() => components_store.current_component_id)

export interface ShowMessageConfigProps {
    type: 'showMessage'
    config: {
        type: 'success' | 'error'
        text: string
    }
}

const props = defineProps({
    modelValue: {
        type: Object as PropType<ShowMessageConfigProps['config']>,
        required: false,
        default: () => ({ type: 'success', text: '' }),
    },
})

const emit = defineEmits<{
    'update:modelValue': [value: ShowMessageConfigProps['config']]
    change: [config: ShowMessageConfigProps]
}>()

const config = computed({
    get: () => props.modelValue,
    set: (value: ShowMessageConfigProps['config']) => {
        emit('update:modelValue', value)
        emit('change', { type: 'showMessage', config: value })
    },
})

const message_type = computed({
    get: () => config.value.type,
    set: (value: 'success' | 'error') => {
        config.value = { ...config.value, type: value }
    },
})

const message_text = computed({
    get: () => config.value.text,
    set: (value: string) => {
        config.value = { ...config.value, text: value }
    },
})

watch(
    () => props.modelValue,
    (newValue) => {
        if (
            newValue &&
            (newValue.type !== config.value.type || newValue.text !== config.value.text)
        ) {
            config.value = newValue
        }
    }
)

function messageTypeChange(value: any) {
    if (!current_component_id.value) return
    message_type.value = value
}

function messageTextChange(value: string) {
    if (!current_component_id.value) return

    message_text.value = value
}
</script>

<template>
    <div class="mt-10">
        <div class="flex items-center gap-10">
            <div>类型：</div>
            <a-select
                :options="[
                    {
                        label: '成功',
                        value: 'success',
                    },
                    {
                        label: '失败',
                        value: 'error',
                    },
                ]"
                class="w-500 h-50"
                v-model:value="message_type"
                @change="(val) => messageTypeChange(val)" />
        </div>
        <div class="flex items-center gap-10 mt-10">
            <div>文本：</div>
            <AInput
                style="width: 500px; height: 50px"
                @change="(e) => messageTextChange(e.target.value!)"
                v-model:value="message_text" />
        </div>
    </div>
</template>
