<script setup lang="ts">
import { computed } from 'vue'
import { useComponentsStore } from '@/store'
const components_store = useComponentsStore
const components_list = computed(() => components_store.components_list)

const handleSelect = ([selectedKeys]: any[]) => {
    components_store.set_cur_component_id(selectedKeys)
}
</script>

<template>
    <a-tree @select="handleSelect" :fieldNames="{ title: 'desc', key: 'id' }" show-line defaultExpandAll :tree-data="components_list as any" />
</template>
