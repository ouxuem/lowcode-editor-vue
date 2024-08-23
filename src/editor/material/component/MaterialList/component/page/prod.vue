<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'

// const props = defineProps<CommonComponentProps>()

const props = withDefaults(defineProps<CommonComponentProps>(), {
    styles: () => ({}),
})
</script>

<template>
    <div class="p-20" :style="props.styles">
        <slot></slot>
    </div>
</template>
