<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import { useMaterialDrop } from '@/composables/useMaterialDrop'
import { computed, h, onMounted, ref, useSlots } from 'vue'
import clsx from 'clsx'
import { useDrag } from 'vue3-dnd'
import { Table as ATable } from 'ant-design-vue'
const props = defineProps<CommonComponentProps>()
const slots = useSlots()
const { collect, drop } = useMaterialDrop(['TableColumn'], props.id)
const div_ref = ref<HTMLDivElement | null>(null)

const drop_classes = computed(() =>
    clsx('w-full', {
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

const columns = computed(() => {
    return slots.default?.()[0].props?.components.map((item: any) => {
        return {
            title: () =>
                h(
                    'div',
                    {
                        class: 'm-16 p-16',
                        'data-component-id': item?.id,
                    },
                    item?.props?.title
                ),
            dataIndex: item.props.dataIndex,
            key: item,
        }
    })
})
</script>

<template>
    <div :data-component-id="props.id" ref="div_ref" :class="drop_classes" :style="props.styles">
        <ATable :data-source="[]" :pagination="false" :columns="columns" />
    </div>
</template>
