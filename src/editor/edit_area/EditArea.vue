<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { computed, ref } from 'vue'
import RecursiveComponent from '@/components/RecursiveComponent.vue'
import HoverMask from '../../components/HoverMask.vue'
import SelectedMask from '../../components/SelectedMask.vue'

const components_store = useComponentsStore
const components_list = computed(() => components_store.components_list)
const current_component_id = computed(() => components_store.current_component_id)

const hover_component_id = ref<number | undefined>()

const handle_mouseover = (event: MouseEvent) => {
    const path = event.composedPath()

    for (let i = 0; i < path.length; i += 1) {
        const ele = path[i] as HTMLElement

        const component_id = ele.dataset?.componentId
        if (component_id) {
            hover_component_id.value = +component_id
            return
        }
    }
}

const handle_click = (event: MouseEvent) => {
    const path = event.composedPath()

    for (let i = 0; i < path.length; i += 1) {
        const ele = path[i] as HTMLElement

        const componentId = ele.dataset?.componentId
        if (componentId) {
            components_store.set_cur_component_id(+componentId)
            return
        }
    }
}

const handle_mouseleave = () => {
    hover_component_id.value = undefined
}
</script>

<template>
    <div
        class="h-full edit-area relative"
        @click="handle_click"
        @mouseover="handle_mouseover"
        @mouseleave="handle_mouseleave">
        <RecursiveComponent :components="components_list" :-dev-mode="true" :-prod-mode="false" />
        <HoverMask
            v-if="hover_component_id && hover_component_id !== current_component_id"
            portal_wrapper_classname="portal-wrapper"
            container_classname="edit-area"
            :component_id="hover_component_id" />
        <SelectedMask
            v-if="current_component_id"
            portal_wrapper_classname="portal-wrapper"
            container_classname="edit-area"
            :component_id="current_component_id" />
        <div class="portal-wrapper" />
    </div>
</template>

<style scoped></style>
