<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
    useComponentsStore,
    useComponentConfigStore,
    get_component_by_id,
    ComponentEvent,
} from '@/store'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import ActionModal, { ActionConfig } from '@/components/ActionModal.vue'
const components_store = useComponentsStore
const { component_config } = useComponentConfigStore
const current_component = computed(() => components_store.current_component)
const components_list = computed(() => components_store.components_list)
const current_event = ref<ComponentEvent>()
const current_action = ref<ActionConfig>()
const current_action_index = ref<number>()
const actionModalOpen = ref(false)

function handleModalOk(config?: ActionConfig) {
    if (!config || !current_event || !current_component) return
    if (current_action.value) {
        components_store.update_component_props(current_component.value?.id!, {
            [current_event!.value!.name]: {
                actions: current_component.value?.props[current_event!.value!.name]?.actions.map(
                    (item: ActionConfig, index: number) => {
                        return index === current_action_index.value ? config : item
                    }
                ),
            },
        })
    } else {
        components_store.update_component_props(current_component.value?.id!, {
            [current_event!.value!.name]: {
                actions: [
                    ...(current_component.value?.props[current_event!.value!.name]?.actions || []),
                    config,
                ],
            },
        })
    }

    current_action.value = undefined
    actionModalOpen.value = false
}

const delete_action = (event: ComponentEvent, index: number) => {
    if (!current_component) return

    const actions = current_component.value?.props[event.name]?.actions
    actions?.splice(index, 1)

    components_store.update_component_props(current_component.value?.id!, {
        [event.name]: {
            actions: actions,
        },
    })
}

function editAction(config: any, index: number) {
    if (!current_component) return
    current_action.value = config
    current_action_index.value = index
    actionModalOpen.value = true
}
const activeKeys = ref<string[]>([])
const open_key = computed(() => {
    if (!current_component.value) return []

    return (component_config[current_component.value?.name!]?.events || []).map((item) => item.name)
})

// 监听 current_component 的变化
watch(
    () => current_component.value,
    (newComponent) => {
        if (newComponent) {
            activeKeys.value = open_key.value
        }
    },
    { immediate: true }
) // 添加 immediate: true 以确保初始化时也会执行

onMounted(() => {
    activeKeys.value = open_key.value
})
</script>

<template>
    <div v-if="current_component" class="px-10">
        <a-collapse collapsible="header" v-model:activeKey="activeKeys">
            <a-collapse-panel
                v-for="item in component_config[current_component.name]?.events || []"
                :key="item.name"
                :header="item.label">
                <template #extra>
                    <a-button
                        type="primary"
                        @click="
                            () => {
                                current_event = item
                                actionModalOpen = true
                            }
                        "
                        >添加动作</a-button
                    >
                </template>
                <div v-for="(action, index) in current_component.props[item.name]?.actions || []">
                    <div
                        v-if="action.type === 'goToLink'"
                        class="relative border border-[#aaa] m-10 p-10">
                        <div class="text-[blue]">跳转链接</div>
                        <div>{{ action.url }}</div>
                        <div
                            @click="() => editAction(action, index)"
                            class="absolute top-10 right-30 cursor-pointer">
                            <EditOutlined />
                        </div>
                        <div
                            @click="() => delete_action(item, index)"
                            class="absolute top-10 right-10 cursor-pointer">
                            <DeleteOutlined />
                        </div>
                    </div>
                    <div
                        v-if="action.type === 'showMessage'"
                        class="border border-[#aaa] m-10 p-10 relative">
                        <div class="text-[blue]">消息弹窗</div>
                        <div>{{ action.config.type }}</div>
                        <div>{{ action.config.text }}</div>
                        <div
                            @click="() => editAction(action, index)"
                            class="absolute top-10 right-30 cursor-pointer">
                            <EditOutlined />
                        </div>
                        <div
                            @click="() => delete_action(item, index)"
                            class="absolute top-10 right-10 cursor-pointer">
                            <DeleteOutlined />
                        </div>
                    </div>
                    <div
                        v-if="action.type === 'customJS'"
                        class="border border-[#aaa] m-10 p-10 relative">
                        <div class="text-[blue]">自定义JS</div>
                        <div
                            @click="() => editAction(action, index)"
                            class="absolute top-10 right-30 cursor-pointer">
                            <EditOutlined />
                        </div>
                        <div
                            @click="() => delete_action(item, index)"
                            class="absolute top-10 right-10 cursor-pointer">
                            <DeleteOutlined />
                        </div>
                    </div>

                    <div
                        v-if="action.type === 'componentMethod'"
                        class="border border-[#aaa] m-10 p-10 relative">
                        <div class="text-[blue]">组件方法</div>
                        <div>
                            {{
                                get_component_by_id(action.config.component_id, components_list)
                                    ?.desc
                            }}
                        </div>
                        <div>{{ action.config.component_id }}</div>
                        <div>{{ action.config.method }}</div>
                        <div
                            @click="() => editAction(action, index)"
                            class="absolute top-10 right-30 cursor-pointer">
                            <EditOutlined />
                        </div>
                        <div
                            @click="() => delete_action(item, index)"
                            class="absolute top-10 right-10 cursor-pointer">
                            <DeleteOutlined />
                        </div>
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>

        <ActionModal
            :handle-cancel="
                () => {
                    actionModalOpen = false
                    current_action = undefined
                }
            "
            :handle-ok="handleModalOk"
            :visible="actionModalOpen"
            :action="current_action" />
    </div>
</template>
