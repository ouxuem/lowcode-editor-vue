<script setup lang="ts">
import type { ButtonType } from 'ant-design-vue/es/Button'
import { PropType, CSSProperties } from 'vue'
import { useDrag } from 'vue3-dnd'

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

const [_, drag] = useDrag(() => ({
    type: 'Button',
    item: () => ({
        type: 'Button',
        drag_type: 'move',
        id: props.id,
    }),
}))
</script>

<template>
    <div :ref="drag">
        <AButton :data-component-id="props.id" :type="props.type" :style="props.styles">{{
            props.text
        }}</AButton>
    </div>
</template>
