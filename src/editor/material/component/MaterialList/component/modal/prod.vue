<script setup lang="ts">
import { ref } from 'vue'
import { Modal as AntModal } from 'ant-design-vue'

// 定义 props
interface Props {
    title?: string
    onOk?: () => void
    onCancel?: () => void
    styles?: object
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
    styles: () => ({}),
})

const open = ref(false)

const handleCancel = () => {
    props.onCancel?.()
    open.value = false
}

const handleOk = () => {
    props.onOk?.()
    open.value = false
}

defineExpose({
    open: () => {
        open.value = true
    },
    close: () => {
        open.value = false
    },
})
</script>

<template>
    <AntModal
        :title="title"
        :style="styles"
        :open="open"
        @cancel="handleCancel"
        @ok="handleOk"
        :destroyOnClose="true">
        <slot></slot>
    </AntModal>
</template>
