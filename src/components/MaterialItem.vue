<script setup lang="ts">
import { useDrag } from 'vue3-dnd'
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
})

const [_, drag] = useDrag(() => ({
    type: props.name,
    item: () => ({
        type: props.name,
    }),
}))
</script>

<template>
    <div :ref="drag" class="bg-white hover:bg-[#ccc] cursor-move inline-block px-10 py-8 m-10 border-dashed border-[1px] border-[#000]">
        {{ props.desc }}
    </div>
</template>
