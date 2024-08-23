<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import { useMaterialDrop } from '@/composables/useMaterialDrop'
import { computed, onMounted, ref } from 'vue'
import clsx from 'clsx'
import { useDrag } from 'vue3-dnd'

const props = defineProps<CommonComponentProps>()

const { collect, drop } = useMaterialDrop(['Button', 'Container', 'Table', 'Form'], props.id)

const div_ref = ref<HTMLDivElement | null>(null)

const drop_classes = computed(() =>
    clsx('min-h-[100px] p-20', {
        'border-[2px] border-[blue]': collect.value.canDrop,
        'border-[1px] border-[#000]': !collect.value.canDrop,
    })
)

const [_, drag] = useDrag(() => ({
    type: props.name,
    item: () => ({
        type: props.name,
        drag_type: 'move',
        id: props.id,
    }),
}))

onMounted(() => {
    if (div_ref.value) {
        drop(div_ref.value)
        drag(div_ref.value)
    }
})
</script>

<template>
    <div :data-component-id="props.id" ref="div_ref" :class="drop_classes" :style="props.styles">
        <slot></slot>
    </div>
</template>
