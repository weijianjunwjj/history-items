<template>
  <div style="position: relative">
    <component :is="moduleName" :setting="setting" />
    <!-- <callModule1 :setting="setting" /> -->

    <select-module
      :module-name="moduleName"
      :modules="modules"
      @change="handleChange"
    />

    <save-bar :changed="changed" @save="handleSave" @reset="handleReset" />
  </div>
</template>

<script lang="ts">
  import api from '@/api/code-service/prod-center/qrcode/template'
  import { Modal } from '@arco-design/web-vue'
  import SelectModule from './components/SelectModule.vue'
  import SaveBar from './components/SaveBar.vue'
  import { callModules, callDefaultSetting, callModuleMap } from './modules.js'

  export default {
    name: 'CallPage',
    components: { ...callModules(), SelectModule, SaveBar },
    props: {
      id: {
        type: String,
        required: true,
      },
      template: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        moduleName: null,
        setting: null,
        storageName: null,
        storageSetting: null,
        modules: callModuleMap(),
      }
    },
    computed: {
      changed() {
        return (
          this.storageName !== this.moduleName ||
          JSON.stringify(this.setting) !== this.storageSetting
        )
      },
    },
    created() {
      console.log('this', this)
      // eslint-disable-next-line no-debugger
      if (this.template.callModule) {
        this.moduleName = this.template.callModule
        this.storageName = this.template.callModule
      } else {
        this.moduleName = 'CallModule'
        this.storageName = this.moduleName
      }
      if (this.template.callSetting) {
        this.setting = JSON.parse(this.template.callSetting)
        this.storageSetting = this.template.callSetting
      } else {
        this.setting = callDefaultSetting(this.moduleName)
        this.storageSetting = JSON.stringify(this.setting)
      }
    },
    methods: {
      handleSave() {
        const setting = {
          id: this.id,
          callModule: this.moduleName,
          callSetting: JSON.stringify(this.setting),
        }
        console.log('this.setting', this.setting)
        api.updateTemplate(setting).then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.template.callModule = setting.callModule
          // eslint-disable-next-line vue/no-mutating-props
          this.template.callSetting = setting.callSetting
          this.storageName = setting.callModule
          this.storageSetting = setting.callSetting
        })
      },
      handleReset() {
        Modal.confirm({
          title: '系统提示',
          content: `是否放弃更改，还原至初始状态?`,
          onOk: () => {
            this.moduleName = this.storageName
            this.setting = JSON.parse(this.storageSetting)
          },
        })
      },
      handleSelect() {
        this.drawer = true
      },
      handleChange(name) {
        this.moduleName = name
        this.setting = callDefaultSetting(name)
      },
    },
  }
</script>

<style></style>
