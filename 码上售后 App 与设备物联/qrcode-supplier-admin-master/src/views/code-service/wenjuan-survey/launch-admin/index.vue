<template>
  <div>
    <m-table
      :loading="loading"
      :table-props="{
        columns,
        data: questionList,
        rowKey: 'id',
      }"
      :state="state"
      :pagination="{
        total: state.params.total,
        hideOnSinglePage: false,
        onChange,
        onPageSizeChange,
      }"
      :on-refresh="pageDataInit"
    >
      <template #buttons>
        <a-space size="medium">
          <MButton v-bind="tableTLBtnConfig"></MButton>
          <a-upload
            :accept="'.xls,.xlsx,.csv'"
            :custom-request="customRequest"
            :show-cancel-button="false"
            :show-file-list="false"
          >
            <template #upload-button>
              <a-button>
                <template #icon>
                  <icon-upload />
                </template>
                <template #default>导入</template>
              </a-button>
            </template>
          </a-upload>
          <a-button
            href="https://qrservice-1309638772.cos.ap-shanghai.myqcloud.com/template/satisfaction_template.xlsx"
          >
            <template #icon>
              <icon-download />
            </template>
            <template #default>下载模板</template>
          </a-button>
        </a-space>
      </template>
    </m-table>
    <a-modal
      v-model:visible="questionVisible"
      :on-before-ok="handleQuestionOk"
      width="600px"
      @before-close="handleQuestionCancel"
    >
      <template #title>发送调查问卷</template>
      <m-form
        ref="questionRefs"
        v-bind="questionConfig"
        v-model="questionValue"
        @change-value="handleQuestionValue"
      ></m-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import MTable from '@hx/packages/components/m-table'
  import MForm, { IForm } from '@hx/packages/components/m-form/index.vue'
  import MButton, { IButton } from '@hx/packages/components/m-button/index.vue'
  import _ from 'lodash'
  import {
    getQuestionList,
    importSatisfaction,
    sendSatisfaction,
    getExamList,
    postExport,
  } from '@/api/code-service/wenjuan-survey/launch-admin/index'
  import { Message } from '@arco-design/web-vue'

  // 定义表格columns
  const columns = reactive([
    {
      title: '序号',
      dataIndex: 'id',
      render: (row: any) => row.rowIndex + 1,
      key: 'id',
      width: 100,
    },
    {
      title: '投放时间',
      key: 'sendTime',
      dataIndex: 'sendTime',
    },
    {
      title: '完成时间',
      key: 'submitTime',
      dataIndex: 'submitTime',
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '建议或意见',
      key: 'suggestion',
      dataIndex: 'suggestion',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    // {
    //   title: '地址',
    //   key: 'address',
    //   dataIndex: 'address',
    // },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
    },
  ])

  // 定义表格加载中loading
  const loading = ref(false)

  // 定义调查表格数据
  const questionList = ref([])

  // 获取调查列表
  const resGetQuestionList = async () => {
    // loading.value = true
    try {
      const { data } = await getQuestionList(
        _.pickBy({
          pageNum: state.params.pageNum,
          pageSize: state.params.pageSize,
        })
      )
      questionList.value = data.items
      state.params.total = data.total
    } catch (error) {
      console.log(error)
    }
  }

  // 定义满意度问卷列表
  const examList = ref([])

  // 获取满意度调查问卷列表
  const resGetExamList = async () => {
    // loading.value = true
    try {
      const { data } = await getExamList()
      examList.value = data.items
      console.log(examList.value)
    } catch (error) {
      console.log(error)
    }
  }

  // 定义分页信息
  const state = reactive({
    params: {
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
  })

  // 分页事件
  const onChange = (page: number) => {
    state.params.pageNum = page
    resGetQuestionList()
  }

  const onPageSizeChange = (size: number) => {
    state.params.pageSize = size
    resGetQuestionList()
  }

  // 定义新增弹框refs对象
  const questionRefs = ref()

  // 定义新增弹框visible
  const questionVisible = ref(false)

  // 定义新增弹框表单
  const questionConfig: IForm = reactive({
    formItems: [
      {
        field: 'examId',
        type: 'select',
        label: '选择问卷',
        fieldNames: { value: 'id', label: 'name' },
        options: examList,
      },
      {
        field: 'phone',
        type: 'textarea',
        label: '接收号码',
        alert: {
          text: '提示：一行输入一个号码，多个手机号请换行隔开。',
        },
        rules: [
          {
            required: true,
            message: '请填写手机号',
          },
          {
            validator: (value, cb) => {
              return new Promise((resolve) => {
                window.setTimeout(() => {
                  const phone = value.split('\n')
                  const regPhone =
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
                  phone.forEach((item) => {
                    if (item && !regPhone.test(item)) {
                      cb('请输入正确的手机号')
                    }
                  })
                  resolve()
                }, 300)
              })
            },
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

  // 设定新增表单数据
  const questionValue = ref({
    examId: '',
    phone: '',
  })

  // 更新新增表单数据
  const handleQuestionValue = (value) => {
    questionValue.value = value
  }

  // 新增表单确定事件
  const handleQuestionOk = async (done: (closed: boolean) => void) => {
    const value = await questionRefs.value.formValidate()
    if (value) {
      done(false)
    } else {
      try {
        const params = {
          // examId: questionValue.value.examId,
          phone: questionValue.value.phone.split('\n'),
        }
        const { data } = await sendSatisfaction({ ...params })
        console.log(data)
        Message.success('发送成功')
        handleQuestionCancel()
        pageDataInit()
        done(true)
      } catch (error) {
        done(false)
        console.log(error)
      }
    }
  }

  // 设定权重表单取消事件
  const handleQuestionCancel = () => {
    questionRefs.value.resetForm()
    questionVisible.value = false
  }

  const customRequest = async (option: any) => {
    const { onSuccess, onError, fileItem } = option
    const formData = new FormData()
    formData.append('file', fileItem.file)
    const configs = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      timeout: 1000 * 10,
    }

    try {
      const res = await importSatisfaction(formData, configs)
      if (res.code === 200) {
        Message.success('导入成功')
        pageDataInit()
        onSuccess(res.data)
      } else {
        onError(res)
      }
    } catch (error) {
      Message.error('导入失败,请稍后再试')
    }
  }

  // 导出事件
  const handleExport = async () => {
    await postExport({}, `投放管理_${new Date().getTime()}数据.xlsx`)
  }

  // 定义表格左上角按钮
  const tableTLBtnConfig: IButton = reactive({
    buttonItems: [
      {
        name: 'newAdd',
        icon: true,
        clickFunc: () => {
          questionVisible.value = true
        },
      },
      {
        name: 'export',
        icon: true,
        clickFunc: handleExport,
      },
    ],
  })

  // 定义页面初始化事件
  const pageDataInit = () => {
    loading.value = true
    Promise.all([resGetQuestionList(), resGetExamList()])
      .then(() => {
        loading.value = false
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onMounted(() => {
    pageDataInit()
  })
</script>

<style lang="less" scoped>
  :deep(.work-order-search-box) {
    .arco-card-body {
      padding: 0;
    }
  }

  :deep(.arco-image-error) {
    background-color: transparent;
  }
</style>
