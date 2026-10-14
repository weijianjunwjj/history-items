<template>
  <div class="call-module">
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
            :size="setting.header.size"
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
            setting-title="引导设置"
            setting-top="0"
            class="top1"
          >
            <div class="intro-top">
              <span
                :style="{
                  color: setting.intro1.color,
                  fontSize: setting.intro1.size,
                }"
                >{{ setting.intro1.text }}</span
              >
              <img src="../assets/intro-top.png" alt="" />
            </div>
            <template #setting>
              <div class="flex-line">
                <label>引导名称：</label>
                <input
                  v-model="setting.intro1.text"
                  class="input-text"
                  style="width: 200px"
                />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.intro1.size"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(18)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>引导颜色：</label>
                <el-color-picker
                  v-model="setting.intro1.color"
                  size="mini"
                  style="top: 36px; left: -83px"
                />
              </div>
            </template>
          </editable-component>
          <editable-component
            setting-title="按钮设置"
            setting-left="365px"
            style="margin-top: -70px"
            setting-top="0"
          >
            <div
              class="outer-block"
              :style="{ 'background-color': setting.btn.outerColor }"
            >
              <div
                class="circle"
                :style="{
                  'box-shadow': setting.btn.circleColor
                    ? 'inset 10px 10px 25px 0' + setting.btn.circleColor
                    : '',
                }"
              ></div>
              <div
                class="inner-block"
                :style="{
                  'box-shadow': setting.btn.innerColor
                    ? 'inset 10px 10px 25px 0 ' + setting.btn.innerColor + '7F'
                    : '',
                }"
              >
                <img class="btn-img" :src="setting.btn.icon" />
                <div
                  class="txt1"
                  :style="{
                    color: setting.btn.color,
                    fontSize: setting.btn.size1,
                  }"
                  >{{ setting.btn.text }}</div
                >
                <div
                  class="txt2"
                  :style="{
                    color: setting.btn.color,
                    fontSize: setting.btn.size2,
                  }"
                  >{{ setting.btn.desc }}</div
                >
              </div>
            </div>
            <template #setting>
              <div class="flex-line">
                <label>按钮名称：</label>
                <input v-model="setting.btn.text" class="input-text" />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.btn.size1"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(24)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>按钮描述：</label>
                <input v-model="setting.btn.desc" class="input-text" />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.btn.size2"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(14)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>文字颜色：</label>
                <el-color-picker v-model="setting.btn.color" size="mini" />
              </div>
              <div class="flex-line">
                <label>外部阴影：</label>
                <el-color-picker v-model="setting.btn.outerColor" size="mini" />
                <label>内部阴影：</label>
                <el-color-picker v-model="setting.btn.innerColor" size="mini" />
                <label>光环颜色：</label>
                <el-color-picker
                  v-model="setting.btn.circleColor"
                  size="mini"
                />
              </div>
              <div class="flex-line">
                <label>按钮图标：</label>
                <ImageUpload
                  v-model="setting.btn.icon"
                  :limit="1"
                  :show-tip="false"
                  folder="template"
                />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="引导设置"
            setting-bottom="0"
            class="bottom1"
          >
            <div class="intro-bottom">
              <span
                :style="{
                  color: setting.intro2.color,
                  fontSize: setting.intro2.size,
                }"
                >{{ setting.intro2.text }}</span
              >
              <img src="../assets/intro-bottom.png" alt="" />
            </div>
            <template #setting>
              <div class="flex-line">
                <label>引导名称：</label>
                <input
                  v-model="setting.intro2.text"
                  class="input-text"
                  style="width: 200px"
                />

                <label class="ml-4">按钮字号：</label>
                <a-select
                  v-model="setting.intro2.size"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(18)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>引导颜色：</label>
                <el-color-picker v-model="setting.intro2.color" size="mini" />
              </div>
            </template>
          </editable-component>

          <editable-component
            class="more"
            setting-title="跳转设置"
            setting-bottom
          >
            <span
              :style="{
                color: setting.more.color,
                fontSize: setting.more.size,
              }"
              >{{ setting.more.text }}</span
            >
            <template #setting>
              <div class="flex-line">
                <label>链接名称：</label>
                <input v-model="setting.more.text" class="input-text" />

                <label class="ml-4">链接字号：</label>
                <a-select
                  v-model="setting.more.size"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择链接字号"
                  :options="getOpts(14)"
                >
                </a-select>
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

<script lang="ts">
  import ImageUpload from '@hx/packages/components/ImageUpload/index.vue'
  import Simulator from '../components/Simulator.vue'
  import MiniAppBar from '../components/MiniAppBar.vue'
  import EditableComponent from '../components/EditableComponent.vue'
  import { getOpts, intro } from '../utils'

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
    watch: {
      'setting.intro1': {
        immediate: true,
        deep: true,
        handler(newValue) {
          if (newValue === undefined) {
            console.log('intro.intro1', intro.intro1)
            this.setting.intro1 = JSON.parse(JSON.stringify(intro.intro1))
          }
        },
      },
      'setting.intro2': {
        immediate: true,
        deep: true,
        handler(newValue) {
          if (newValue === undefined) {
            this.setting.intro2 = JSON.parse(JSON.stringify(intro.intro2))
          }
        },
      },
    },
    created() {
      // if (this.setting.intro1 === undefined) {
      //   this.setting.intro1 = intro.intro1
      // }
      // if (this.setting.intro2 === undefined) {
      //   this.setting.intro2 = intro.intro2
      // }
    },
  }
</script>

<style lang="less">
  .call-module {
    .top1 .component-settings {
      left: 371px !important;
    }
    .bottom1 {
      .component-settings {
        left: 356px !important;
      }
    }
  }
</style>

<style lang="less" scoped>
  .call-module {
    padding: 10px 0 50px;
    position: relative;

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .top1 {
        position: absolute;
        width: 80%;
        min-height: 110px;
        z-index: 2;
        bottom: 74%;
        left: 25px;
        word-break: break-all;
      }
      .intro-top {
        display: flex;
        flex-direction: column;

        & > span {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        & > img {
          width: 39px;
          margin-left: 20px;
        }
      }

      .bottom1 {
        position: absolute;
        left: 34px;
        bottom: 57px;
        width: 200px;
        min-height: 86px;
        z-index: 2;
        word-break: break-all;
      }
      .intro-bottom {
        display: flex;
        flex-direction: column;

        & > span {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        & > img {
          width: 57px;
          margin-left: 49px;
        }
      }
    }

    .outer-block {
      background-color: #0ec3ff;
      border: 2px solid #23282b;
      border-radius: 100%;
      height: 325px;
      width: 325px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .circle {
      position: absolute;
      height: 318px;
      width: 318px;
      box-shadow: inset 10px 10px 25px 0 rgba(17, 109, 170, 1);
      background-color: transparent;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      padding: 0;
      z-index: 1;
      pointer-events: none;
      animation: spin 2s linear infinite;
    }

    .inner-block {
      box-shadow: inset 10px 10px 25px 0 rgba(17, 109, 170, 0.5);
      background-color: #23282b;
      border-radius: 100%;
      height: 318px;
      width: 318px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .btn-img {
      width: 170px;
      height: 120px;
      margin-top: -20px;
    }

    .txt1 {
      color: #fff;
      width: 200px;
      font-size: 24px;
      line-height: 37px;
      text-align: center;
      overflow-wrap: break-word;
      white-space: nowrap;
      margin-top: -35px;
    }

    .txt2 {
      color: #fff;
      width: 200px;
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      overflow-wrap: break-word;
      white-space: nowrap;
    }

    .more {
      width: 100%;
      height: 40px;
      overflow-wrap: break-word;
      color: #01a7f3ff;
      font-size: 14px;
      text-align: center;
      white-space: nowrap;
      line-height: 40px;
      bottom: 50px;
      position: absolute;
    }
  }
</style>
