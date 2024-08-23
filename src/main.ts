import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
createApp(App)
    .use(VueMonacoEditorPlugin, {
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs' },
    })
    .mount('#app')
