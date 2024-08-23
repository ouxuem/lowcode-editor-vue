<script setup lang="ts">
import 'splitpanes/dist/splitpanes.css'
import { Splitpanes, Pane } from 'splitpanes'
import Material from './editor/material/Material.vue'
import Header from './editor/header/Header.vue'
import Setting from './editor/setting/Setting.vue'
import EditArea from './editor/edit_area/EditArea.vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useComponentsStore } from '@/store'
import { computed } from 'vue'

const store = useComponentsStore
const mode = computed(() => store.mode)
const components_list = computed(() => store.components_list)
</script>

<template>
    <DndProvider :backend="HTML5Backend">
        <div class="flex flex-col h-[100vh]">
            <div class="border-[#000] border-b-[1px] h-60 flex items-center">
                <Header />
            </div>
            <div v-if="mode === 'edit'">
                <Splitpanes>
                    <Pane size="24" min-size="20" max-size="30">
                        <Material />
                    </Pane>
                    <Pane>
                        <EditArea />
                    </Pane>
                    <Pane size="30" min-size="30" max-size="50">
                        <Setting />
                    </Pane>
                </Splitpanes>
            </div>
            <RecursiveComponent
                v-else
                :components="components_list"
                :-dev-mode="false"
                :-prod-mode="true" />
        </div>
    </DndProvider>
</template>

<style scoped>
:deep(.splitpanes--vertical > .splitpanes__splitter) {
    min-width: 3px;
    background-color: #ccc;
}

:deep(.splitpanes--vertical > .splitpanes__splitter:hover) {
    width: 6px;
}
</style>
