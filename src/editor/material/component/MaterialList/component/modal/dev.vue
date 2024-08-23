<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import { useMaterialDrop } from '@/composables/useMaterialDrop'
import { computed } from 'vue'
import clsx from 'clsx'

const props = defineProps<CommonComponentProps>()

const { collect, drop } = useMaterialDrop(['Button', 'Container', 'Table', 'Form'], props.id)

const drop_classes = computed(() =>
    clsx('min-h-[100px] p-20', {
        'border-[2px] border-[blue]': collect.value.canDrop,
        'border-[1px] border-[#000]': !collect.value.canDrop,
    })
)
</script>

<template>
    <div :data-component-id="props.id" :ref="drop" :class="drop_classes" :style="props.styles">
        <h4>{{ props.title }}</h4>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
