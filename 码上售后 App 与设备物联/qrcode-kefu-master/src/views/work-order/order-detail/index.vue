<template>
  <div class="order-detail">
    <a-card
      hoverable
      class="order-detail-box"
      :bordered="false"
      title="报修详情"
    >
      <template v-if="deviceInfo.length == 0">
        <a-spin />
      </template>
      <a-descriptions :data="deviceInfo" :column="1">
        <a-descriptions-item
          v-for="item in deviceInfo"
          :key="item.label"
          :label="item.label"
        >
          <span v-if="item.label === '设备图片 :'">
            <a-image v-if="item.value" width="100" :src="item.value" />
            <template v-else>暂无</template>
          </span>
          <span v-else-if="item.label === '现场图片 :'">
            <a-space v-if="item.value" :size="size">
              <a-image
                v-for="i in item.value.split(',')"
                :key="i"
                width="160"
                :src="i"
              />
            </a-space>
            <template v-else>暂无</template>
          </span>
          <span v-else-if="item.label === '现场视频 :'">
            <!-- <div v-for="i in item.value.split(',')" :key="i">{{ i }}</div> -->
            <a-space v-if="item.value" :size="size">
              <video
                v-for="i in item.value.split(',')"
                :key="i"
                width="320"
                height="240"
                controls
              >
                <source :src="i" type="video/mp4" />
              </video>
            </a-space>
            <template v-else>暂无</template>
          </span>
          <span v-else>{{ item.value }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card
      hoverable
      class="order-detail-box"
      :bordered="false"
      title="报修处理"
      style="margin-top: 20px"
    >
      <div>
        <div style="width: 50%">
          <a-steps :current="ticketHandleDetail.ticketState">
            <a-step>用户报修</a-step>
            <a-step>安排维修</a-step>
            <a-step>维修完成</a-step>
          </a-steps>
        </div>
        <!-- 用户报修 -->
        <div v-if="ticketHandleDetail.ticketState === 1" class="repair-proces">
          <a-form
            ref="formRef"
            :model="arrangeForm"
            :size="arrangeForm.size"
            :style="{ width: '600px' }"
            layout="vertical"
            @submit="handleDispatchOrder"
          >
            <a-form-item
              field="engineer"
              label="工程师"
              :validate-trigger="['change', 'input', 'blur']"
              :rules="[{ required: true, message: '请选择工程师' }]"
            >
              <a-select
                v-model="arrangeForm.engineer"
                :options="engineerList"
                allow-clear
                placeholder="请选择工程师"
              />
            </a-form-item>
            <a-form-item
              field="phone"
              label="工程师电话"
              :validate-trigger="['change', 'input', 'blur']"
              :rules="[
                { required: true, message: '请输入手机号' },
                {
                  match:
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                  message: '请填写正确的手机号',
                },
              ]"
            >
              <a-input
                v-model="arrangeForm.phone"
                readonly
                placeholder="请输入工程师联系方式"
              />
            </a-form-item>
            <a-form-item field="remarks" label="备注">
              <a-textarea
                v-model="arrangeForm.remarks"
                placeholder="请输入备注"
                allow-clear
              />
              <template #extra>
                <div>可填写需要告知用户的信息</div>
              </template>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit">提交</a-button>
                <a-button @click="router.go(-1)">取消</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
        <!-- 安排维修 -->
        <div v-if="ticketHandleDetail.ticketState === 2" class="repair-proces">
          <a-form
            ref="formRef"
            :model="resultForm"
            :size="resultForm.size"
            :style="{ width: '600px' }"
            layout="vertical"
            @submit="handleCloseOrder"
          >
            <a-form-item
              field="ticketResultState"
              label="是否处理"
              :validate-trigger="['change', 'input', 'blur']"
              :rules="[{ required: true, message: '请选择处理结果' }]"
            >
              <a-select
                v-model="resultForm.ticketResultState"
                :options="resultList"
                allow-clear
                placeholder="请选择处理结果"
              />
            </a-form-item>
            <a-form-item field="ticketResultContent" label="备注信息">
              <a-input
                v-model="resultForm.ticketResultContent"
                allow-clear
                placeholder="请输入备注信息"
              />
            </a-form-item>
            <a-form-item field="remakes" label="上传图片">
              <a-upload
                list-type="picture-card"
                image-preview
                :show-cancel-button="false"
                :custom-request="customRequestImg"
                :file-list="resultForm.ticketResultImages"
                :disabled="imgDisabled"
                @before-upload="beforeImageUpload"
                @before-remove="beforeRemoveImg"
              />
            </a-form-item>
            <a-form-item field="remakes" label="上传视频">
              <a-upload
                :accept="'video/mp4'"
                :custom-request="customRequestVideo"
                :show-cancel-button="false"
                :file-list="resultForm.ticketResultVideo"
                :disabled="imgDisabled"
                @before-upload="beforeVideoUpload"
                @before-remove="beforeRemoveVideo"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button
                  :disabled="imgDisabled"
                  type="primary"
                  html-type="submit"
                  >提交</a-button
                >
                <a-button @click="router.go(-1)">取消</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
        <!-- 工单完成 -->
        <div v-if="ticketHandleDetail.ticketState === 3" class="repair-proces">
          <div
            class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium"
          >
            <div class="arco-descriptions-body">
              <table class="arco-descriptions-table">
                <tbody>
                  <tr class="arco-descriptions-row">
                    <td
                      class="arco-descriptions-item-label arco-descriptions-item-label-block"
                      style="text-align: left"
                    >
                      负责工程师 :
                    </td>
                    <td
                      class="arco-descriptions-item-value arco-descriptions-item-value-block"
                      colspan="1"
                      style="text-align: left"
                    >
                      <span>{{ ticketHandleDetail.engineerName }}</span>
                    </td>
                  </tr>
                  <tr class="arco-descriptions-row">
                    <td
                      class="arco-descriptions-item-label arco-descriptions-item-label-block"
                      style="text-align: left"
                    >
                      备注 :
                    </td>
                    <td
                      class="arco-descriptions-item-value arco-descriptions-item-value-block"
                      colspan="1"
                      style="text-align: left"
                    >
                      <span>{{ ticketHandleDetail.ticketResultContent }}</span>
                    </td>
                  </tr>
                  <tr class="arco-descriptions-row">
                    <td
                      class="arco-descriptions-item-label arco-descriptions-item-label-block"
                      style="text-align: left"
                    >
                      处理结果图片 :
                    </td>
                    <td
                      class="arco-descriptions-item-value arco-descriptions-item-value-block"
                      colspan="1"
                      style="text-align: left"
                    >
                      <a-space
                        v-if="ticketHandleDetail.ticketResultImages"
                        :size="size"
                      >
                        <a-image
                          v-for="i in ticketHandleDetail.ticketResultImages.split(
                            ','
                          )"
                          :key="i"
                          width="160"
                          :src="i"
                        />
                      </a-space>
                      <template v-else>暂无</template>
                    </td>
                  </tr>

                  <tr class="arco-descriptions-row">
                    <td
                      class="arco-descriptions-item-label arco-descriptions-item-label-block"
                      style="text-align: left"
                    >
                      处理结果视频 :
                    </td>
                    <td
                      class="arco-descriptions-item-value arco-descriptions-item-value-block"
                      colspan="1"
                      style="text-align: left"
                    >
                      <a-space
                        v-if="ticketHandleDetail.ticketResultVideo"
                        :size="size"
                      >
                        <video
                          v-for="i in ticketHandleDetail.ticketResultVideo.split(
                            ','
                          )"
                          :key="i"
                          width="320"
                          height="240"
                          controls
                        >
                          <source :src="i" type="video/mp4" />
                        </video>
                      </a-space>
                      <template v-else>暂无</template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-card
      hoverable
      class="order-detail-box"
      :bordered="false"
      title="过程记录"
      style="margin-top: 20px"
    >
      <div class="frame-aside">
        <a-timeline>
          <a-timeline-item v-if="ticketHandleDetail.ticketState >= 3">
            <a-space direction="vertical" fill>
              <div>
                维修完成
                <span
                  class="arco-timeline-item-label"
                  style="margin-right: 10px"
                >
                  {{ ticketHandleDetail.closeTime }}
                </span>
                <a-tag :color="'#165dff'">
                  {{
                    ticketHandleDetail.ticketResultState === 0
                      ? '未解决'
                      : '已处理'
                  }}
                </a-tag>
              </div>
              <div style="color: gray">
                <a-space direction="vertical" fill>
                  <div
                    class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium"
                  >
                    <div class="arco-descriptions-body">
                      <table class="arco-descriptions-table">
                        <tbody>
                          <tr class="arco-descriptions-row">
                            <td
                              class="arco-descriptions-item-label arco-descriptions-item-label-block"
                              style="text-align: left"
                            >
                              处理结果 :
                            </td>
                            <td
                              class="arco-descriptions-item-value arco-descriptions-item-value-block"
                              colspan="1"
                              style="text-align: left"
                            >
                              <span>
                                {{
                                  ticketHandleDetail.ticketResultState === 0
                                    ? '未解决'
                                    : '已处理'
                                }}
                              </span>
                            </td>
                          </tr>
                          <tr class="arco-descriptions-row">
                            <td
                              class="arco-descriptions-item-label arco-descriptions-item-label-block"
                              style="text-align: left"
                            >
                              备注信息 :
                            </td>
                            <td
                              class="arco-descriptions-item-value arco-descriptions-item-value-block"
                              colspan="1"
                              style="text-align: left"
                            >
                              <span>
                                {{ ticketHandleDetail.ticketResultContent }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </a-space>
              </div>
            </a-space>
          </a-timeline-item>
          <a-timeline-item
            v-if="ticketHandleDetail.ticketState >= 2"
            dot-color="var(--color-fill-4)"
          >
            <a-space direction="vertical" fill>
              <div>
                已派单
                <span class="arco-timeline-item-label">
                  {{ ticketHandleDetail.dispatchTime }}
                </span>
              </div>
              <div style="color: gray">
                <a-space direction="vertical" fill>
                  <div
                    class="arco-descriptions arco-descriptions-layout-horizontal arco-descriptions-size-medium"
                  >
                    <div class="arco-descriptions-body">
                      <table class="arco-descriptions-table">
                        <tbody>
                          <tr class="arco-descriptions-row">
                            <td
                              class="arco-descriptions-item-label arco-descriptions-item-label-block"
                              style="text-align: left"
                            >
                              负责工程师 :
                            </td>
                            <td
                              class="arco-descriptions-item-value arco-descriptions-item-value-block"
                              colspan="1"
                              style="text-align: left"
                            >
                              <span>
                                {{ ticketHandleDetail.engineerName || '' }}
                              </span>
                            </td>
                          </tr>
                          <tr class="arco-descriptions-row">
                            <td
                              class="arco-descriptions-item-label arco-descriptions-item-label-block"
                              style="text-align: left"
                            >
                              工程师电话 :
                            </td>
                            <td
                              class="arco-descriptions-item-value arco-descriptions-item-value-block"
                              colspan="1"
                              style="text-align: left"
                            >
                              <span>
                                {{ ticketHandleDetail.engineerPhone || '' }}
                              </span>
                            </td>
                          </tr>
                          <tr class="arco-descriptions-row">
                            <td
                              class="arco-descriptions-item-label arco-descriptions-item-label-block"
                              style="text-align: left"
                            >
                              备注 :
                            </td>
                            <td
                              class="arco-descriptions-item-value arco-descriptions-item-value-block"
                              colspan="1"
                              style="text-align: left"
                            >
                              <span>
                                {{ ticketHandleDetail.ticketRecommend || '' }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </a-space>
              </div>
            </a-space>
          </a-timeline-item>
          <a-timeline-item
            v-if="ticketHandleDetail.ticketState >= 1"
            dot-color="var(--color-fill-4)"
          >
            <a-space direction="vertical" fill>
              <div>
                用户报修
                <span class="arco-timeline-item-label">
                  {{ ticketHandleDetail.createTime }}
                </span>
              </div>
              <div style="color: gray">用户提交报修单</div>
            </a-space>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    getOrderDetail,
    getEngineerList,
    postUpload,
    postCloseOrder,
    postDispatchOrder,
    getWorkTicketTypeList,
  } from '@/api/workorder'
  import { useUserStore } from '@/store'
  import { Message, Modal } from '@arco-design/web-vue'
  import { storeToRefs } from 'pinia'

  // 初始化路由对象 获取参数
  const route = useRoute()
  const router = useRouter()

  // 获取工单id
  const currentOrderId = route.params.id

  // 定义工单详情列表
  const deviceInfo = ref([])

  // 定义工单状态
  const ticketHandleDetail = ref({})

  // 获取工单详情
  const orderDetail = async () => {
    const [{ data }, { data: data2 }] = await Promise.all([
      getOrderDetail({ id: currentOrderId }),
      getWorkTicketTypeList(),
    ])

    console.error('data', data)
    console.error('data2', data2)

    const faultType =
      data2.find((_) => _.id === data.ticketTypeId)?.ticketType || '未知'

    console.log('faultType', faultType)

    // const { data } = await getOrderDetail({ id: currentOrderId })
    deviceInfo.value = [
      {
        label: '设备图片 :',
        value: data.deviceImage,
      },
      {
        label: '设备名称 :',
        value: data.deviceName,
      },
      {
        label: '设备序列号 :',
        value: data.deviceSn,
      },
      {
        label: '设备归属 :',
        value: data.deviceCustomer || '未知',
      },
      {
        label: '设备位置 :',
        value: data.deviceCustomerName || '未知',
      },
      {
        label: '报修人电话 :',
        value: data.reporterPhone,
      },
      {
        label: '报修人姓名 :',
        value: data.reporterName,
      },
      {
        label: '报修时间 :',
        value: data.createTime,
      },
      {
        label: '故障类型 :',
        value: faultType,
      },
      {
        label: '故障描述 :',
        value: data.ticketContent,
      },
      {
        label: '现场图片 :',
        value: data.ticketImages,
      },
      {
        label: '现场视频 :',
        value: data.ticketVideo,
      },
    ]

    ticketHandleDetail.value = data
    // ticketHandleDetail.value.ticketState = 2
  }

  // 获取工程师列表
  const engineerList = ref([])
  const engineerLists = async () => {
    const { data } = await getEngineerList()
    const arr = []
    data.forEach((item) => {
      arr.push({
        ...item,
        label: item.nickName,
        value: item.userId,
      })
    })
    engineerList.value = arr
  }

  // 初始化派单表单
  const arrangeForm = reactive({
    size: 'medium',
    engineer: '',
    phone: '',
    remarks: '',
  })

  // 侦听工程师选择 显示工程师电话
  watch(
    () => arrangeForm.engineer,
    (newvalue) => {
      arrangeForm.phone = engineerList.value.find(
        (item) => item.userId === newvalue
      ).phone
    },
    {
      deep: true,
    }
  )

  // 初始化处理结果表单
  const resultForm = reactive({
    size: 'medium',
    ticketResultState: '',
    ticketResultContent: '',
    ticketResultImages: [],
    ticketResultVideo: [],
  })

  // 结果选项
  const resultList = reactive([
    {
      label: '未处理',
      value: 0,
    },
    {
      label: '已处理',
      value: 1,
    },
  ])

  // 上传图片前验证
  const beforeImageUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJPG) {
      Message.error('上传图片只能是 JPG/PNG 格式!')
    }
    if (!isLt5M) {
      Message.error('上传图片大小不能超过 5MB!')
    }
    return isJPG && isLt5M
  }

  // 上传视频前认证
  const beforeVideoUpload = (file) => {
    console.log(file)
    const isMP4 = file.type === 'video/mp4'
    const isLt100M = file.size / 1024 / 1024 < 100

    if (!isMP4) {
      Message.error('上传视频只能是 MP4 格式!')
    }
    if (!isLt100M) {
      Message.error('上传上传视频只能是大小不能超过 100MB!')
    }
    return isMP4 && isLt100M
  }

  // 派发工单
  const handleDispatchOrder = async ({ errors }) => {
    if (!errors) {
      const params = {
        id: currentOrderId,
        engineerId: arrangeForm.engineer,
        engineerPhone: arrangeForm.phone,
        ticketRecommend: arrangeForm.remarks,
      }
      try {
        await postDispatchOrder({ ...params })
        router.go(0)
      } catch (error) {
        console.log(error)
      }
    }
  }

  // 移除图片
  const beforeRemoveImg = async (file) => {
    await removeFunc(file, 'img')
  }
  const beforeRemoveVideo = async (file) => {
    await removeFunc(file, 'video')
  }

  // 移除方法
  const removeFunc = (file, mode) => {
    console.log(file)
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '确认删除该文件',
        content: `确认删除 ${file.name}`,
        onOk: () => {
          if (mode === 'img') {
            const index = resultForm.ticketResultImages.findIndex(
              (item) => item.name === file.name
            )
            resultForm.ticketResultImages.splice(index, 1)
          } else {
            const index = resultForm.ticketResultVideo.findIndex(
              (item) => item.name === file.name
            )
            resultForm.ticketResultVideo.splice(index, 1)
          }
          resolve(true)
        },
        onCancel: () => {
          console.log('否认删除')
          reject('cancel')
        },
      })
    })
  }

  // 初始化上传组件状态
  const imgDisabled = ref(false)

  // 上传方法
  const uploadFunc = async (option, mode) => {
    const { onProgress, onSuccess, onError, fileItem } = option
    console.log(onProgress)
    const formData = new FormData()
    formData.append('file', fileItem.file)
    if (mode === 'img') {
      formData.append('folder', 'workticket/img/$day')
    } else {
      formData.append('folder', 'workticket/vid/$day')
    }

    const userStore = useUserStore()

    const { enterpriseId } = storeToRefs(userStore)
    const configs = {
      headers: {
        'content-type': 'multipart/form-data',
        'enterpriseId': enterpriseId,
      },
      onUploadProgress: (event) => {
        console.log(event)
        let percent
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100
        }
        console.log(parseInt(percent - 10, 10))
        onProgress(parseInt(percent - 10, 10), event)
      },
      timeout: 1000 * 60,
    }

    try {
      imgDisabled.value = true
      const res = await postUpload(formData, configs)
      if (res.code === 200) {
        if (mode === 'img') {
          resultForm.ticketResultImages.push({
            name: res.data.name,
            url: res.data.url,
          })
        } else {
          resultForm.ticketResultVideo.push({
            name: res.data.name,
            url: res.data.url,
          })
        }
        onSuccess(res.data)
        imgDisabled.value = false
      } else {
        onError(res)
      }
    } catch (error) {
      if (mode === 'img') {
        Message.error({
          content: '上传图片超时，请重新上传',
          duration: 5 * 1000,
        })
      } else {
        Message.error({
          content: '上传视频超时，建议压缩视频',
          duration: 5 * 1000,
        })
      }
      imgDisabled.value = false
    }
  }

  // 上传图片
  const customRequestImg = async (option) => {
    uploadFunc(option, 'img')
  }

  // 上传视频
  const customRequestVideo = async (option) => {
    uploadFunc(option, 'video')
  }

  // 关闭工单
  const handleCloseOrder = async ({ errors }) => {
    if (!errors) {
      const params = {
        id: currentOrderId,
        ticketResultState: resultForm.ticketResultState,
        ticketResultContent: resultForm.ticketResultContent,
        ticketResultImages: resultForm.ticketResultImages
          .map((item) => {
            return `${item.url}`
          })
          .join(','),
        ticketResultVideo: resultForm.ticketResultVideo
          .map((item) => {
            return `${item.url}`
          })
          .join(','),
      }
      console.log(params)
      try {
        await postCloseOrder(params)
        router.go(0)
      } catch (error) {
        console.log(error)
      }
    }
  }

  onMounted(() => {
    orderDetail()
    engineerLists()
  })
</script>

<style lang="less" scoped>
  .order-detail {
    padding: 20px;
    box-sizing: border-box;

    .order-detail-box {
      border-radius: 10px;

      .repair-proces {
        margin-top: 20px;
      }
    }
  }

  video {
    object-fit: cover;
  }
</style>
