<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { PropType, ref, watch } from 'vue'
const props = defineProps({
    value: {
        type: String,
        required: true,
    },
    options: {
        type: Object,
        required: false,
    },
    onChange: {
        type: Function as PropType<(val: any) => any>,
        required: false,
    },
})
const localValue = ref(props.value)

watch(
    () => props.value,
    (newVal) => {
        localValue.value = newVal
    }
)

const editorOptions = {
    fontSize: 14,
    scrollBeyondLastLine: false,
    minimap: {
        enabled: false,
    },
    scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
    },
    ...props.options,
}
</script>

<template>
    <vue-monaco-editor
        @mount="
            (editor, monaco) => {
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                    editor.getAction('editor.action.formatDocument')?.run()
                })
            }
        "
        :options="editorOptions"
        @change="props.onChange"
        height="100%"
        path="component.css"
        language="css"
        v-model:value="localValue"
    />
</template>

<style scoped></style>
