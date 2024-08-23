<template>
    <teleport :to="el">
        <div
            v-if="position.width && position.width >= 10"
            :style="{
                position: 'absolute',
                left: `${position.left}px`,
                top: `${position.top}px`,
                width: `${position.width}px`,
                height: `${position.height}px`,
                zIndex: 12,
                backgroundColor: 'rgba(0, 0, 255, 0.05)',
                border: '1px dashed blue',
                pointerEvents: 'none',
                borderRadius: '4px',
                boxSizing: 'border-box',
            }"
        />
        <div
            :style="{
                position: 'absolute',
                left: `${position.labelLeft}px`,
                top: `${position.labelTop}px`,
                zIndex: 13,
                fontSize: '14px',
                transform: 'translate(-100%, -100%)',
                display: `${position.width && position.width >= 10 ? 'inline' : 'none'}`,
            }"
        >
            <div
                :style="{
                    padding: '0 8px',
                    backgroundColor: 'blue',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                }"
            >
                {{ curComponent?.desc }}
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch, nextTick } from 'vue'
import { useComponentsStore, get_component_by_id } from '@/store'
const props = defineProps({
    portal_wrapper_classname: {
        type: String,
        required: true,
    },
    container_classname: {
        type: String,
        required: true,
    },
    component_id: {
        type: Number,
        required: true,
    },
})

const position = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
})

const components_store = useComponentsStore
const components_list = computed(() => components_store.components_list)

const updatePosition = () => {
    if (!props.component_id) return

    const container = document.querySelector(`.${props.container_classname}`)
    if (!container) return

    const node = document.querySelector(`[data-component-id="${props.component_id}"]`)
    if (!node) return

    const { top, left, width, height } = node.getBoundingClientRect()
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect()

    let labelTop = top - containerTop + container.scrollTop
    let labelLeft = left - containerLeft + width

    if (labelTop <= 0) {
        labelTop -= -20
    }

    position.value = {
        top: top - containerTop + container.scrollTop,
        left: left - containerLeft + container.scrollTop,
        width,
        height,
        labelTop,
        labelLeft,
    }
}

watchEffect(() => {
    updatePosition()
})

watch(() => props.component_id, updatePosition)

watch(
    () => components_list,
    () => {
        nextTick(updatePosition)
    },
    { deep: true }
)

const el = computed(() => document.querySelector(`.${props.portal_wrapper_classname}`))

const curComponent = computed(() => {
    return get_component_by_id(props.component_id, components_list.value)
})
</script>
