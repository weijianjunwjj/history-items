/*
 * @Author: weijianjun
 * @Date: 2022-12-13 10:00:59
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-01-05 09:49:57
 * @FilePath: \yadea-website\.eslintrc.js
 * @Description:
 *
 */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'vue/html-self-closing"': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/multi-word-component-names': 0,
    // ts规则
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 140, //代码单行长度
        tabWidth: 2, //tab键缩进为2空格
        useTabs: false, //使用空格缩进
        singleQuote: true, //js单引号
        semi: false, //去分号
        trailingComma: 'none', //无尾逗号
        arrowParens: 'avoid', //箭头函数尽可能省略括号
        jsxBracketSameLine: true, //标签换行后>单独一行
        endOfLine: 'auto'
      }
    ],
    'vue/multi-word-component-names': 0
    // 'vue/multi-word-component-names': [
    //   'error',
    //   {
    //     ignores: ['index'] //需要忽略的组件名
    //   }
    // ]
  }
}
