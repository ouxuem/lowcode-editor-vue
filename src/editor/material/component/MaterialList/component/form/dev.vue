<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import { useMaterialDrop } from '@/composables/useMaterialDrop'
import { computed, onMounted, ref, useSlots } from 'vue'
import clsx from 'clsx'
import { useDrag } from 'vue3-dnd'
const props = defineProps<CommonComponentProps>()
const { collect, drop } = useMaterialDrop(['FormItem'], props.id)
const div_ref = ref<HTMLDivElement | null>(null)
const slots = useSlots()

const drop_classes = computed(() =>
    clsx('w-full p-20 min-h-[100px]', {
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

const formItems = computed(() => {
    return slots.default?.()[0].props?.components.map((item: any) => {
        return {
            label: item.props?.label,
            name: item.props?.name,
            type: item.props?.type,
            id: item.id,
        }
    })
})

onMounted(() => {
    if (div_ref.value) {
        drop(div_ref.value)
        drag(div_ref.value)
    }
})
</script>

<template>
    <div :data-component-id="props.id" ref="div_ref" :class="drop_classes">
        <a-form
            @finish="
                (values: any) => {
                    props.onFinish && props.onFinish(values)
                }
            "
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }">
            <a-form-item
                v-for="item in formItems"
                :key="item.id"
                :name="item.name"
                :label="item.label"
                :data-component-id="item.id">
                <a-input style="pointer-events: none" />
            </a-form-item>
        </a-form>
    </div>
</template>
