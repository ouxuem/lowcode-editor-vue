<script setup lang="ts">
import type { ButtonType } from 'ant-design-vue/es/Button'
import { PropType, CSSProperties } from 'vue'
const props = defineProps({
    type: {
        type: String as PropType<ButtonType>,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    styles: {
        type: Object as PropType<CSSProperties>,
        required: false,
    },
})
</script>

<template>
    <AButton v-bind="$attrs" :type="props.type" :style="props.styles">{{ props.text }}</AButton>
</template>
