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
      <div v-for="(val, key) of parameterSetting" :key="key" class="param-item">
        <div class="left">
          <a-checkbox v-model="val.status" value="1">
            {{ val.desc }}
            <img :src="bindIcon(val.img)" width="12" />
          </a-checkbox>
        </div>
        <div class="right">
          <template v-if="!val.options">
            {{ val.value }}
          </template>
          <template v-else>
            <a-radio-group v-model="val.value">
              <a-radio
                v-for="item in val.options"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </template>
        </div>
      </div>
      <div class="footer">
        <a-button type="outline" status="warning" @click="handleDelProduct">
          删除产品
        </a-button>
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
  import { Message, Modal } from '@arco-design/web-vue'
  import {
    updateProduct,
    getProduct,
    deleteProduct,
  } from '@/api/iot-device/index.ts'

  const router = useRouter()
  const route = useRoute()

  const { id, productId } = route.query

  // 定义绑定图片的方法
  const bindIcon = (icon) => {
    return new URL(
      `../../../../../assets/iot-device/${icon}.png`,
      import.meta.url
    ).href
  }

  // const deviceInfo = ref({})

  const parameterSetting = ref({
    workTime: {
      key: 'workTime',
      value: '时分秒',
      desc: '运行时间',
      status: false,
      img: 'runtime',
    },
    runpower: {
      key: 'runpower',
      value: '剩余百分比(%)',
      desc: '电池电量',
      status: false,
      img: 'runpower',
    },
    runarea: {
      key: 'runarea',
      value: 'm²',
      desc: '清洗面积',
      status: false,
      img: 'runarea',
    },
    runingClearWater: {
      key: 'runingClearWater',
      value: '1',
      desc: '清水箱剩余',
      options: [
        {
          label: '剩余百分比(%)',
          value: '1',
        },
        {
          label: '剩余水量(L)',
          value: '2',
        },
      ],
      status: false,
      img: 'runwater',
    },
    runingSewageWater: {
      key: 'runingSewageWater',
      value: '1',
      desc: '污水箱剩余',
      options: [
        {
          label: '剩余百分比(%)',
          value: '1',
        },
        {
          label: '剩余水量(L)',
          value: '2',
        },
      ],
      status: false,
      img: 'runwater',
    },
  })

  // 获取物联参数设置
  const resGetProduct = async () => {
    try {
      const { data } = await getProduct({
        id,
      })
      if (data.parameterSetting) {
        parameterSetting.value = JSON.parse(data.parameterSetting)
      }
      // deviceInfo.value = {
      // }
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
        parameterSetting: JSON.stringify(parameterSetting.value),
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

  // 删除事件
  const handleDelProduct = () => {
    Modal.confirm({
      title: '确认删除此产品',
      content: `确认删除此产品? `,
      onOk: async () => {
        try {
          await deleteProduct({
            id,
          })
          Message.success('删除成功')
          router.push({
            name: 'iotDevice_iotDeviceAdmin_productConfig',
          })
        } catch (error) {
          console.log(error)
        }
      },
      onCancel: () => {
        console.log('否认删除')
      },
    })
  }

  onMounted(() => {
    // resUpdateProduct()
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
    }

    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
    }
  }
</style>
