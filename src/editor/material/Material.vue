<script setup lang="ts">
import { ref } from 'vue'
import MaterialList from './component/MaterialList/MaterialList.vue'
import Outline from './component/Outline.vue'
import Source from './component/Source.vue'
const key = ref<string>('物料')
</script>

<template>
    <div>
        <a-segmented block v-model:value="key" :options="['物料', '大纲', '源码']" />
        <div class="pt-20 h-[calc(100vh-60px-30px-20px)]">
            <MaterialList v-if="key === '物料'" />
            <Outline v-if="key === '大纲'" />
            <Source v-if="key === '源码'" />
        </div>
    </div>
</template>

<style scoped></style>
