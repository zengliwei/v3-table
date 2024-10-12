import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const libEntry = 'v3-d-table';

export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: `src/${libEntry}.js`,
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
                    return info['originalFileName'] === `src/${libEntry}.js`
                        ? 'lib/v3-d-table.min.css' : 'lib/[name].[hash].[ext]';
                }
            }
        }
    }
});
