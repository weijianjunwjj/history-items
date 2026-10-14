<template>
  <div class="call-module" style="position: relative">
    <simulator
      :style="{
        'background-image': setting.backgroundImage
          ? 'url(' + setting.backgroundImage + ')'
          : '',
      }"
      has-base-setting
    >
      <template #baseSetting>
        <div class="flex-line">
          <label>背景图：</label>
          <ImageUpload
            v-model="setting.backgroundImage"
            :limit="1"
            :show-tip="false"
            folder="template"
          />
        </div>
        <div class="tips-line"
          ><i class="a-icon-info mr10"></i>建议图片比例 414*736</div
        >
      </template>

      <template #head>
        <editable-component setting-title="标题设置">
          <mini-app-bar
            :title="setting.header.title"
            :color="setting.header.color"
          />
          <template #setting>
            <div class="flex-line">
              <label>标题名称：</label>
              <input v-model="setting.header.title" class="input-text" />
            </div>
            <div class="flex-line">
              <label>标题颜色：</label>
              <el-color-picker
                v-model="setting.header.color"
                size="mini"
                style="top: 36px; left: -83px"
              />
            </div>
          </template>
        </editable-component>
      </template>

      <template #body>
        <div class="container">
          <editable-component
            setting-title="按钮设置"
            setting-left="365px"
            setting-top="0"
            style="margin-top: -170px"
          >
            <img class="btn-img" :src="setting.btn.img" />
            <div class="btn-text" :style="{ fontSize: setting.btn.size }">{{
              setting.btn.text
            }}</div>
            <img
              v-show="setting.btn.logo"
              class="logo"
              :src="setting.btn.logo"
            />
            <template #setting>
              <div class="flex-line">
                <label>按钮名称：</label>
                <input v-model="setting.btn.text" class="input-text" />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.btn.size"
                  class="ac-input"
                  :style="{ width: '160px' }"
                  placeholder="请选择按钮字号"
                  :options="getOpts(30)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>Logo图标：</label>
                <ImageUpload
                  v-model="setting.btn.logo"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
              </div>
              <div class="flex-line">
                <label>按钮图片：</label>
                <ImageUpload
                  v-model="setting.btn.img"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            class="more"
            setting-title="跳转设置"
            setting-bottom
          >
            <span :style="{ fontSize: setting.more.size }">{{
              setting.more.text
            }}</span>
            <template #setting>
              <div class="flex-line">
                <label>链接名称：</label>
                <input v-model="setting.more.text" class="input-text" />

                <label class="ml-4">链接字号：</label>
                <a-select
                  v-model="setting.more.size"
                  class="ac-input"
                  :style="{ width: '160px' }"
                  placeholder="请选择链接字号"
                  :options="getOpts(16)"
                />
              </div>
              <div class="flex-line">
                <label>链接颜色：</label>
                <el-color-picker v-model="setting.more.color" size="mini" />
              </div>
            </template>
          </editable-component>
        </div>
      </template>
    </simulator>
  </div>
</template>

<script>
  import ImageUpload from '@hx/packages/components/ImageUpload/index.vue'
  import SelectModule from '@/views/code-service/qrcode-admin/template/components/SelectModule.vue'
  import SaveBar from '@/views/code-service/qrcode-admin/template/components/SaveBar.vue'
  import Simulator from '../components/Simulator.vue'
  import MiniAppBar from '../components/MiniAppBar.vue'
  import EditableComponent from '../components/EditableComponent.vue'
  import { getOpts } from '../utils'

  export default {
    name: 'CallModule',
    components: {
      Simulator,
      MiniAppBar,
      EditableComponent,
      ImageUpload,
    },
    props: {
      setting: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        getOpts,
      }
    },
  }
</script>

<style lang="less" scoped>
  .call-module {
    padding: 10px 0 50px;

    .container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-img {
      height: 325px;
      width: 325px;
    }

    .btn-text {
      font-size: 30px;
      font-weight: bold;
      line-height: 1;
      background: linear-gradient(to bottom, #ffffff, #efccf0);
      -webkit-background-clip: text;
      color: transparent;
      position: absolute;
      bottom: 50px;
      width: 100%;
      text-align: center;
    }

    .logo {
      position: absolute;
      width: 32px;
      height: 32px;
      top: 44px;
      left: 55px;
    }

    .more {
      width: 100%;
      height: 40px;
      overflow-wrap: break-word;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      line-height: 40px;
      bottom: 50px;
      position: absolute;
    }
  }
</style>
