<script setup lang="ts">
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { computed } from 'vue'
import { useComponentsStore } from '@/store'

const components_store = useComponentsStore
const components_list = computed(() => components_store.components_list)
const jsonStringifiedComponents = computed(() => JSON.stringify(components_list.value, null, 2))
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
        :options="{
            fontSize: 14,
            scrollBeyondLastLine: false,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
            },
        }"
        height="100%"
        path="components.json"
        language="json"
        v-model:value="jsonStringifiedComponents"
    />
</template>

<style scoped></style>
