<template>
  <div class="call-module" style="position: relative">
    <simulator
      has-base-setting
      :style="{
        'background-image': setting.backgroundImage
          ? 'url(' + setting.backgroundImage + ')'
          : '',
      }"
    >
      <template #baseSetting>
        <div class="flex-line">
          <label>背景图：</label>
          <ImageUpload
            v-model="setting.backgroundImage"
            class="img-bg"
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
        <editable-component setting-title="标题设置" setting-top="0">
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
            setting-title="提示设置"
            setting-left="365px"
            style="margin-top: 40px"
          >
            <div
              class="tip-text"
              :style="{ color: setting.tip.color, fontSize: setting.tip.size }"
              >{{ setting.tip.text }}</div
            >
            <template #setting>
              <div class="flex-line">
                <label>提示名称：</label>
                <input v-model="setting.tip.text" class="input-text" />

                <label class="ml-4">提示字号：</label>
                <a-select
                  v-model="setting.tip.size"
                  class="ac-input"
                  :style="{ width: '160px' }"
                  placeholder="请选择提示字号"
                  :options="getOpts(16)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>提示颜色：</label>
                <el-color-picker
                  v-model="setting.tip.color"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="Logo设置"
            setting-left="365px"
            setting-top="0"
            style="margin-top: 40px"
          >
            <div class="flex-hvc logo-div">
              <img
                v-show="setting.logo.img"
                class="full"
                :src="setting.logo.img"
                alt="logo"
              />
            </div>

            <template #setting>
              <div class="flex-line">
                <span class="mr-1"> Logo:</span>
                <ImageUpload
                  v-model="setting.logo.img"
                  class="img-bg"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="标语设置"
            setting-left="365px"
            setting-top="0"
            style="margin-top: 40px"
          >
            <div
              class="slogan-text"
              :style="{
                color: setting.slogan.color,
                fontSize: setting.slogan.size,
              }"
              >{{ setting.slogan.text }}</div
            >

            <template #setting>
              <div class="flex-line">
                <label>标语名称：</label>
                <input v-model="setting.slogan.text" class="input-text" />

                <label class="ml-4">标语字号：</label>
                <a-select
                  v-model="setting.slogan.size"
                  class="ac-input"
                  :style="{ width: '160px' }"
                  placeholder="请选择标语字号"
                  :options="getOpts(33)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>标语颜色：</label>
                <el-color-picker
                  v-model="setting.slogan.color"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="按钮设置"
            setting-left="365px"
            setting-bottom="0px"
            style="margin-top: 40px"
          >
            <div
              class="btn-text m-auto t-c flex-hvc"
              :style="{
                color: setting.btn.color,
                background: setting.btn.bgc,
                fontSize: setting.btn.size,
              }"
            >
              <img
                :src="setting.btn.icon"
                style="width: 20px; height: 24px"
                alt=""
                class="mr-2"
              />
              {{ setting.btn.text }}
            </div>

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
                  :options="getOpts(14)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>按钮颜色：</label>
                <el-color-picker
                  v-model="setting.btn.color"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
              <div class="flex-line">
                <label>按钮背景颜色：</label>
                <el-color-picker
                  v-model="setting.btn.bgc"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
              <div class="flex-line">
                <label>按钮图标：</label>
                <ImageUpload
                  v-model="setting.btn.icon"
                  class="img-bg"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="更多设置"
            setting-left="365px"
            setting-bottom="0"
            style="margin-top: 40px"
          >
            <div
              class="more-text m-auto t-c flex-hvc"
              :style="{
                color: setting.more.color,
                fontSize: setting.more.size,
              }"
            >
              <img
                :src="setting.more.icon"
                style="width: 20px; height: 24px"
                alt=""
                class="mr-2"
              />
              {{ setting.more.text }}
            </div>

            <template #setting>
              <div class="flex-line">
                <label>按钮名称：</label>
                <input v-model="setting.more.text" class="input-text" />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.more.size"
                  class="ac-input"
                  :style="{ width: '160px' }"
                  placeholder="请选择按钮字号"
                  :options="getOpts(21)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>按钮颜色：</label>
                <el-color-picker
                  v-model="setting.more.color"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
              <div class="flex-line">
                <label>按钮图标：</label>
                <ImageUpload
                  v-model="setting.more.icon"
                  class="img-bg"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
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
    name: 'CallModule2',
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
  .img-bg {
    :deep(.arco-upload-list-picture) {
      background-color: aliceblue;
    }
  }

  .call-module {
    padding: 10px 0 50px;

    .container {
      padding: 0 20px;
    }

    .btn-img {
      height: 325px;
      width: 325px;
    }

    .tip-text {
      font-size: 16px;
      font-weight: 400;
      color: #494949;
    }
    .logo-div {
      width: 76.8%;
      min-height: 319px;
      margin: auto;
    }

    .slogan-text {
      font-size: 33px;
      font-weight: bold;
      color: #000000;
      text-align: center;
    }

    .btn-text {
      width: 210px;
      height: 48px;
      line-height: 48px;
      background: #ca0328;
      border-radius: 18px;
      color: #fff;
    }

    .more-text {
      font-size: 21px;
      font-weight: 400;
      color: #020202;
    }
  }
</style>
