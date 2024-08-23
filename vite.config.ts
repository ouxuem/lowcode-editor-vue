import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'

import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),

        Components({
            dts: true,
            resolvers: [
                AntDesignVueResolver({
                    importStyle: false,
                }),
            ],
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx$/],
        }),

        viteMockServe({
            mockPath: 'mock',
            enable: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
