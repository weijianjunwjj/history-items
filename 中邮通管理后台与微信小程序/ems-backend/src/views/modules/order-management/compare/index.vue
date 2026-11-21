<template>
  <AppPage>
    <div class="order-management-compare">
      <header class="mb-def">
        <n-card rounded-4 class="mb-def">
          <n-row gutter="12">
            <n-col :span="5" class="header-item">
              <n-upload
                multiple
                directory-dnd
                with-credentials
                :max="1"
                :custom-request="customUpload1"
                accept="application/vnd.ms-excel, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              >
                <n-upload-dragger class="common-h">
                  <div style="margin-bottom: 3px">
                    <n-icon size="20" :depth="3">
                      <CloudUploadIcon />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 14px">拖拽或点击上传订单1</n-text>
                </n-upload-dragger>
              </n-upload>
            </n-col>
            <n-col :span="5" class="header-item">
              <div class="flex-v just-sb common-h full-w">
                <n-flex align="center">
                  <span>字段1</span>
                  <n-select
                    class="flex-1"
                    v-model:value="value_a1"
                    :options="options.opt1"
                    placeholder="请选择字段1进行比对"    
                    clearable                
                  />
                </n-flex>
                <n-flex align="center">
                  <span>字段2</span>
                  <n-select
                    class="flex-1"
                    v-model:value="value_a2"
                    :options="options.opt1"
                    placeholder="请选择字段2进行比对"
                    clearable                    
                  />
                </n-flex>
              </div>
            </n-col>
            <n-col :span="5" class="header-item">
              <n-upload
                multiple
                directory-dnd
                with-credentials
                :max="1"
                :custom-request="customUpload2"
                accept="application/vnd.ms-excel, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              >
                <n-upload-dragger class="common-h">
                  <div style="margin-bottom: 3px">
                    <n-icon size="20" :depth="3">
                      <CloudUploadIcon /> 
                    </n-icon>
                  </div>
                  <n-text style="font-size: 14px">拖拽或点击上传订单2</n-text>
                </n-upload-dragger>
              </n-upload>
            </n-col>
            <n-col :span="5" class="header-item">
              <div class="flex-v just-sb common-h full-w">
                <n-flex align="center">
                  <span>字段1</span>
                  <n-select clearable class="flex-1" v-model:value="value_b1" :options="options.opt2" placeholder="请选择字段1进行比对" />
                </n-flex>
                <n-flex align="center">
                  <span>字段2</span>
                  <n-select clearable class="flex-1" v-model:value="value_b2" :options="options.opt2" placeholder="请选择字段2进行比对" />
                </n-flex>
              </div>
            </n-col>
            <n-col :span="4" class="header-item" style="width: 100px">
              <div flex flex-content-end>
                <n-button type="primary" @click="onCompare" :loading="loading">开始比对</n-button>
              </div>
            </n-col>
          </n-row>
        </n-card>
      </header>
      <main class="mb-def">
        <n-card title="比对结果" flex-1 rounded-4 class="mb-def">
          <div style="width: 1000px">
            <n-card
              title="两个订单中字段1不同项："
              bordered="false"
              rounded-4
              class="mb-def"
              style="background-color: #fafafc"
            >
              <div v-if="items1_1.length">
                {{ file1Name }}，共有
                <span class="theme fold font-size-16 ml-2 mr-2">
                  {{ items1_1L }}
                </span>
                处不同，分别是：
                <!-- <span class="grey">（{{ tip1 }}）</span> -->
              </div>
              <n-virtual-list
                style="max-height: 240px"
                :item-size="42"
                item-resizable
                :items="items1_1"
              >
                <template #default="{ item }">
                  <span :key="item">{{ item }}</span>
                </template>
              </n-virtual-list>
              <n-divider v-if="items1_1.length && items1_2.length" />
              <!-- ------------------------------------------------------- -->
              <div mt-20 mb-20 v-if="items1_2.length">
                {{ file2Name }}，共有
                <span class="theme fold font-size-16 ml-2 mr-2">
                  {{ items1_2L }}
                </span>
                处不同，分别是：
                <!-- <span class="grey">（{{ tip1 }}）</span> -->
              </div>
              <n-virtual-list
                style="max-height: 240px"
                :item-size="42"
                item-resizable
                :items="items1_2"
              >
                <template #default="{ item }">
                  <div :key="item" class="item" style="height: 42px">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </n-virtual-list>
              <n-space mt-15 justify="end">
                <n-button
                  type="primary"
                  size="small"
                  @click="downloadTxtFile(getTxt([...items1_1, ...items1_2]), '字段1不同比对结果')"
                >
                  下载
                </n-button>
                <n-button
                  type="primary"
                  size="small"
                  ml-10
                  @click="copyToClipboard(getTxt([...items1_1, ...items1_2]))"
                >
                  复制
                </n-button>
              </n-space>
            </n-card>
            <n-card
              title="两个订单中字段1重复项："
              bordered="false"
              rounded-4
              class="mb-def"
              style="background-color: #fafafc"
            >
              <div mb-20 v-if="items2_1.length">
                {{ file1Name }}，共有
                <span class="theme fold font-size-16 ml-2 mr-2">
                  {{ items2_1L }}
                </span>
                处相同，分别是：
                <span class="grey">（{{ tip1 }}）</span>
              </div>
              <n-virtual-list
                style="max-height: 240px"
                :item-size="42"
                item-resizable
                :items="items2_1"
              >
                <template #default="{ item }">
                  <div :key="item" class="item" style="height: 42px">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </n-virtual-list>
              <n-divider v-if="items2_1.length && items2_2.length" />
              <!-- ----------------------------------------------------------- -->
              <div mt-40 mb-20 v-if="items2_2.length">
                {{ file2Name }}，共有
                <span class="theme fold font-size-16 ml-2 mr-2">
                  {{ items2_2L }}
                </span>
                处相同，分别是：
                <!-- <span class="grey">（{{ tip1 }}）</span> -->
              </div>
              <n-virtual-list
                style="max-height: 240px"
                :item-size="42"
                item-resizable
                :items="items2_2"
              >
                <template #default="{ item }">
                  <div :key="item" class="item" style="height: 42px">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </n-virtual-list>
              <n-space mt-15 justify="end">
                <n-button
                  type="primary"
                  size="small"
                  @click="downloadTxtFile(getTxt([...items2_1, ...items2_2]), '重复字段1比对结果')"
                >
                  下载
                </n-button>
                <n-button
                  type="primary"
                  size="small"
                  ml-10
                  @click="copyToClipboard(getTxt([...items2_1, ...items2_2]))"
                >
                  复制
                </n-button>
              </n-space>
            </n-card>
            <n-card
              title="两个订单中相同字段1下字段2数值不同项："
              bordered="false"
              rounded-4
              class="mb-def"
              style="background-color: #fafafc"
            >
              <div v-if="items3.length">
                {{ file1Name }}和{{ file2Name }}，共有
                <span class="theme fold font-size-16 ml-2 mr-2">
                  {{ items3L }}
                </span>
                处相同字段1数值不同，分别是：
                <!-- <span class="grey">（{{ tip1 }}）</span> -->
              </div>
              <n-virtual-list
                style="max-height: 240px"
                :item-size="42"
                item-resizable
                :items="items3"
              >
                <template #default="{ item }">
                  <div :key="item" class="item" style="height: 42px">
                    <span>{{ item }}</span>
                  </div>
                </template>
              </n-virtual-list>
              <n-space mt-15 justify="end">
                <n-button
                  type="primary"
                  size="small"
                  @click="downloadTxtFile(getTxt(items3), '相同字段1数值不同比对结果')"
                >
                  下载
                </n-button>
                <n-button
                  type="primary"
                  size="small"
                  ml-10
                  @click="copyToClipboard(getTxt(items3))"
                >
                  复制
                </n-button>
              </n-space>
            </n-card>
          </div>
        </n-card>
      </main>
    </div>
  </AppPage>
</template>

<script setup>
import { ArchiveOutline as ArchiveIcon, CloudUploadOutline as CloudUploadIcon } from '@vicons/ionicons5'
import { copyToClipboard, downloadTxtFile } from '../../../../utils'
import { getToken } from '@/utils'
import axios from 'axios'
import api from './api'

const uploadUrl = window.$api_test + '/tools/file/upload'

const saToken = getToken()

const options = reactive({
  opt1: [],
  opt2: [],
})

const item_group = 7
const items1_1 = ref([])
const items1_2 = ref([])
const items2_1 = ref([])
const items2_2 = ref([])
const items3 = ref([])
const items1_1L = ref(0)
const items1_2L = ref(0)
const items2_1L = ref(0)
const items2_2L = ref(0)
const items3L = ref(0)

const value_a1 = ref()
const value_a2 = ref()
const value_b1 = ref()
const value_b2 = ref()
const file1Md5 = ref()
const file2Md5 = ref()

const tip1 = '鼠标悬浮内容区域，滚动鼠标滚动轴查看全部内容'

function getOpts(arr) {
  return arr.map((name) => ({
    label: name,
    value: name,
  }))
}

async function customUpload1(opt) {
  const data1 = await customUpload(opt)
  console.log('data1 :>> ', data1)
  const { keyList, md5 } = data1.data
  console.log('keyList :>> ', keyList)
  file1Md5.value = md5
  options.opt1 = getOpts(keyList)
  console.log('options.opt1 :>> ', options.opt1)
}
async function customUpload2(opt) {
  const data2 = await customUpload(opt)
  console.log('data2 :>> ', data2)
  const { keyList, md5 } = data2.data
  file2Md5.value = md5
  options.opt2 = getOpts(keyList)
}
const file1Name = ref('')
const file2Name = ref('')

const loading = ref(false)

function getTxt(arr) {
  // 把数组转换为字符串
  const allStr = arr?.filter((item) => item.trim() !== '').join(',')
  return allStr
}

function chunkAndJoinArray(array, chunkSize) {
  let result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize)
    result.push(chunk.join(','))
  }
  return result
}

function onCompare() {
  loading.value = true
  api
    .compare({
      file1Md5: file1Md5.value,
      file2Md5: file2Md5.value,
      field1Base: value_a1.value,
      field1Value: value_a2.value,
      field2Base: value_b1.value,
      field2Value: value_b2.value,
    })
    .then((res) => {
      console.log('res :>> ', res)
      loading.value = false
      const { data } = res
      console.log('data :>> ', data)
      file1Name.value = data.file1Name
      file2Name.value = data.file2Name
      const index = item_group
      const noNull = (arr) => arr?.filter((item) => item.trim() !== '').flat()
      items1_1.value = chunkAndJoinArray(noNull(data.resultCompare1), index)
      items1_2.value = chunkAndJoinArray(noNull(data.resultCompare2), index)
      items2_1.value = chunkAndJoinArray(noNull(data.repeatFile1), index)
      items2_2.value = chunkAndJoinArray(noNull(data.repeatFile2), index)
      items3.value = chunkAndJoinArray(noNull(data.baseCompareValue), index)
      items1_1L.value = noNull(data.resultCompare1).length
      items1_2L.value = noNull(data.resultCompare2).length
      items2_1L.value = noNull(data.repeatFile1).length
      items2_2L.value = noNull(data.repeatFile2).length
      items3L.value = noNull(data.baseCompareValue).length
    })
    .catch((err) => {
      loading.value = false
    })
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

<style scoped>
.grey {
  color: grey;
}
.header-item {
  width: 250px;
}
.common-h {
  width: 100%;
  height: 100px;
}
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.24);
}
</style>
