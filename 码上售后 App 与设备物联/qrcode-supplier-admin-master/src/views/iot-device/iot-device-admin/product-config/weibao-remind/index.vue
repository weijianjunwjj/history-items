<template>
  <div class="param-setting-box">
    <a-card>
      <div class="top">
        <div class="left">
          <a-image
            width="60"
            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
          />
        </div>
        <div class="right">
          <div class="title">坦龙驾驶式洗地机T7(锂电版)</div>
          <div class="model">LYX-17L</div>
        </div>
      </div>
      <div
        v-for="(val, key) of maintenanceSetting"
        :key="key"
        class="param-item"
      >
        <div class="left">
          <a-checkbox v-model="val.status"> {{ val.desc }} </a-checkbox>
        </div>
        <div class="right">
          <div class="first">
            <a-checkbox v-model="val.first.status">
              {{ val.first.desc }}:
            </a-checkbox>
            第<a-input-number
              v-model="val.first.value"
              style="width: 80px"
              placeholder="请输入"
            />小时
          </div>
          <div class="usual">
            <a-checkbox v-model="val.usual.status">
              {{ val.usual.desc }}:
            </a-checkbox>
            每<a-input-number
              v-model="val.usual.value"
              style="width: 80px"
              placeholder="请输入"
            />小时
          </div>
        </div>
      </div>
      <div class="footer">
        <a-space>
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleOk"> 保存 </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  import { getProduct, updateProduct } from '@/api/iot-device/index.ts'

  const router = useRouter()
  const route = useRoute()

  const { id, productId } = route.query

  const maintenanceSetting = ref({
    engine: {
      key: 'workTime',
      desc: '机油',
      status: false,
      first: {
        value: '',
        status: false,
        desc: '首保',
      },
      usual: {
        value: '',
        status: false,
        desc: '常规',
      },
    },
    brushPlate: {
      key: 'brushPlate',
      desc: '刷盘',
      status: false,
      first: {
        value: '',
        status: false,
        desc: '首保',
      },
      usual: {
        value: '',
        status: false,
        desc: '常规',
      },
    },
    rubberStrip: {
      key: 'brushPlate',
      desc: '胶条',
      status: false,
      first: {
        value: '',
        status: false,
        desc: '首保',
      },
      usual: {
        value: '',
        status: false,
        desc: '常规',
      },
    },
  })

  // 获取物联参数设置
  const resGetProduct = async () => {
    try {
      const { data } = await getProduct({
        id,
      })
      if (data.maintenanceSetting) {
        maintenanceSetting.value = JSON.parse(data.maintenanceSetting)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 保存物联产品参数设置
  const resUpdateProduct = async () => {
    try {
      await updateProduct({
        id,
        productId,
        maintenanceSetting: JSON.stringify(maintenanceSetting.value),
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 取消事件
  const handleCancel = () => {
    router.push({
      name: 'iotDevice_iotDeviceAdmin_productConfig',
    })
  }

  // 保存事件
  const handleOk = () => {
    resUpdateProduct()
    Message.success('保存成功')
    router.push({
      name: 'iotDevice_iotDeviceAdmin_productConfig',
    })
  }

  onMounted(() => {
    resGetProduct()
  })
</script>

<style lang="less" scoped>
  .param-setting-box {
    padding: 20px;

    .top {
      padding: 20px;
      border-bottom: 1px solid #eaeaea;
      display: flex;
      flex-direction: row;

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 10px;

        .title {
          font-weight: 600;
        }

        .model {
          color: #af5b5b;
        }
      }
    }

    .param-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #eaeaea;
      padding: 20px 0;

      .left {
        width: 200px;
        font-weight: 600;
        img {
          margin-left: 3px;
          vertical-align: middle;
        }
      }

      .right {
        :deep(.arco-checkbox-label) {
          font-weight: 600;
          margin-right: 20px;
        }

        .first {
          padding-bottom: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .arco-input-number {
            margin: 0 2px;
          }
        }

        .usual {
          padding-top: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .arco-input-number {
            margin: 0 2px;
          }
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      padding-top: 20px;
    }
  }
</style>
