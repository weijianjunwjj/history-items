<template>
  <div class="detail-module" style="position: relative">
    <simulator
      style="
        background: linear-gradient(
          209deg,
          #c8f0fe 0%,
          #fbfbfb 53%,
          #fbfbfb 100%
        );
      "
    >
      <template #head>
        <mini-app-bar>
          <div class="qrcode">
            <img class="qrcode-img" src="../assets/scan.png" />
          </div>
        </mini-app-bar>
      </template>

      <template #body>
        <div class="container">
          <img class="device-img" src="../assets/device.png" />

          <div class="device-name">XXXX驾驶式洗地车T8</div>
          <div class="device-item">设备序列号：SN123456XX</div>
          <div class="device-item">服务商：XXXX有限公司</div>

          <editable-component setting-title="按钮设置">
            <div
              class="call-btn"
              :style="{
                background: setting.btn.color,
                fontSize: setting.btn.size,
              }"
              >{{ setting.btn.text }}</div
            >

            <template #setting>
              <div class="flex-line">
                <label>按钮名称：</label>
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
                <el-color-picker v-model="setting.btn.color" size="mini" />
              </div>
            </template>
          </editable-component>

          <editable-component
            setting-title="功能区设置"
            setting-center
            setting-class="cards-class"
            setting-top="-100px"
          >
            <div class="info">
              <div
                class="info-title"
                :style="{ fontSize: setting.more.size }"
                >{{ setting.more.text }}</div
              >
              <div class="other" :style="{ fontSize: setting.history.size }">
                <img src="../assets/time.png" />
                {{ setting.history.text }}
              </div>
            </div>

            <div class="card">
              <template v-for="item in setting.cards">
                <div v-if="item.enabled" :key="item.url" class="entry-item">
                  <img class="entry-item-icon" :src="item.icon" />
                  <div
                    class="entry-item-text"
                    :style="{ fontSize: setting.cardsSize.titleSize }"
                    >{{ item.text }}</div
                  >
                  <div
                    class="entry-item-desc"
                    :style="{ fontSize: setting.cardsSize.descSize }"
                    >{{ item.desc }}</div
                  >
                </div>
              </template>
            </div>

            <template #setting>
              <div class="flex-line">
                <label>功能区标题：</label>
                <input v-model="setting.more.text" class="input-text" />

                <label class="ml-4" style="margin-left: 33px">标题字号：</label>
                <a-select
                  v-model="setting.more.size"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(14)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>扫码记录标题：</label>
                <input v-model="setting.history.text" class="input-text" />

                <label class="ml-4">标题字号：</label>
                <a-select
                  v-model="setting.history.size"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(13)"
                >
                </a-select>
              </div>
              <div class="flex-line">
                <label>模块标题字号：</label>
                <a-select
                  v-model="setting.cardsSize.titleSize"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(16)"
                >
                </a-select>

                <label class="ml-4">模块描述字号：</label>
                <a-select
                  v-model="setting.cardsSize.descSize"
                  class="ac-input"
                  :style="{ width: '120px' }"
                  placeholder="请选择字号"
                  :options="getOpts(12)"
                >
                </a-select>
              </div>
              <div v-for="(item, index) in setting.cards" :key="item.id">
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
                  <a-checkbox v-model="item.enabled" label="启用" size="mini"
                    >启用</a-checkbox
                  >
                </div>
                <div v-if="item.id == '报修记录'" class="flex-line mt5">
                  <label>添加工单按钮：</label>
                  <a-checkbox v-model="item.showAdd" label="启用" size="mini"
                    >启用</a-checkbox
                  >
                </div>
              </div>
            </template>
          </editable-component>

          <editable-component setting-title="信息区设置" setting-bottom>
            <a-tabs>
              <template v-for="item in setting.tabs">
                <a-tab-pane
                  v-if="item.enabled"
                  :key="item.id"
                  :label="item.text"
                  :name="item.text"
                >
                  <span :style="{ fontSize: setting.tabsSize }">{{
                    item.text
                  }}</span>
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
                  :options="getOpts(14)"
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
                  <!-- <a-button
                    size="mini"
                    icon="a-icon-top"
                    @click="up(setting.tabs, index)"
                  />
                  <a-button
                    size="mini"
                    icon="a-icon-bottom"
                    @click="down(setting.tabs, index)"
                  /> -->
                </div>
                <div class="flex-line mt5">
                  <a-checkbox v-model="item.enabled">启用</a-checkbox>
                </div>
              </div>
            </template>
          </editable-component>
        </div>
      </template>
    </simulator>
  </div>
</template>

<script lang="ts">
  import Simulator from '../components/Simulator.vue'
  import MiniAppBar from '../components/MiniAppBar.vue'
  import EditableComponent from '../components/EditableComponent.vue'
  import cards from '../cards.js'
  import { cardsSize, getOpts } from '../utils'

  export default {
    name: 'DetailModule',
    components: {
      Simulator,
      MiniAppBar,
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
    created() {
      // 对比数据库和本地的数据并填充
      this.contrastData(cards, this.setting.cards)

      if (this.setting.cards[5].icon === undefined) {
        this.setting.cards[5].icon = cards[5].icon
      }
      if (this.setting.cards[5].showAdd === undefined) {
        this.setting.cards[5].showAdd = cards[1].showAdd
      }
      if (this.setting.cardsSize === undefined) {
        this.setting.cardsSize = cardsSize
      }
    },
    methods: {
      getOpts,
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
  .cards-class {
    min-height: 640px;
    overflow: auto;
  }
  .qrcode {
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .qrcode-img {
      width: 20px;
      height: 20px;
    }
  }

  .device-img {
    width: 77px;
    height: 76px;
    display: block;
    margin: 0 auto 20px;
  }

  .device-name {
    font-size: 16px;
    font-weight: bold;
    color: #4a4a4a;
    line-height: 22px;
    text-align: center;
  }

  .device-item {
    font-size: 12px;
    font-weight: 400;
    color: #a2a2a2;
    line-height: 17px;
    text-align: center;
    margin-top: 4px;
  }

  .call-btn {
    width: 235px;
    height: 50px;
    background: #2049ee;
    border-radius: 4px;
    margin: 16px auto;

    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    line-height: 50px;
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
</style>
