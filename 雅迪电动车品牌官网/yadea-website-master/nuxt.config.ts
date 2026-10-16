/*
 * @Author: weijianjun
 * @Date: 2022-11-28 15:59:29
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-06 19:09:29
 * @FilePath: \yadea-website\nuxt.config.ts
 * @Description:  https://nuxt.com/docs/api/configuration/nuxt-config
 *
 */
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin, AndDesignVueResolve, VantResolve } from 'vite-plugin-style-import'
import { themeColor } from './configs/data'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import allRoutes from './allRoutes'
import defaultEnvData from './env/envData'
interface VITE_ENV_CONFIG {
  VITE_API_ENV: string
  VITE_API_URL: string
}

const envScript = process.env.npm_lifecycle_script?.split(' ') || []
const envName = envScript[envScript.length - 1] // 通过启动命令区分环境
let envData = loadEnv(envName, 'env') as unknown as VITE_ENV_CONFIG
envData = envData.VITE_API_URL ? envData : defaultEnvData

const { NODE_ENV } = process.env

const argv = process.argv

const [, , mode] = argv
let preRenderRoutes = <any>[]

const isG = mode === 'generate'
if (isG) {
  const routes = argv.filter((item, index) => index > 4)
  routes.forEach((route, index) => {
    routes[index] = routes[index].replace('--', '/')
  })
  preRenderRoutes = routes?.length ? [...routes] : allRoutes
  // if (preRenderRoutes.every((item: string) => item !== '/')) preRenderRoutes.push('/')
}

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    // buildDir: 'opt/yadeaStatic/',
    // output: {
    //   dir: 'opt/yadeaStatic/'
    //   // serverDir: string;
    //   // publicDir: string;
    // },
    prerender: {
      routes: preRenderRoutes
    }
  },
  // 公开的配置
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      ...envData,
      isG,
      HISTORY_LAB_API_URL: process.env.HISTORY_LAB_API_URL || ''
    }
  },
  vite: {
    server: {
      hmr: true,
      proxy: {
        '/apis': {
          target: envData.VITE_API_URL, //这里是接口地址
          changeOrigin: true
        }
      }
    },
    // 配置esbuild
    esbuild: {
      drop: ['console', 'debugger']
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'assets/svg')]
      }),
      viteCommonjs(),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })]
      }),
      createStyleImportPlugin({
        resolves: [AndDesignVueResolve()],
        libs: [
          // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name: string) => {
              return `ant-design-vue/es/${name}/style/index`
            }
          }
          // {
          //   libraryName: 'vant',
          //   esModule: true,
          //   resolveStyle: (name: string) => {
          //     return `vant/es/${name}/style/index`
          //   }
          // }
        ]
      })
    ],
    ssr: {
      noExternal: ['ant-design-vue']
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': themeColor,
            'link-color': '#000'
          },
          additionalData: '@import "assets/styles/variable.less";@import "assets/styles/global-mixins.less";',
          javascriptEnabled: true
        }
      }
    },
    logLevel: process.env.npm_lifecycle_event == 'dev' ? 'info' : 'silent'
  },
  build: {
    transpile: process.env.npm_lifecycle_event == 'dev' ? ['lodash-es'] : ['@babel/runtime']
  },
  // // 传递给服务端的，不公开的，返回服务端会把 public 跟 private 两个对象合并上传，private会覆盖public
  // privateRuntimeConfig: {
  //   BASE_URL: 'https://zhengjiajun.com:66'
  // },
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: '雅迪电动车官方网站-更高端的电动车',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
      script: [
        {
          type: 'text/javascript',
          src: 'https://webapi.amap.com/maps?v=2.0&key=53a18a2c13b8783f310fd343af7e9c09&plugin=AMap.Geolocation,AMap.Geocoder,AMap.CitySearch'
        }
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover'
        },
        { name: 'applicable-device', content: 'pc,mobile' }
      ]
    }
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:8080/', // 目标服务器ip
    //     pathRewrite: {
    //       '^/api/': '/', // 把 /api 替换成 /
    //       changeOrigin: true // 是否跨域
    //     }
    //   }
    // }
  },

  postcss: {
    plugins: {
      'postcss-px-to-viewport': {
        unitToConvert: 'mpxvw', // 要转化的单位
        viewportWidth: 375, // UI设计稿的宽度
        unitPrecision: 6, // 转换后的精度，即小数点位数
        propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
        viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
        fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
        selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
        mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
        replace: true, // 是否转换后直接更换属性值
        exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
        landscape: false // 是否处理横屏情况
      },
      'postcss-px-to-viewport-8-plugin': {
        unitToConvert: 'pxvw', // 需要转换的单位，默认为"px"
        viewportWidth: 1920, // 设计稿的视口宽度  750 /2 = 375
        unitPrecision: 6, // 单位转换后保留的精度
        propList: ['*'], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
        viewportUnit: 'vw', // 希望使用的视口单位
        fontViewportUnit: 'vw', // 字体使用的视口单位
        // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
        // 下面配置表示类名中含有'keep-px'都不会被转换
        selectorBlackList: ['keep-px'],
        minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
        mediaQuery: false, // 媒体查询里的单位是否需要转换单位
        replace: true, //  是否直接更换属性值，而不添加备用属性
        exclude: [/node_modules/] // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
        // include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
        // landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
        // landscapeUnit: 'vw', // 横屏时使用的单位
      },
      autoprefixer: {}
    }
  },
  modules: ['@vueuse/nuxt', '@pinia/nuxt'],
  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false
  },
  alias: {
    '@': resolve(__dirname, './')
  },
  css: ['assets/styles/font.css', 'assets/styles/normalize.less', 'assets/styles/atom.less']
})
