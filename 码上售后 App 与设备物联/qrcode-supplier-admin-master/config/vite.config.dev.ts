import { mergeConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
// eslint-disable-next-line import/no-unresolved
import AutoImport from 'unplugin-auto-import/vite'
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite'
import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: false,
      fs: {
        strict: true,
      },
      port: 9000,
      hmr: true, // 开启热更新
      proxy: {
        '*': {
          target: `http://127.0.0.1:8080/`,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      AutoImport({
        imports: ['vue', 'vue-router', 'vue-i18n'],
        dts: 'src/auto-import.d.ts',
      }),
      Components({
        // 指定组件位置，默认是src/components
        dirs: ['src/components/Global'],
        extensions: ['vue'],
        // 配置文件生成位置
        dts: 'src/components/Global.d.ts',
      }),
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
)
