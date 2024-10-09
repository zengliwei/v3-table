import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

const libEntry = 'v3-table';

export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: `src/${libEntry}.js`,
            name: 'v3-table',
            fileName: () => 'lib/v3-table.[format].js'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                assetFileNames: (info) => {
                    return info['originalFileName'] === `src/${libEntry}.js`
                        ? 'lib/v3-table.min.css' : 'lib/[name].[hash].[ext]';
                }
            }
        }
    }
});
