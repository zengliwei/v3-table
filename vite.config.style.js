import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: true,
        lib: {
            name: 'v3-d-table',
            entry: `src/assets/v3-d-table-default.css`,
            fileName: () => 'lib/v3-d-table.[format].js'
        },
        rollupOptions: {
            output: {
                assetFileNames: 'lib/v3-d-table-default.min.css'
            }
        }
    }
});
