import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// eslint-disable-next-line import/no-unresolved
import AutoImport from 'unplugin-auto-import/vite'
import eslint from 'vite-plugin-eslint'
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
// import requireTransform from 'vite-plugin-require-transform'
import { createHtmlPlugin } from 'vite-plugin-html'
// import { ViteEjsPlugin } from 'vite-plugin-ejs'
import styleImport, { VantResolve } from 'vite-plugin-style-import'

export default defineConfig(({ command, mode }) => {
  const Env = loadEnv(mode, process.cwd())

  const isDev = command === 'serve'
  console.log('isDev', isDev)
  const URL = Env.VITE_API_BASE_URL
  return {
    plugins: [
      vue(),
      // ViteEjsPlugin(),
      vueJsx(),
      VueSetupExtend(),
      svgLoader({ svgoConfig: {} }),
      styleImport({
        resolves: [VantResolve()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(__dirname, '../../packages/assets/icon/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            // title_icon,
          },
        },
        minify: true,
      }),
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
        include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
      // requireTransform({
      //   fileRegex: /.js$|.ts$|.vue$/,
      // }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, '../src'),
        },
        {
          find: 'assets',
          replacement: resolve(__dirname, '../src/assets'),
        },
        {
          find: '@hx/packages',
          replacement: resolve(__dirname, '../node_modules/@hx/packages'),
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
        },
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js', // compile template
        },
      ],
      extensions: ['.ts', '.js', '.tsx'],
    },
    define: {
      'process.env': {},
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              'src/assets/style/variable.less'
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    server: {
      // 服务器主机名
      host: '0.0.0.0',
      open: false,
      port: 9000,
      hmr: true, // 开启热更新
      proxy: {
        [URL]: {
          target: `http://127.0.0.1:8080/`,
          changeOrigin: true,
          pathRewrite: {
            [`^${URL}`]: '',
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  }
})
