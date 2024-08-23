<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import axios from 'axios'
import { computed, onMounted, ref, useSlots, watch } from 'vue'
import { Table as ATable } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useComponentsStore } from '@/store'
const slots = useSlots()
const props = defineProps<CommonComponentProps>()

const data = ref<Array<Record<string, any>>>([])
const lading = ref(false)

const current_mode = computed(() => useComponentsStore.mode)

const getData = async () => {
    if (props.url) {
        lading.value = true
        const res = await axios.get(props.url)
        data.value = res.data
        lading.value = false
    }
}

const columns = computed(() => {
    return slots.default?.()[0].props?.components.map((item: any) => {
        if (item?.props?.type === 'date') {
            return {
                title: item?.props?.title,
                dataIndex: item.props.dataIndex,
                customRender: ({ text }: { text: any }) =>
                    text ? dayjs(text).format('YYYY-MM-DD') : null,
            }
        } else {
            return {
                title: item?.props?.title,
                dataIndex: item.props.dataIndex,
            }
        }
    })
})

onMounted(() => {
    getData()
})

watch(current_mode, () => {
    getData()
})
</script>

<template>
    <ATable
        :loading="lading"
        :data-source="data"
        row-key="id"
        :pagination="false"
        :columns="columns">
    </ATable>
</template>
