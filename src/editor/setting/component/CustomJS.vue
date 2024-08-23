<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { computed, watch } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const components_store = useComponentsStore
const current_component_id = computed(() => components_store.current_component_id)

export interface CustomJSConfig {
    type: 'customJS'
    code: string
}

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
    },
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    change: [config: CustomJSConfig]
}>()

const code_value = computed({
    get: () => props.modelValue || '',
    set: (value: string) => {
        emit('update:modelValue', value)
        emit('change', {
            type: 'customJS',
            code: value,
        })
    },
})

function codeChange(value?: string) {
    if (!current_component_id) return
    code_value.value = value || ''
}

// 添加 watch
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== code_value.value) {
            code_value.value = newValue || ''
        }
    }
)
</script>

<template>
    <div class="mt-40">
        <div class="flex items-start gap-20">
            <div>自定义JS</div>
            <div>
                <vue-monaco-editor
                    @mount="
                        (editor, monaco) => {
                            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                                editor.getAction('editor.action.formatDocument')?.run()
                            })
                        }
                    "
                    :options="{
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false },
                        scrollbar: {
                            verticalScrollbarSize: 6,
                            horizontalScrollbarSize: 6,
                        },
                    }"
                    @change="codeChange"
                    height="400px"
                    width="600px"
                    path="action.css"
                    language="javascript"
                    v-model:value="code_value" />
            </div>
        </div>
    </div>
</template>
