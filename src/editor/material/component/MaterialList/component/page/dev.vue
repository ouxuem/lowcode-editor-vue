<script setup lang="ts">
import { useMaterialDrop } from '@/composables/useMaterialDrop'
import { CommonComponentProps } from '@/editor/interface'
import { computed } from 'vue'
import clsx from 'clsx'

// const props = defineProps<CommonComponentProps>()

const props = withDefaults(defineProps<CommonComponentProps>(), {
    styles: () => ({}),
})

const { collect, drop } = useMaterialDrop(
    ['Button', 'Container', 'Modal', 'Table', 'Form'],
    props.id
)

const drop_classes = computed(() =>
    clsx('p-20 h-full box-border', { 'border-[2px]  border-[blue]': collect.value.canDrop })
)
</script>

<template>
    <div :data-component-id="props.id" :ref="drop" :class="drop_classes" :style="props.styles">
        <slot></slot>
    </div>
</template>
