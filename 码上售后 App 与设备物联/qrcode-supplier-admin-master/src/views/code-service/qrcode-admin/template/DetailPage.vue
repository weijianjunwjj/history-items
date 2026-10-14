<template>
  <div style="position: relative; padding: 10px 0 50px">
    <component :is="moduleName" :setting="setting" />

    <!-- 更换模板   -->
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
  import {
    detailModules,
    detailModuleMap,
    detailDefaultSetting,
  } from './modules.js'

  export default {
    name: 'DetailPage',
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
    components: { ...detailModules(), SelectModule, SaveBar },
    data() {
      return {
        moduleName: null,
        setting: null,
        storageName: null,
        storageSetting: null,
        modules: detailModuleMap(),
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
      if (this.template.detailModule) {
        this.moduleName = this.template.detailModule
        this.storageName = this.template.detailModule
      } else {
        this.moduleName = 'DetailModule'
        this.storageName = this.moduleName
      }
      if (this.template.detailSetting) {
        this.setting = JSON.parse(this.template.detailSetting)
        this.storageSetting = this.template.detailSetting
      } else {
        this.setting = detailDefaultSetting(this.moduleName)
        this.storageSetting = JSON.stringify(this.setting)
      }
    },
    methods: {
      handleSave() {
        const setting = {
          id: this.id,
          detailModule: this.moduleName,
          detailSetting: JSON.stringify(this.setting),
        }
        console.log('this.setting', this.setting)
        api.updateTemplate(setting).then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.template.detailModule = setting.detailModule
          // eslint-disable-next-line vue/no-mutating-props
          this.template.detailSetting = setting.detailSetting
          this.storageName = setting.detailModule
          this.storageSetting = setting.detailSetting
        })
      },
      handleReset() {
        Modal.confirm({
          title: '系统提示',
          content: `是否还原模板?`,
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
        this.setting = detailDefaultSetting(name)
      },
    },
  }
</script>

<style></style>
