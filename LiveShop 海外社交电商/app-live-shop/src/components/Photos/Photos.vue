<template>
  <view v-if="isMe" class="person-own-up">
    <wd-upload
      v-if="isMe"
      v-model:file-list="fileList"
      image-mode="aspectFill"
      :action="action"
      :source-type="['album']"
      accept="image"
      :limit="9"
      @change="handleUploadChange"
      @success="uploadSuccess"
      @remove="removeUserPhoto"
      custom-class="box-card-own"
      custom-preview-class="my-img"
    ></wd-upload>
  </view>

  <template v-else>
    <view class="box-card" v-if="DataList.length">
      <template v-for="(item, index) in DataList" :key="index">
        <image
          :src="item.url"
          class="my-img"
          style="width: 100%"
          mode="aspectFill"
          @tap.stop="preview(index)"
        ></image>
      </template>
      <q-previewImage ref="previewImage" :urls="imgs"></q-previewImage>
    </view>

    <Empty v-else />
  </template>
</template>

<script lang="ts" setup>
import { addUserPhotos, getUserPhotos, delUserPhotos } from '@/service/person-page/person-page'
import { getUrl } from '@/utils/utils'
import Empty from '../Empty/Empty.vue'

const DataList = ref([])

const { userInfo } = useUserInfo()

const props = defineProps({
  userId: {
    type: Number,
  },
})

const pages = reactive({
  page: 1,
  pageSize: 10,
})

const imgs = ref([])

const fileList = ref([])
const action: string = '/File/upload'
const previewImage = ref(null)
const preview = (index) => {
  previewImage.value.open(index) // 传入当前选中的图片地址
}
// 上传图片
const handleUploadChange = ({ fileList: files }) => {
  fileList.value = files
}
const removeUserPhoto = ({ file: f }) => {
  delUserPhotos(f.id).then((res: any) => {
    if (res.code == 0) {
      uni.showToast({
        title: 'delete success',
        icon: 'none',
      })
    }
  })
}
const uploadSuccess = async ({ file }) => {
  try {
    const res = JSON.parse(file.response)
    const { code, data } = res
    if (code === 0) {
      const fileUrl = data.file_name
      await addUserPhotos(fileUrl)
      await getImageList(param.value)
    } else {
      throw new Error()
    }
  } catch (err) {
    console.warn('上传图片err', err)
  }
}
const param = ref({})
const getImageList = async (params) => {
  getUserPhotos(params).then((res: any) => {
    DataList.value = res.data.list?.map((item) => {
      return {
        ...item,
        url: getUrl(item.imgUrl),
      }
    })
    fileList.value = res.data.list?.map((item) => {
      return {
        url: getUrl(item.imgUrl),
        id: item.id,
      }
    })
    imgs.value = DataList.value?.map((item) => item.url)
  })
}

const isMe = computed(() => {
  return props.userId === userInfo.value.Id
})

onMounted(async () => {
  const { page, pageSize } = pages
  const userId = props.userId ? props.userId : userInfo.value.Id
  const params = {
    userId,
    page,
    pageSize,
  }
  param.value = params
  await getImageList(params)
})
</script>

<style lang="scss" scoped>
.box-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列，每列宽度为1fr */
  gap: 10px; /* 图片之间的间距 */
  .my-img {
    width: 100%;
    height: auto; /* 保持图片的纵横比 */
    display: block;
    aspect-ratio: 1/1; // 元素宽高比为1比1
  }
}
.person-own-up {
  :deep() {
    .box-card-own {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 3列，每列宽度为1fr */
      .my-img,
      .wd-upload__evoke {
        width: 80%;
        height: auto; /* 保持图片的纵横比 */
        aspect-ratio: 1/1; // 元素宽高比为1比1
      }
    }
  }
}
</style>
