<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import GoToLink, { gotoLinkConfig } from '@/editor/setting/component/GoToLink.vue'
import ShowMessage, { ShowMessageConfigProps } from '@/editor/setting/component/ShowMessage.vue'
import CustomJS, { CustomJSConfig } from '@/editor/setting/component/CustomJS.vue'
import ComponentMethod, {
    ComponentMethodConfig,
} from '@/editor/setting/component/ComponentMethod.vue'

export type ActionConfig =
    | ShowMessageConfigProps
    | gotoLinkConfig
    | CustomJSConfig
    | ComponentMethodConfig

const props = defineProps({
    action: {
        type: Object as PropType<ActionConfig>,
        required: false,
    },
    visible: {
        type: Boolean,
        required: true,
    },
    handleOk: {
        type: Function as PropType<(config?: ActionConfig) => void>,
        required: true,
    },
    handleCancel: {
        type: Function as PropType<() => void>,
        required: true,
    },
})

const map = {
    goToLink: '访问链接',
    showMessage: '消息提示',
    customJS: '自定义JS',
    componentMethod: '组件方法',
}

const key = ref<string>('访问链接')

const current_config = ref<ActionConfig>()

const customJSCode = ref('')
const linkUrl = ref('')

const messageConfig = ref<ShowMessageConfigProps['config']>({
    type: 'success',
    text: '',
})

const methodConfig = ref<ComponentMethodConfig['config']>({} as any)

const resetForms = () => {
    current_config.value = undefined
    messageConfig.value = {
        type: 'success',
        text: '',
    }
    customJSCode.value = ''
    linkUrl.value = ''
    methodConfig.value = {} as any
}

onMounted(() => {
    if (props.action?.type) {
        key.value = map[props.action.type]
    }
})

watch(
    () => props.visible,
    (newVisible) => {
        if (newVisible) {
            resetForms()
            if (props.action) {
                key.value = map[props.action.type]
                if (props.action.type === 'showMessage') {
                    messageConfig.value = props.action.config
                } else if (props.action.type === 'customJS') {
                    customJSCode.value = props.action.code || ''
                } else if (props.action.type === 'goToLink') {
                    linkUrl.value = props.action.url || ''
                } else if (props.action.type === 'componentMethod') {
                    methodConfig.value = props.action.config
                }
            }
        }
    }
)
</script>

<template>
    <a-modal
        :destroy-on-close="true"
        @ok="() => props.handleOk(current_config)"
        @cancel="props.handleCancel"
        title="事件动作配置"
        :width="800"
        :open="props.visible"
        okText="添加"
        cancelText="取消">
        <div class="h-500">
            <a-segmented
                block
                v-model:value="key"
                :options="['访问链接', '消息提示', '组件方法', '自定义JS']" />
            <GoToLink
                v-model:model-value="linkUrl"
                v-if="key === '访问链接'"
                @Change="(config) => (current_config = config)" />
            <ShowMessage
                v-model:model-value="messageConfig"
                v-if="key === '消息提示'"
                @Change="(config) => (current_config = config)" />

            <ComponentMethod
                v-model:model-value="methodConfig"
                v-if="key === '组件方法'"
                @change="(config) => (current_config = config)" />
            <CustomJS
                @change="(config) => (current_config = config)"
                v-model:model-value="customJSCode"
                v-if="key === '自定义JS'" />
        </div>
    </a-modal>
</template>
