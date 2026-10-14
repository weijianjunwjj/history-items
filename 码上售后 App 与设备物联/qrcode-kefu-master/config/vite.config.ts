import path, { resolve } from 'path'
import { build, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
// eslint-disable-next-line import/no-unresolved
import AutoImport from 'unplugin-auto-import/vite'
import eslint from 'vite-plugin-eslint'
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite'
import configCompressPlugin from './plugin/compress'
import configVisualizerPlugin from './plugin/visualizer'
import configArcoResolverPlugin from './plugin/arcoResolver'
import configStyleImportPlugin from './plugin/styleImport'
import configImageminPlugin from './plugin/imagemin'

export default defineConfig(({ command, mode }) => {
  const Env = loadEnv(mode, process.cwd())

  // console.log('command', command)
  // console.log('mode', mode)
  // console.log('Env', Env)
  const isDev = command === 'serve'
  console.log('isDev', isDev)
  const URL = Env.VITE_API_BASE_URL
  console.log('URL', URL)
  if (isDev) {
    return {
      plugins: [
        vue(),
        vueJsx(),
        svgLoader({ svgoConfig: {} }),
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
          include: [
            'src/**/*.ts',
            'src/**/*.js',
            'src/**/*.tsx',
            'src/**/*.vue',
          ],
          exclude: ['node_modules'],
        }),
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
            find: 'vue-i18n',
            replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
          },
          {
            find: 'vue',
            replacement: 'vue/dist/vue.esm-bundler.js', // compile template
          },
        ],
        extensions: ['.ts', '.js'],
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
        open: true,
        port: 8888,
        hmr: true, // 开启热更新
        proxy: {
          [URL]: {
            target: `https://kefu-dev.iotive.cn/`,
            changeOrigin: true,
            pathRewrite: {
              [`^${URL}`]: '',
            },
          },
        },
      },
    }
  }
  return {
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({ svgoConfig: {} }),
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
      // ---build---
      // configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      configArcoResolverPlugin(),
      configStyleImportPlugin(),
      configImageminPlugin(),
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
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
        },
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js', // compile template
        },
      ],
      extensions: ['.ts', '.js', 'tsx'],
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
      port: '8888',
      proxy: {
        [Env.VITE_API_BASE_URL]: {
          target: `https://kefu-dev.iotive.cn/`,
          changeOrigin: true,
          pathRewrite: {
            [`^${Env.VITE_API_BASE_URL}`]: '',
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
