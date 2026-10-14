/*
 * @Author: weijianjun
 * @Date: 2022-12-14 16:38:55
 * @LastEditors: weijianjun
 * @LastEditTime: 2022-12-30 09:25:13
 * @FilePath: \yadea-website\ecosystem.config.js
 * @Description:
 *
 */

module.exports = {
  apps: [
    {
      name: 'yadea', // 设置启动项目名称
     // exec_mode: 'cluster',
    // instances: 1,
      // 注意这里的相对路径。要访问到index.mjs就行了，如果你是整个.output一起放在服务器的话就和官方一样路写成./.output/server/index.mjs就好了
      script: './.output/server/index.mjs',
      error_file: './logs/err-0.log',
      autorestart: true,
    //  watch: true,
      env: {
        HOST: '0.0.0.0',
        NITRO_PORT: 8003,
        NODE_ENV: 'production'
      }
      // env_production: {
      //   HOST: 'localhost',
      //   NITRO_PORT: 3001,
      //   NODE_ENV: 'production'
      // }
    }
  ]
}
