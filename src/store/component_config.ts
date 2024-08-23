import { markRaw, reactive } from 'vue'
import ButtonDev from '../editor/material/component/MaterialList/component/button/dev.vue'
import ButtonProd from '../editor/material/component/MaterialList/component/button/prod.vue'
import ContainerDev from '../editor/material/component/MaterialList/component/container/dev.vue'
import ContainerProd from '../editor/material/component/MaterialList/component/container/prod.vue'
import PageDev from '../editor/material/component/MaterialList/component/page/dev.vue'
import PageProd from '../editor/material/component/MaterialList/component/page/prod.vue'
import ModalProd from '../editor/material/component/MaterialList/component/modal/prod.vue'
import ModalDev from '../editor/material/component/MaterialList/component/modal/dev.vue'
import TableDev from '../editor/material/component/MaterialList/component/table/dev.vue'
import TableProd from '../editor/material/component/MaterialList/component/table/prod.vue'
import TableColumnDev from '../editor/material/component/MaterialList/component/table_column/dev.vue'
import TableColumnProd from '../editor/material/component/MaterialList/component/table_column/prod.vue'
import FormDev from '../editor/material/component/MaterialList/component/form/dev.vue'
import FormProd from '../editor/material/component/MaterialList/component/form/prod.vue'

export interface ComponentSetter {
    name: string
    label: string
    type: string
    [key: string]: any
}

export interface ComponentEvent {
    name: string
    label: string
}

export interface ComponentConfig {
    name: string
    default_props: Record<string, any>
    desc: string
    setter?: ComponentSetter[]
    styles_setter?: ComponentSetter[]
    events?: ComponentEvent[]
    methods?: ComponentMethod[]
    dev: any
    prod: any
}

interface StoreType {
    component_config: { [key: string]: ComponentConfig }
    register_component(name: string, config: ComponentConfig): void
}

export interface ComponentMethod {
    name: string
    label: string
}

export const useComponentConfigStore = reactive<StoreType>({
    component_config: {
        Container: {
            name: 'Container',
            default_props: {},
            desc: '容器',
            dev: markRaw(ContainerDev),
            prod: markRaw(ContainerProd),
        },
        Button: {
            name: 'Button',
            default_props: {
                type: 'primary',
                text: '按钮',
            },
            dev: markRaw(ButtonDev),
            prod: markRaw(ButtonProd),
            desc: '按钮',
            setter: [
                {
                    name: 'type',
                    label: '按钮类型',
                    type: 'select',
                    options: [
                        { label: '主按钮', value: 'primary' },
                        { label: '次按钮', value: 'default' },
                    ],
                },
                {
                    name: 'text',
                    label: '文本',
                    type: 'input',
                },
            ],
            styles_setter: [
                {
                    name: 'width',
                    label: '宽度',
                    type: 'input_number',
                },
                {
                    name: 'height',
                    label: '高度',
                    type: 'input_number',
                },
            ],
            events: [
                {
                    name: 'onClick',
                    label: '点击事件',
                },
                {
                    name: 'onMouseenter',
                    label: '鼠标移入',
                },
                {
                    name: 'onMouseleave',
                    label: '鼠标移出',
                },
            ],
        },
        Page: {
            name: 'Page',
            default_props: {},
            dev: markRaw(PageDev),
            prod: markRaw(PageProd),
            desc: '页面',
        },
        Modal: {
            name: 'Modal',
            default_props: {
                title: '弹窗',
            },
            desc: '弹窗',
            events: [
                {
                    name: 'onOk',
                    label: '确认事件',
                },
                {
                    name: 'onCancel',
                    label: '取消事件',
                },
            ],
            styles_setter: [],
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
            ],
            dev: markRaw(ModalDev),
            prod: markRaw(ModalProd),
            methods: [
                {
                    name: 'open',
                    label: '打开弹窗',
                },
                {
                    name: 'close',
                    label: '关闭弹窗',
                },
            ],
        },
        Table: {
            name: 'Table',
            default_props: {},
            desc: '表格',
            setter: [
                {
                    name: 'url',
                    label: 'url',
                    type: 'input',
                },
            ],
            dev: markRaw(TableDev),
            prod: markRaw(TableProd),
        },
        TableColumn: {
            name: 'TableColumn',
            desc: '表格列',

            default_props: () => ({
                dataIndex: `col_${new Date().getTime()}`,
                title: '列名',
            }),
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'text',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'dataIndex',
                    label: '字段',
                    type: 'input',
                },
            ],
            dev: markRaw(TableColumnDev),
            prod: markRaw(TableColumnProd),
        },
        Form: {
            name: 'Form',
            default_props: {},
            desc: '表单',
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
            ],
            events: [
                {
                    name: 'onFinish',
                    label: '提交事件',
                },
            ],
            dev: markRaw(FormDev),
            prod: markRaw(FormProd),
            methods: [
                {
                    name: 'submit',
                    label: '提交',
                }
            ],
        },
        FormItem: {
            name: 'FormItem',
            desc: '表单项',
            default_props: () => ({
                name: new Date().getTime(),
                label: '姓名',
                type: 'input',
            }),
            dev: markRaw(TableColumnDev),
            prod: markRaw(TableColumnProd),
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'input',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'label',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'name',
                    label: '字段',
                    type: 'input',
                },
                {
                    name: 'rules',
                    label: '校验',
                    type: 'select',
                    options: [
                        {
                            label: '必填',
                            value: 'required',
                        },
                    ],
                },
            ],
        },
    },
    register_component(name: string, config: ComponentConfig) {
        this.component_config = {
            ...this.component_config,
            [name]: config,
        }
    },
})
