import { defineConfig, loadEnv } from 'vite'

import { convertEnv, getSrcPath, getRootPath } from './build/utils'
import { createVitePlugins } from './build/plugin'
import { OUTPUT_DIR, PROXY_CONFIG } from './build/constant'

export default defineConfig(({ command, mode }) => {
  const srcPath = getSrcPath()
  const rootPath = getRootPath()
  const isBuild = command === 'build'

  const env = loadEnv(mode, process.cwd())
  const viteEnv = convertEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_USE_PROXY, VITE_BASE_API } = viteEnv

  console.log('VITE_BASE_API :>> ', VITE_BASE_API)

  return {
    base: VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
      open: false,
      hmr:{
        overlay:false
      }
      // proxy: VITE_USE_PROXY
      //   ? {
      //     '/tools/file/upload': {
      //       target: 'http://192.168.2.44:3100/',
      //       changeOrigin: true, // 是否开启跨域
      //       secure: true //默认为true，是否需要携带安全证书，即https时，是需要的，设置成false就不用了
      //     },
      //   }
      //   : undefined,
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR || 'dist',
      reportCompressedSize: false, // 启用/禁用 gzip 压缩大小报告
      chunkSizeWarningLimit: 1024, // chunk 大小警告的限制（单位kb）
    },
  }
})
