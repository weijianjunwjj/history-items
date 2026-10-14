<template>
  <div class="detail-module2" style="position: relative">
    <simulator class="">
      <template #head>
        <mini-app-bar>
          <div class="qrcode"> </div>
        </mini-app-bar>
      </template>

      <template #body>
        <div class="container full-w">
          <header class="header full-w pt-4">
            <div class="device-name">XXXX驾驶式洗地车T8</div>
            <div class="device-item mt-3-i">设备序列号：SN123456XX</div>

            <editable-component setting-title="按钮设置">
              <div
                class="device-btn mt-6-i m-auto flex-hvc point"
                :style="{ background: setting.btn.bgc }"
              >
                <img
                  style="width: 20px; height: 24px"
                  :src="setting.btn.icon"
                  alt=""
                />
                <span class="ml-2" :style="{ fontSize: setting.btn.size }">{{
                  setting.btn.text
                }}</span>
              </div>

              <template #setting>
                <div class="flex-line">
                  <label>按钮文字：</label>
                  <input v-model="setting.btn.text" class="input-text" />

                  <label class="ml-4">按钮字号：</label>
                  <a-select
                    v-model="setting.btn.size"
                    class="ac-input"
                    :style="{ width: '120px' }"
                    placeholder="请选择字号"
                    :options="getOpts(18)"
                  >
                  </a-select>
                </div>
                <div class="flex-line">
                  <label>按钮颜色：</label>
                  <el-color-picker v-model="setting.btn.bgc" size="mini" />
                </div>
              </template>
            </editable-component>

            <editable-component setting-title="更多设置">
              <div class="device-sub-info flex-c-sb mt-6-i m-auto">
                <div class="flex-c">
                  <img style="width: 16px" :src="setting.book.icon" alt="" />
                  <span class="ml-2" :style="{ fontSize: setting.book.size }">{{
                    setting.book.text
                  }}</span>
                </div>

                <div class="flex-c" style="margin-left: 60px">
                  <img style="width: 16px" :src="setting.history.icon" alt="" />
                  <span
                    class="ml-2"
                    :style="{
                      fontSize: setting.book.size,
                    }"
                    >{{ setting.history.text }}</span
                  >
                </div>
              </div>

              <template #setting>
                <div class="flex-line">
                  <label>更多文字1：</label>
                  <input v-model="setting.book.text" class="input-text" />
                </div>
                <div class="flex-line">
                  <label>更多文字2：</label>
                  <input v-model="setting.book.text" class="input-text" />
                </div>

                <div class="flex-line">
                  <label class="mr-2">更多字号：</label>
                  <a-select
                    v-model="setting.book.size"
                    class="ac-input"
                    :style="{ width: '120px' }"
                    placeholder="请选择字号"
                    :options="getOpts(14)"
                  >
                  </a-select>
                </div>
              </template>
            </editable-component>
          </header>

          <main class="main">
            <editable-component setting-title="功能区设置" setting-top="0">
              <template v-for="item of setting.cards">
                <div
                  v-if="item.enabled"
                  :key="item.id"
                  class="main-card m-auto mt-4-i"
                >
                  <div class="flex-c">
                    <img style="width: 26px" :src="item.icon1" alt="" />
                    <span
                      class="main-card-title bold"
                      :style="{ fontSize: setting.cardsSize.titleSize }"
                      >{{ item.text }}</span
                    >
                  </div>
                  <div class="flex just-sb mt-6">
                    <div class="flex-v" style="font-size: 17px; color: #2d2e2e">
                      <span :style="{ fontSize: setting.cardsSize.descSize }">{{
                        item.desc
                      }}</span>
                    </div>
                    <img
                      class="ml-9 mr-9"
                      :src="item.icon2"
                      style="width: 46px; margin-top: 13px"
                      alt=""
                    />
                  </div>
                </div>
              </template>

              <template #setting>
                <div class="flex-line">
                  <label>模块标题字号：</label>
                  <a-select
                    v-model="setting.cardsSize.titleSize"
                    class="ac-input"
                    :style="{ width: '120px' }"
                    placeholder="请选择字号"
                    :options="getOpts(26)"
                  >
                  </a-select>

                  <label class="ml-4">模块描述字号：</label>
                  <a-select
                    v-model="setting.cardsSize.descSize"
                    class="ac-input"
                    :style="{ width: '120px' }"
                    placeholder="请选择字号"
                    :options="getOpts(17)"
                  >
                  </a-select>
                </div>
                <template v-for="(item, index) in setting.cards" :key="item.id">
                  <div>
                    <div class="flex-line">
                      <label>{{ item.id }}：</label>
                      <input v-model="item.text" class="input-text" />
                      <a-button
                        html-type="button"
                        @click="up(setting.cards, index)"
                      >
                        <template #icon>
                          <icon-arrow-up />
                        </template>
                      </a-button>
                      <a-button
                        :key="item.id"
                        html-type="button"
                        class="ml-2"
                        @click="down(setting.cards, index)"
                      >
                        <template #icon>
                          <icon-arrow-down />
                        </template>
                      </a-button>
                    </div>
                    <div class="flex-line mt5">
                      <label>描述：</label>
                      <input v-model="item.desc" class="input-text" />
                      <a-checkbox
                        v-model="item.enabled"
                        label="启用"
                        size="mini"
                        >启用</a-checkbox
                      >
                    </div>
                  </div>
                </template>
              </template>
            </editable-component>

            <editable-component setting-title="信息区设置" setting-bottom>
              <a-tabs>
                <template v-for="(item, index) in setting.tabs">
                  <a-tab-pane
                    v-if="item.enabled"
                    :key="index"
                    :name="item.text"
                  >
                    <span :style="{ fontSize: setting.tabsSize }">
                      {{ item.text }}
                    </span>
                  </a-tab-pane>
                </template>
              </a-tabs>

              <template #setting>
                <div class="flex-line">
                  <label>标签字号：</label>
                  <a-select
                    v-model="setting.tabsSize"
                    class="ac-input"
                    :style="{ width: '120px' }"
                    placeholder="请选择字号"
                    :options="getOpts(16)"
                  >
                  </a-select>
                </div>
                <div v-for="(item, index) in setting.tabs" :key="item.id">
                  <div class="flex-line">
                    <label>{{ item.id }}：</label>
                    <input v-model="item.text" class="input-text" />
                    <a-button @click="up(setting.tabs, index)">
                      <template #icon>
                        <icon-arrow-up />
                      </template>
                    </a-button>
                    <a-button
                      :key="item.id"
                      class="ml-2"
                      @click="down(setting.tabs, index)"
                    >
                      <template #icon>
                        <icon-arrow-down />
                      </template>
                    </a-button>
                  </div>
                  <div class="flex-line mt5">
                    <a-checkbox v-model="item.enabled">启用</a-checkbox>
                  </div>
                </div>
              </template>
            </editable-component>
          </main>
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
  import cards from '../cards2.js'
  import { cardsSize, getOpts } from '../utils'

  export default {
    name: 'DetailModule',
    components: {
      Simulator,
      MiniAppBar,
      // ImageUpload,
      // eslint-disable-next-line vue/no-unused-components
      EditableComponent,
      // SelectModule,
      // SaveBar,
    },
    props: {
      setting: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        cardsSize,
        getOpts,
      }
    },
    created() {
      // 对比数据库和本地的数据并填充
      this.contrastData(cards, this.setting.cards)

      if (this.setting.cardsSize === undefined) {
        this.setting.cardsSize = cardsSize
      }
    },
    methods: {
      contrastData(local: any[], db: any[]) {
        console.log('local', local)
        console.log('db', db)
        const db_ids = db.map((item) => item.id)
        local.forEach((item, index) => {
          const { id: local_id, icon: local_icon } = item
          if (db_ids.excludes(local_id)) {
            db.push(item)
          }
        })
      },
      up(arr: any[], index: number) {
        if (index > 0) {
          // eslint-disable-next-line prefer-destructuring
          arr[index] = arr.splice(index - 1, 1, arr[index])[0]
        } else {
          // arr.push(arr.shift())
        }
      },
      down(arr: any[], index: number) {
        console.log('index', index)
        if (index !== arr.length - 1) {
          // eslint-disable-next-line prefer-destructuring
          arr[index] = arr.splice(index + 1, 1, arr[index])[0]
        } else {
          // arr.unshift(arr.splice(index, 1)[0])
        }
      },
    },
  }
</script>

<style lang="less">
  .img-bg {
    .arco-upload-list-picture {
      background-color: aliceblue;
    }
  }

  .detail-module2 {
    .phone-head,
    .signal-bar {
      background: rgba(0, 0, 0);
    }

    .header {
      height: 250px;
      background: #000;
      color: #fefdfd;
    }

    .phone-body {
      width: 100%;
    }

    .main {
      margin-top: -41px;
      padding-bottom: 40px;

      .main-card {
        width: 300px;
        height: 203px;
        background: #f6f5f5;
        border-radius: 18px;
        padding-top: 44px;
        padding-left: 45px;

        // padding: 44px 43px 38px 45px;
        > img {
          width: 26px;
        }

        &-title {
          font-size: 26px;
          color: #ca0328;
          margin-left: 15px;
        }
      }
    }
  }

  .qrcode {
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .device-img {
    width: 77px;
    height: 76px;
    display: block;
    margin: 0 auto 20px;
  }

  .device-name {
    font-size: 26px;
    text-align: center;
    font-weight: 400;
    color: #fefdfd;
  }

  .device-item {
    font-size: 12px;
    font-weight: 400;
    color: #a2a2a2;
    line-height: 17px;
    text-align: center;
    margin-top: 4px;
    font-size: 16px;
  }

  .device-btn {
    width: 224px;
    height: 48px;
    background: #ca0328;
    border-radius: 18px;
    font-size: 18px;
    font-weight: 400;
    color: #fefdfd;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 27px;

    .info-title {
      font-size: 14px;
      font-weight: 500;
      color: #a2a2a2;
      line-height: 18px;
    }

    .other {
      font-size: 13px;
      color: #026fff;
      display: flex;
      justify-items: center;
      align-items: center;

      img {
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
    }
  }

  .card {
    width: 345px;
    margin: 0 auto 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .entry-item {
    box-sizing: border-box;
    width: 165px;
    height: 108px;
    font-size: 13px;
    color: #4a4a4a;
    background: #ffffff;
    box-shadow: 0 8px 40px 0 rgba(102, 100, 93, 0.2);
    border-radius: 4px;
    padding-left: 17px;
    padding-top: 15px;
    margin-bottom: 15px;
  }

  .entry-item-icon {
    width: 27px;
    height: 27px;
    margin-bottom: 10px;
  }

  .entry-item-text {
    font-size: 16px;
    font-weight: bold;
    color: #4a4a4a;
    line-height: 15px;
    margin-bottom: 7px;
  }

  .entry-item-desc {
    font-size: 12px;
    font-weight: 400;
    color: #a2a2a2;
    line-height: 15px;
  }

  .mt5 {
    margin-top: 5px;
  }
</style>

<style lang="less" scoped>
  :deep(.arco-btn) {
    transition: none;
  }

  :deep(.arco-tabs-content-list) {
    text-align: center;
  }

  :deep(.editable-component
      .component-settings
      .setting-container
      .input-text) {
    width: 200px;
  }

  :deep(.arco-tabs-content-item-active) {
    font-size: 16px;
    font-weight: bold;
    color: #010101;
  }

  :deep(.arco-tabs-nav-horizonta) {
    visibility: hidden;
  }
</style>
