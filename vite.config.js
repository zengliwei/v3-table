import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const libEntry = 'v3-d-table';

export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: [
                `src/${libEntry}.js`,
                `src/assets/v3-d-table-default.css`
            ],
            name: 'v3-d-table',
            fileName: () => 'lib/v3-d-table.[format].js'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                assetFileNames: (info) => {
                    if (info.name.length - info.name.lastIndexOf('.css') === 4) {
                        return `lib/${info.name.substring(0, info.name.length - 4)}.min.css`;
                    }
                    return 'lib/[name].[ext]';
                }
            }
        }
    }
});
