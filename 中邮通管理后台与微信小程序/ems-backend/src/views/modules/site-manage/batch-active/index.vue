<template>
  <AppPage>
    <div class="batch-active" v-if="!showDetail">
      <n-card flex-1 rounded-4 class="header mb-def">
        <div class="flex-sb-c">
          <div flex>
            <n-upload
              v-model:file-list="fileList"
              style="width: 200px"
              multiple
              directory-dnd
              with-credentials
              :max="1"
              :custom-request="customUpload1"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <n-button type="primary">上传文件</n-button>
            </n-upload>

            <n-button type="default" class="ml-60" @click="onActive" :loading="loading">
              批量激活
            </n-button>
          </div>

          <a class="hover-point" @click="showDetail = true">批量激活记录</a>
        </div>
      </n-card>
      <n-card title="查询结果" flex-1 rounded-4 class="mb-def">
        <template v-if="total">
          <n-progress
          type="line"
          :percentage="percentage"
          :indicator-placement="'inside'"
          :processing="processing"
          :status="status"
        />
        <div style="width: 1000px" mt-15>
          <div>
           共上传{{ total }}条数据， {{ successes }}个设备激活成功。{{ errors }}个设备激活失败，{{ invalids }}个数据校验失败。 详细信息请下载表格查看
          </div>
        </div>
        </template>
        <template v-else>
          <div class="error-msg red">
            {{ errorMsg }}
          </div>
        </template>


        <div mt-30 v-if="total">
          <n-button type="primary" :loading="downloadLoading" @click="exportTable">下载表格</n-button>
        </div>
       
      </n-card>
    </div>

    <BatchActiveHistory @back="showDetail = false" v-else />
  </AppPage>
</template>

<script setup>
import axios from 'axios'
import BatchActiveHistory from './components/BatchActiveHistory.vue'
import { getToken,downloadUrl } from '@/utils'
import api from './api'
import qs from 'qs'

const showDetail = ref(false)
const uploadUrl = window.$api_test + '/tools/stationActive/upload'
const saToken = getToken()

const total = ref(0)
const fileList = ref([])
const invalidCount = ref(0)
const loading = ref(false)
const successes = ref(0)
const errors = ref(0)
const invalids = ref(0)
const errorMsg = ref('')
let preData = {}
let uploadData = {}
const processing = ref(false)
const status = ref('info')
async function customUpload1(opt) {
  const data1 = await customUpload(opt)
  console.log('data1 :>> ', data1)
  uploadData = data1.data
  console.log('uploadData :>> ', uploadData)
}

let my_polling

const percentage = ref(0)

watch(() => total.value, (t) => {
  if(t > 0){
    //清空遗留的错误信息
    errorMsg.value = null
  }
})

const downloadLoading = ref(false)

async function exportTable() {
  console.log('api.exportListURL :>> ', api.exportListURL)
  const md5 = uploadData.md5
  const p = {
    md5
  }
  if(!md5){
    return $message.error('未检测到文件，请上传后重试！!')
  }
  const params = qs.stringify(p)
  console.log('params :>> ', params)
  downloadLoading.value = true
  let $api_test = window.$api_test
  downloadLoading.value = true
  if (params) {
    downloadUrl($api_test + api.exportListURL + `?${params}&saToken=${getToken()}`)
  } else {
    downloadUrl($api_test + api.exportListURL + `?saToken=${getToken()}`)
  }
  setTimeout(() => {
    downloadLoading.value = false
  }, 500)
}


function polling(md5) {
  const stopPolling = () => {
    console.error('停止轮询')
    clearInterval(my_polling)
    loading.value = false
    processing.value = false
    status.value = 'success'
  }
  const findByMd5 = (md5) => {
    api
      .findByMd5({ md5 })
      .then((res) => {
        const { data: data0 } = res
        const { totalCount, okCount, invalidCount, failedCount, data } = data0
        const processCount = failedCount + invalidCount + okCount
        //停止轮询
        // total:0
        // failedCount +  invalidCount + okCount > total
        if (totalCount == 0 || processCount >= totalCount) {
          stopPolling()
          if (totalCount == 0) {
            errorMsg.value = '未检测到数据，请检查文件后重试！'
          }
        } 

        const _percentage = ((processCount / totalCount) * 100).toFixed(2) 
        percentage.value = _percentage
        total.value = totalCount
        errors.value = failedCount
        successes.value = okCount
        invalids.value = invalidCount
      })
      .catch((err) => {
        stopPolling()
      })
  }
  findByMd5(md5)
  clearInterval(my_polling)
  my_polling = setInterval(() => {
    findByMd5(md5)
  }, 3000)
}

async function onActive() {
  console.log('fileList.value :>> ', fileList.value)
  if (!fileList.value.length) {
    return $message.error('先上传文件')
  }
  loading.value = true
  console.log('uploadData :>> ', uploadData)
  const md5 = uploadData.md5
  console.log('md5 :>> ', md5)

  api.active({
    md5,
  }).then((value) => {
    console.log('value :>> ', value)
  })
  setTimeout(() => {
    polling(md5)
    processing.value = true
  }, 100)
  // try {
  //   const res = await api.active({
  //     md5,
  //   })
  //   loading.value = false
  //   const { data } = res
  //   console.log('data :>> ', data)
  //   $message.success('激活成功！')
  //   const res2 = await api.getList({
  //     md5,
  //   })
  //   const { records } = res2.data
  //   total.value = uploadData.size
  //   errors.value = records
  //     .filter((item) => item.status == 2)
  //     .map((item) => {
  //       return {
  //         ...item,
  //         errorMsg: item.remark ? JSON.parse(item.remark)?.errorMsg : errorMsg,
  //       }
  //     })
  //   successes.value = records.filter((item) => item.status == 1)?.length

  //   console.log('errors.value :>> ', errors.value)
  // } catch (error) {
  //   console.error(error)
  //   loading.value = false
  // }
}
function customUpload(options) {
  return new Promise((resolve, reject) => {
    console.log('options :>> ', options)
    const { file, onProgress, onFinish: onSuccess, onError } = options

    // 创建 FormData 对象并添加文件
    const formData = new FormData()
    // 确保 file 对象存在，并且是一个 File 类型
    if (file && file.file instanceof File) {
      formData.append('file', file.file) // 使用 file.file 获取 File 对象
    } else {
      // 如果 file.file 不是一个 File 对象，这里应该抛出一个错误或者进行错误处理
      onError(new Error('无效的文件类型'))
      return
    }

    // 创建 axios 请求配置
    const config = {
      headers: {
        saToken,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress({ percent: percentCompleted })
      },
    }

    // 发送请求
    axios
      .post(uploadUrl, formData, config)
      .then((response) => {
        const { data } = response
        if (
          (data?.data?.code == 200 && data?.data?.data?.startsWith('http')) ||
          data?.data?.keyList?.length === 0
        ) {
          reject()
          onError()
          $message.error('上传失败，请重新上传！')
        } else {
          onSuccess(data)
          resolve(data)
        }
      })
      .catch((error) => {
        onError(error)
        reject(error)
      })
  })
}
</script>

<style lang="scss">
.batch-active {
  .header {
    .n-form-item-label {
      width: 77px;
    }
  }
  .row-marked {
    background-color: #f0f0f0; // 灰色背景
  }
  .n-form-item {
    display: flex;
    align-items: center;
    label {
      margin-right: 10px;
      line-height: 34px;
    }
    .n-form-item-blank {
      flex: 1;
    }
  }
  .rtl {
    direction: rtl;
  }
}
</style>
