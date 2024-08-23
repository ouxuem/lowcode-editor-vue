<script setup lang="ts">
import { computed } from 'vue'
import { useComponentConfigStore } from '@/store'
import MaterialItem from '@/components/MaterialItem.vue'
const { component_config } = useComponentConfigStore

const components = computed(() => {
    return Object.values(component_config).filter((component) => component.name !== 'Page')
})
</script>

<template>
    <div>
        <MaterialItem v-for="(component, index) in components" :name="component.name" :desc="component.desc" :key="component.name + index" />
    </div>
</template>

<style scoped></style>
