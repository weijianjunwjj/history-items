/*
 * @Author: weijianjun
 * @Date: 2023-02-22 17:55:45
 * @LastEditors: weijianjun
 * @LastEditTime: 2023-03-02 13:48:33
 * @FilePath: \yadea-website\plugins\vant.client.ts
 * @Description: 
 * 
 */
import { Form, Field, CellGroup, Button, Popup, Area, Radio, RadioGroup, Checkbox, Dialog, Cascader, Picker  } from 'vant'
import 'vant/lib/index.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component(Form.name, Form)
  nuxtApp.vueApp.component(Field.name, Field)
  nuxtApp.vueApp.component(CellGroup.name, CellGroup)
  nuxtApp.vueApp.component(Button.name, Button)
  nuxtApp.vueApp.component(Area.name, Area)
  nuxtApp.vueApp.component(Popup.name, Popup)
  nuxtApp.vueApp.component(Radio.name, Radio)
  nuxtApp.vueApp.component(RadioGroup.name, RadioGroup)
  nuxtApp.vueApp.component(Checkbox.name, Checkbox)
  nuxtApp.vueApp.component(Dialog.name, Dialog)
  nuxtApp.vueApp.component(Cascader.name, Cascader)
  nuxtApp.vueApp.component(Picker.name, Picker)
})
