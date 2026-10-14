<template>
  <div class="edit-page">
    <div class="close-btn" @click="emitClose"> <icon-close /> 返回 </div>
    <a-tabs v-model:activeKey="activeIndex" lazy-load @change="onTabChange">
      <a-tab-pane key="info" title="基本信息">
        <div class="wrapper-container">
          <a-form
            ref="editForm"
            :model="form"
            :label-col-props="{ span: 1.5 }"
            @submit="submitForm"
          >
            <a-form-item
              label="模板名称"
              field="name"
              :rules="[{ required: true, message: '名称不能为空' }]"
              :trigger="['change', 'input', 'blur']"
            >
              <a-input v-model="form.name" autocomplete="off" />
            </a-form-item>

            <a-form-item label="服务码Logo">
              <ImageUpload
                v-model="form.logoPath"
                v-model:loading="loading"
                :limit="1"
                tip="请上传 大小不超过 5MB 格式为 png/jpg/jpeg 的文件"
              />
            </a-form-item>

            <a-form-item label="二维码预览">
              <QRCodeImage :src="form.logoPath" />
            </a-form-item>

            <a-form-item label="子页面主题色">
              <el-color-picker v-model="form.baseColor" size="mini" />
            </a-form-item>

            <a-form-item label="扫码跳转路径">
              <a-radio-group v-model="form.redirectPage">
                <a-radio value="pages/call/index">拨号页</a-radio>
                <a-radio value="pages/index/index">主页</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" :disabled="loading"
                >保存</a-button
              >
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>

      <a-tab-pane v-if="form.id && showCall" key="callPage" title="拨号页">
        <call-page :id="form.id" :template="form" />
      </a-tab-pane>

      <a-tab-pane v-if="form.id" key="detailPage" title="设备详情">
        <detail-page :id="form.id" :template="form" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
  import api from '@/api/code-service/prod-center/qrcode/template'
  import { Modal } from '@arco-design/web-vue'
  import ImageUpload from '@hx/packages/components/ImageUpload/index.vue'
  import QRCodeImage from '@hx/packages/components/QRCodeImage/index.vue'
  import CallPage from './CallPage.vue'
  import DetailPage from './DetailPage.vue'
  import { callDefaultSetting, detailDefaultSetting } from './modules.js'
  /* eslint-disable no-unreachable */
  const app = window.$app
  export default {
    name: 'Edit',
    components: { CallPage, DetailPage, ImageUpload, QRCodeImage },
    props: {
      templateId: null,
    },
    data() {
      return {
        activeIndex: 'info',
        form: {
          name: '',
          logoPath: '',
        },
        loading: false,
        showCall: true,
      }
    },
    created() {
      if (this.templateId) {
        api.getTemplate(this.templateId).then((res) => {
          this.form = res.data

          if (this.form.redirectPage === undefined) {
            this.form.redirectPage = 'pages/call/index'
          }
          this.isShowCall()
          console.log('this.form', this.form)
          // eslint-disable-next-line no-debugger
        })
      }
    },
    methods: {
      isShowCall() {
        this.showCall = this.form.redirectPage !== 'pages/index/index'
      },
      onTabChange() {
        window.scrollTo(0, 0)
      },
      emitClose() {
        console.log('this', this)
        this.$emit('handleClose')
      },
      submitForm({ errors, values }: { errors: any; values: any }) {
        console.log('errors', errors)
        console.log('values', values)
        if (!errors) {
          if (this.templateId) {
            console.log(1)
            api.updateTemplate(this.form).then((res) => {
              app.succ('保存成功')
              this.isShowCall()
            })
          } else {
            console.log(2)
            this.form.callModule = 'CallModule'
            this.form.callSetting = JSON.stringify(
              callDefaultSetting(this.form.callModule)
            )
            this.form.detailModule = 'DetailModule'
            this.form.detailSetting = JSON.stringify(
              detailDefaultSetting(this.form.detailModule)
            )
            api.addTemplate(this.form).then((res) => {
              this.form.id = res.data
              app.succ('新增成功')
              this.isShowCall()
              this.activeIndex = 'callPage'
            })
          }
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .close-btn {
    position: absolute;
    right: 0;
    z-index: 111;

    line-height: 40px;
    cursor: pointer;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    color: #d22e00;
  }

  .close-btn:hover {
    color: #fd3300;
  }

  :deep(.arco-form-item-label-col) {
    width: 100px;
  }

  :deep(.arco-tabs-content .arco-tabs-content-item) {
    overflow: visible !important;
  }
</style>

<style lang="less">
  .edit-page > .arco-tabs {
    & > .arco-tabs-nav {
      &::before {
        top: 39px;
        z-index: 2222;
      }
      & > .arco-tabs-nav-tab {
        position: fixed;
        width: 100%;
        top: 60px;
        z-index: 110;
        background: #f2f3f5;
        padding-top: 20px;
      }
    }

    & > .arco-tabs-content {
      padding-top: 56px;
    }
  }
</style>
