<script setup lang="ts">
import { useComponentsStore } from '@/store'
import { computed, ref } from 'vue'

const store = useComponentsStore
const mode = computed(() => store.mode)
const savedComponentId = ref<number | null>(null)

const enterPreview = () => {
    savedComponentId.value = store.current_component_id
    store.set_mode('preview')
    store.set_cur_component_id(null)
}

const exitPreview = () => {
    store.set_mode('edit')

    setTimeout(() => {
        store.set_cur_component_id(savedComponentId.value)
    }, 500)
}
</script>

<template>
    <div class="w-full h-full">
        <div class="h-50 flex justify-between items-center px-20">
            <div class="text-xl font-bold">浅浅低代码编辑器</div>
            <a-space>
                <a-button v-if="mode === 'edit'" type="primary" @click="enterPreview"
                    >预览</a-button
                >
                <a-button v-if="mode === 'preview'" type="primary" @click="exitPreview"
                    >退出预览</a-button
                >
            </a-space>
        </div>
    </div>
</template>

<style scoped></style>
