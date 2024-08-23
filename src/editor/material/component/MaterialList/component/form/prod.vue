<script setup lang="ts">
import { CommonComponentProps } from '@/editor/interface'
import { computed, reactive, ref, useSlots } from 'vue'
import dayjs from 'dayjs'
import { DatePicker as ADatePicker, FormInstance, message } from 'ant-design-vue'
const props = defineProps<CommonComponentProps>()
const slots = useSlots()
const formRef = ref<FormInstance | null>(null)
const formModel = reactive<Record<string, any>>({})

const formItems = computed(() => {
    return slots.default?.()[0].props?.components.map((item: any) => {
        formModel[item.props?.name] = ''
        return {
            label: item.props?.label,
            name: item.props?.name,
            type: item.props?.type,
            id: item.id,
            rules: item.props?.rules,
        }
    })
})

async function save(values: any) {
    Object.keys(values).forEach((key) => {
        if (dayjs.isDayjs(values[key])) {
            values[key] = values[key].format('YYYY-MM-DD')
        }
    })

    props.onFinish(values)
}

const submit = async () => {
    try {
        const values = await formRef.value?.validateFields()
        if (values) {
            save(values)
        }
    } catch (_) {
        message.error('请输入必填项')
    }
}

defineExpose({
    submit,
})
</script>

<template>
    <a-form
        ref="formRef"
        :model="formModel"
        @finish="save"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 18 }">
        <a-form-item
            v-for="item in formItems"
            :key="item.name"
            :name="item.name"
            :label="item.label"
            :rules="item.rules === 'required' ? [{ required: true, message: '不能为空' }] : []">
            <a-input v-model:value="formModel[item.name]" v-if="item.type === 'input'" />
            <ADatePicker v-model:value="formModel[item.name]" v-if="item.type === 'date'" />
        </a-form-item>
    </a-form>
</template>
