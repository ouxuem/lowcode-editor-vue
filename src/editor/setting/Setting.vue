<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { computed, ref } from 'vue'
import ComponentAttr from './component/ComponentAttr.vue'
import ComponentEvent from './component/ComponentEvent.vue'
import ComponentStyle from './component/ComponentStyle.vue'
const components_store = useComponentsStore
const current_component_id = computed(() => components_store.current_component_id)
const key = ref<string>('属性')
</script>

<template>
    <div v-if="current_component_id">
        <a-segmented block v-model:value="key" :options="['属性', '样式', '事件']" />
        <div class="pt-20">
            <ComponentAttr v-if="key === '属性'" />
            <ComponentStyle v-if="key === '样式'" />
            <ComponentEvent v-if="key === '事件'" />
        </div>
    </div>
</template>

<style scoped></style>
