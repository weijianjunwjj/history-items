import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import setupConfig from './config'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx';

export default ({ mode }: { mode: any }) => {
  const env = loadEnv(mode, process.cwd());
  const { build } = setupConfig({ mode })
  const plugins = []
  if (mode === 'lib') {
    plugins.push(cssInjectedByJsPlugin())
  } else {
    plugins.push(
      viteCompression({
        threshold: 10240
      })
    )
  }
  return defineConfig({
    root: path.resolve(__dirname),
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      Components({
        dts: false,
        resolvers: [NaiveUiResolver()]
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: false
      }),
      ...plugins
    ],
    publicDir: 'public',
    define: {
      'process.env': env, // 注入所有环境变量
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        __ROOT__: path.resolve(__dirname, '')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'] // 自动匹配文件后缀名
    },
    server: {
      proxy: {
        '/api': { target: `http://127.0.0.1:${process.env.API_PORT || 8787}`, changeOrigin: true }
      }
    },
    preview: {
      proxy: {
        '/api': { target: `http://127.0.0.1:${process.env.API_PORT || 8787}`, changeOrigin: true }
      }
    },
    build
  })
}
