<template>
  <div class="device-admin-box">
    <m-form
      v-bind="searchFormConfig"
      v-model="searchParams"
      @change-value="handleSearchChangeValue"
    >
      <template #right>
        <MButton v-bind="searchBtnConfig"></MButton>
      </template>
    </m-form>
    <div class="add-iot-device">
      <a-button type="primary" @click="handleAddIotDevice">
        <template #icon>
          <icon-plus />
        </template>
        <template #default>添加物联产品</template>
      </a-button>
    </div>
    <a-spin :loading="loading">
      <a-row class="device-box" :gutter="20">
        <template v-if="productList.length">
          <a-col
            v-for="item in productList"
            :key="item.id"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="8"
            :xxl="6"
          >
            <div class="device-item">
              <div class="device-top">
                <div class="left">
                  <div class="title">{{ item.productName }}</div>
                  <div class="model">{{ item.model }}</div>
                </div>
                <div class="right">
                  <a-image
                    width="60"
                    :src="item.productImage"
                    :preview="false"
                  />
                </div>
              </div>
              <div class="device-data">
                <template
                  v-for="(val, key) of item.parameterSetting"
                  :key="key"
                >
                  <div v-if="val.status" class="device-data-item">
                    <img :src="bindIcon(val.img)" width="12" />
                    <span v-if="!val.options">{{ val.value }}</span>
                    <span v-else>
                      <template v-for="oItem in val.options">
                        <template v-if="oItem.value === val.value">
                          {{ oItem.label }}
                        </template>
                      </template>
                    </span>
                  </div>
                </template>
              </div>
              <div class="bottom">
                <div
                  class="bottom-item"
                  @click="
                    router.push({
                      name: 'iotDevice_iotDeviceAdmin_paramSetting',
                      query: {
                        id: item.id,
                        productId: item.productId,
                      },
                    })
                  "
                >
                  <icon-font
                    type="icon-canshu"
                    :style="{
                      color: '#5a5a5a',
                    }"
                  />
                  <span>参数设置</span>
                </div>
                <div
                  class="bottom-item"
                  @click="
                    router.push({
                      name: 'iotDevice_iotDeviceAdmin_weibaoRemind',
                      query: {
                        id: item.id,
                        productId: item.productId,
                      },
                    })
                  "
                >
                  <icon-font type="icon-maintenance" />
                  <span>维保设置</span>
                </div>
                <div
                  class="bottom-item"
                  @click="
                    router.push({
                      name: 'iotDevice_iotDeviceAdmin_deviceAdmin',
                      query: {
                        keyWord: item.productName,
                      },
                    })
                  "
                >
                  <icon-link />
                  <span>关联设备</span>
                </div>
              </div>
            </div>
          </a-col>
        </template>
        <a-empty v-else />
      </a-row>
    </a-spin>
    <a-pagination
      class="pagination"
      :total="total"
      :current="pageNum"
      :page-size="pageSize"
      show-total
      show-jumper
      show-page-size
      :page-size-options="[12, 24, 36, 48]"
      @change="handleChangePageNum"
      @page-size-change="handleChangePageSize"
    />
    <a-modal
      v-model:visible="addIotDeviceVisible"
      unmount-on-close
      :on-before-ok="handleAddIotDeviceOk"
      @before-close="handleAddIotDeviceCancel"
    >
      <template #title> 添加物联产品 </template>
      <m-form
        ref="addIotDeviceRefs"
        v-bind="addIotDeviceConfig"
        v-model="addIotDeviceValue"
        @change-value="handleAddChangeValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import { useRouter } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  import {
    getproductList,
    unCreateIotList,
    addProduct,
  } from '@/api/iot-device/index.ts'
  import _ from 'lodash'

  const router = useRouter()

  // 定义绑定图片的方法
  const bindIcon = (icon) => {
    return new URL(
      `../../../../../assets/iot-device/${icon}.png`,
      import.meta.url
    ).href
  }

  // 定义分页数据
  const pageNum = ref(1)
  const pageSize = ref(12)
  const total = ref(0)
  // 定义loading
  const loading = ref(false)

  // 分页页码改变事件
  const handleChangePageNum = (current) => {
    pageNum.value = current
    resGetProductList()
  }

  // 分页条数改变事件
  const handleChangePageSize = (value) => {
    pageSize.value = value
    resGetProductList()
  }

  // 产品列表
  const productList = ref([])

  // 获取物联设备数据
  const resGetProductList = async () => {
    loading.value = true
    try {
      const { data } = await getproductList(
        _.pickBy({
          ...searchParams.value,
          pageNum: pageNum.value,
          pageSize: pageSize.value,
        })
      )
      data.items.forEach((item) => {
        if (item.parameterSetting) {
          item.parameterSetting = JSON.parse(item.parameterSetting)
        }
      })
      productList.value = data.items
      total.value = data.total
      loading.value = false
    } catch (error) {
      console.log(error)
    }
  }

  // 定义搜索表单数据
  const searchParams = ref({
    productName: '',
    model: '',
  })

  // 定义搜索区域表单
  const searchFormConfig: IForm = reactive({
    formItems: [
      {
        field: 'productName',
        type: 'input',
        label: '产品名称',
        placeholder: '请输入产品名称',
      },
      {
        field: 'model',
        type: 'input',
        label: '产品型号',
        placeholder: '请输入产品型号',
      },
    ],
    labelAlign: 'left',
    inputWidth: { span: 16 },
    labelWidth: { span: 6 },
  })

  // 更新搜索表单
  const handleSearchChangeValue = (value: any) => {
    searchParams.value = value
  }

  // 定义搜索区域按钮
  const searchBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'search',
        icon: true,
        clickFunc: () => {
          resGetProductList()
        },
      },
      {
        name: 'reset',
        icon: true,
        clickFunc: () => {
          searchParams.value = {
            productName: '',
            model: '',
          }
        },
      },
    ],
  })

  // 定义添加物联产品弹框visible
  const addIotDeviceVisible = ref(false)

  // 添加物联产品按钮点击事件
  const handleAddIotDevice = () => {
    addIotDeviceVisible.value = true
    // resGetProductModelList()
  }

  // 定义添加物联产品弹框refs对象
  const addIotDeviceRefs = ref()

  // 定义产品列表
  const unCreateIot = ref([])

  // 获取产品列表
  const resUnCreateIotList = async () => {
    try {
      unCreateIot.value = []
      const { data } = await unCreateIotList()
      data.list.forEach((item) => {
        unCreateIot.value.push({
          value: item.id,
          label: `${item.model} | ${item.name}`,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  // 定义添加物联产品弹框表单
  const addIotDeviceConfig: IForm = reactive({
    formItems: [
      {
        field: 'productId',
        type: 'select',
        label: '选择产品',
        search: true,
        options: unCreateIot,
        placeholder: '请选择产品',
        rules: [
          {
            required: true,
            message: '请选择产品',
          },
        ],
        trigger: ['change', 'input'],
      },
    ],
    labelAlign: 'right',
    inputWidth: { span: 18 },
    labelWidth: { span: 6 },
    colLayout: { md: 24 },
  })

  // 添加物联产品弹框表单数据
  const addIotDeviceValue = ref({
    productId: '',
  })

  // 更新添加物联产品弹框表单数据
  const handleAddChangeValue = (value) => {
    addIotDeviceValue.value = value
  }

  // 添加物联产品弹框确定按钮点击事件
  const handleAddIotDeviceOk = async (done: (closed: boolean) => void) => {
    const value = await addIotDeviceRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        done(true)
        try {
          await addProduct({
            productId: addIotDeviceValue.value.productId,
          })
          handleAddIotDeviceCancel()
          pageInit()
          Message.success('添加成功')
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 添加物联设备弹框关闭事件
  const handleAddIotDeviceCancel = () => {
    addIotDeviceVisible.value = false
    addIotDeviceValue.value = {
      roductId: '',
    }
  }

  const pageInit = () => {
    Promise.all([resGetProductList(), resUnCreateIotList()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageInit()
  })
</script>

<style lang="less" scoped>
  :deep(.work-order-search-box) {
    .arco-card-body {
      padding: 0;
    }
  }

  .device-admin-box {
    margin: 20px;
    min-height: calc(100vh - 102px);

    :deep(.arco-card-body) {
      padding: 20px !important;
    }

    .add-iot-device {
      margin-top: 20px;
    }

    .device-box {
      background: #f0f2f5;

      .device-item {
        margin-top: 20px;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
        box-sizing: border-box;

        .device-top {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          margin: 20px 20px 0;

          .left {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: flex-start;
            .title {
              margin-bottom: 10px;
              font-size: 16px;
              font-weight: 600;
            }

            .model {
              color: #646464;
              text-align: left;
            }
          }
        }

        .status {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          margin: 0 20px;

          .left {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .normal {
              color: #4b7902;
            }

            .offline {
              color: #7f7f7f;
            }

            .running {
              color: #1890ff;
            }

            span {
              margin-left: 5px;
            }
          }

          .right {
            .right-span {
              span {
                margin-left: 10px;
              }

              .fault {
                color: #e0001b;
              }

              .maintenance {
                color: #f59a23;
              }
            }
          }
        }

        .device-data {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          height: 80px;
          margin: 0 20px;

          .device-data-item {
            width: 33%;
            display: flex;
            align-items: center;

            span {
              margin-left: 5px;
              font-size: 12px;
              color: #ababb4;
              width: 80%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .device-address {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 5px 20px 0;

          span {
            margin-left: 5px;
            color: #909796;
          }
        }

        .bottom {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 50px;
          border-top: 1px solid #eaeaea;
          align-items: center;
          margin-top: 15px;
          .bottom-item {
            text-align: center;
            width: 33%;
            border-right: 1px solid #e6e6e6;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #5a5a5a;
            cursor: pointer;

            span {
              margin-left: 5px;
            }

            &:nth-of-type(3) {
              border: none;
            }
          }

          // .bottom-item {
          //   text-align: center;
          //   width: 20%;
          //   border-right: 1px solid #e6e6e6;
          //   height: 30px;
          //   line-height: 30px;

          //   &:nth-of-type(5) {
          //     border: none;
          //   }
          // }
        }
      }
    }
  }

  .fault-content {
    box-shadow: 0px 0px 2px #ccc;
    padding: 5px 10px;

    .warning {
      width: 10px;
      height: 10px;
      background: #fe4d34;
      display: inline-block;
      margin-right: 10px;
    }
  }

  .edit-modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .pagination {
    background: #fff;
    width: 100%;
    text-align: right;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 5px;
  }

  .arco-empty {
    margin: 20px 10px 0;
    background-color: #fff;
  }

  .arco-spin {
    width: 100%;
  }
</style>
