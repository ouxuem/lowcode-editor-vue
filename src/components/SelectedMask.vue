<template>
    <teleport :to="el">
        <div v-if="position.width && position.width >= 10" :style="maskStyle" />
        <div :style="labelStyle">
            <a-space>
                <a-dropdown :disabled="parentComponents.length === 0">
                    <div :style="labelInnerStyle">
                        {{ curSelectedComponent?.desc }}
                    </div>
                    <template #overlay>
                        <a-menu @click="handleParentSelect">
                            <a-menu-item v-for="item in parentComponents" :key="item.id">
                                {{ item.desc }}
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
                <div v-if="current_component_id !== 1" :style="deleteButtonStyle">
                    <a-popconfirm
                        title="确认删除？"
                        ok-text="确认"
                        cancel-text="取消"
                        @confirm="handleDelete">
                        <delete-outlined style="color: #fff" />
                    </a-popconfirm>
                </div>
            </a-space>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, CSSProperties, watch, nextTick } from 'vue'
import { useComponentsStore, get_component_by_id } from '@/store'
import { DeleteOutlined } from '@ant-design/icons-vue'

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
const current_component_id = computed(() => components_store.current_component_id)
const current_component = computed(() => components_store.current_component)
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

watch(() => props.component_id, updatePosition)

watch(
    () => components_list,
    () => {
        nextTick(updatePosition)
    },
    { deep: true }
)

watch(
    () => current_component,
    () => {
        setTimeout(() => {
            updatePosition()
        }, 200)
    },
    { deep: true }
)

watchEffect(() => {
    updatePosition()
})

onMounted(() => {
    window.addEventListener('resize', updatePosition)
})

const el = computed(() => document.querySelector(`.${props.portal_wrapper_classname}`))

const curSelectedComponent = computed(() =>
    get_component_by_id(props.component_id, components_list.value)
)

const parentComponents = computed(() => {
    const parents = []
    let component = current_component.value

    while (component?.parent_id) {
        component = get_component_by_id(component.parent_id, components_list.value)
        if (component) parents.push(component)
    }
    return parents
})

const handleDelete = () => {
    components_store.delete_component(current_component_id.value!)
    components_store.set_cur_component_id(null)
}

const handleParentSelect = ({ key }: any) => {
    components_store.set_cur_component_id(key)
}

const maskStyle = computed(
    () =>
        ({
            position: 'absolute',
            left: `${position.value.left}px`,
            top: `${position.value.top}px`,
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            border: '1px dashed blue',
            pointerEvents: 'none',
            width: `${position.value.width}px`,
            height: `${position.value.height}px`,
            zIndex: 12,
            borderRadius: '4px',
            boxSizing: 'border-box',
        }) as CSSProperties
)

const labelStyle = computed(
    () =>
        ({
            position: 'absolute',
            left: `${position.value.labelLeft}px`,
            top: `${position.value.labelTop}px`,
            fontSize: '14px',
            zIndex: 13,
            display: position.value.width && position.value.width >= 10 ? 'inline' : 'none',
            transform: 'translate(-100%, -100%)',
        }) as CSSProperties
)

const labelInnerStyle = {
    padding: '0 8px',
    backgroundColor: 'blue',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
}

const deleteButtonStyle = {
    padding: '0 8px',
    backgroundColor: 'blue',
}
</script>
