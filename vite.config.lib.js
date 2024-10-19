import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        cssCodeSplit: true,
        emptyOutDir: false,
        lib: {
            name: 'v3-d-table',
            entry: `src/components/v3-d-table.vue`,
            fileName: () => 'lib/v3-d-table.[format].js'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                inlineDynamicImports: false,
                globals: {vue: 'Vue'},
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
