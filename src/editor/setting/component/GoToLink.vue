<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { computed, watch } from 'vue'

const components_store = useComponentsStore
const current_component_id = computed(() => components_store.current_component_id)

export interface gotoLinkConfig {
    type: 'goToLink'
    url: string
}

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
    },
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    change: [config: gotoLinkConfig]
}>()

const url_value = computed({
    get: () => props.modelValue || '',
    set: (value: string) => {
        emit('update:modelValue', value)
        emit('change', {
            type: 'goToLink',
            url: value,
        })
    },
})

const url_change = (value: string) => {
    if (!current_component_id.value) return
    url_value.value = value
}

// 添加 watch 以响应外部变化
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== url_value.value) {
            url_value.value = newValue || ''
        }
    }
)
</script>

<template>
    <div class="mt-40">
        <div class="flex items-center gap-10">
            <div>链接</div>
            <div>
                <a-textarea
                    style="width: 500px; height: 200px; border: 1px solid #000"
                    @change="(e) => url_change(e.target.value!)"
                    :value="url_value" />
            </div>
        </div>
    </div>
</template>
