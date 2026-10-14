<template>
  <view>
    <n-modal
      v-model:show="isVisible"
      :title="`${edit == 1 ? '编辑' : '新增'}动态`"
      preset="dialog"
      style="width: 800px"
      positive-text="保存"
      negative-text="取消"
      @positive-click="save"
      @negative-click="closeModal"
    >
      <n-form
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="100"
        ref="formRef"
      >
        <n-row>
          <n-col :span="12">
            <n-form-item label="动态标题" path="title">
              <n-input v-model:value="form.title" />
            </n-form-item>
          </n-col>
          <n-col :span="12">
            <n-form-item label="话题" path="newTopic">
              <n-input v-model:value="form.newTopic" />
            </n-form-item>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="24">
            <n-form-item label="动态内容" path="title">
              <n-input v-model:value="form.content" type="textarea" />
            </n-form-item>
          </n-col>
        </n-row>
        <n-row>
          <n-col :span="24">
            <n-form-item
              label="图视内容(1:1)"
              path="mediaUrl"
              class="mediaUrl-formitem"
            >
              <div>
                <n-radio-group v-model:value="form.mediaType">
                  <n-radio :value="1">图片</n-radio>
                  <n-radio :value="2">视频</n-radio>
                </n-radio-group>
              </div>
              <div class="mt-3">
                <n-upload
                  v-if="form.mediaType == 1"
                  v-model:file-list="productImg"
                  :max="9"
                  list-type="image-card"
                  multiple
                  :accept="UploadImgAccept"
                  :customRequest="customRequest1"
                  :on-before-upload="handleBeforeUploadImg"
                />
                <n-upload
                  v-else
                  v-model:file-list="productVideo"
                  :max="9"
                  list-type="image-card"
                  multiple
                  :accept="UploadVideoAccept"
                  :customRequest="customRequest2"
                  :on-before-upload="handleBeforeUploadVideo"
                  :on-preview="onPreviewVideo"
                  show-preview-button
                ></n-upload>
              </div>
            </n-form-item>
          </n-col>
        </n-row>
      </n-form>
    </n-modal>

    <n-modal
      v-model:show="showVideo"
      style="width: 600px"
      title="视频预览"
      preset="card"
    >
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        header-style="text-align:center;padding-bottom:5px"
      >
        <div class="flex-cc">
          <video
            controls
            :src="previewVideoUrlRef"
            style="height: 500px"
          ></video>
        </div>
      </n-card>
    </n-modal>
  </view>
</template>

<script setup lang="ts">
import {
  uploadService,
  UploadImgAccept,
  UploadVideoAccept,
  checkFileSize,
  checkFileType,
  checkImgRatio,
} from '@/utils/uploadService';
import { UploadCustomRequestOptions } from 'naive-ui';
import { FileInfo } from 'naive-ui/es/upload/src/interface';
import { configUpdates, detailUpdates } from '@/api/community/updates';
import { getUrl } from '@/utils/utils';
import {rules} from './data'

const initialData = ref({
  mediaType: 1,
});
// 接收父组件传递的属性
const props = defineProps({
  show: Boolean, // 控制模态框的显示
  initialData: {
    type: Object, // 初始表单数据
  },
  detail: Object, // 初始表单数据
  edit: Number,
});

const form = ref(props.initialData);

const productImg = ref([]);
const productVideo = ref([]);
const img: any = ref([]);
const video: any = ref([]);

// 当初始数据发生变化时更新表单
watch(
  () => props.initialData,
  newData => {
    if (props.edit) {
      const obj: any = {
        ...newData,
        newTopic: newData.linkTopic?.[0],
      };
      if (obj.mediaType == 1) {
        productImg.value = obj.mediaUrl
          ?.split(',')
          ?.filter(v => v)
          ?.map((v, i) => {
            return { id: i, url: getUrl(v), status: 'finished' };
          });
      } else {
        productVideo.value = obj.mediaUrl
          ?.split(',')
          ?.filter(v => v)
          ?.map((v, i) => {
            return { id: i, url: getUrl(v), status: 'finished' };
          });
      }
      form.value = { ...obj };
    }
  },
  { immediate: true }
);

// 发出事件通知父组件
const emit = defineEmits(['update:show', 'save', 'edit', 'query']);

const handleBeforeUploadImg = async (file) => {
  return checkFileSize(file, 2) && checkFileType(file, UploadImgAccept) && await checkImgRatio(file,1);
};

const handleBeforeUploadVideo = ( file ) => {
  return checkFileSize(file, 20) && checkFileType(file, UploadVideoAccept);
};


const customRequest1 = async (obj: UploadCustomRequestOptions) => {
  const uploadFile = await uploadService(obj);
  const { batchId, url, name } = uploadFile;
  img.value.push({
    id: batchId,
    url,
    name,
  });

  form.value.mediaUrl = img.value.map(item => item.url)?.join(',');
};
const customRequest2 = async (obj: UploadCustomRequestOptions) => {
  const uploadFile: any = await uploadService(obj);
  const { batchId, url, name } = uploadFile;
  video.value.push({
    id: batchId,
    url,
    name,
  });
  form.value.mediaUrl = video.value.map(item => item.url)?.join(',');
};
const showVideo = ref(false);
const previewVideoUrlRef = ref();
const onPreviewVideo = (file: FileInfo, detail: { event: MouseEvent }) => {
  const { url } = file;
  if (url) {
    previewVideoUrlRef.value = url;
    showVideo.value = true;
  }
};

// 控制模态框显示
const isVisible = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

watch(
  () => isVisible,
  _isVisible => {
    if (!isVisible) {
      reset();
    }
  }
);

function reset() {
  img.value = [];
  video.value = [];
  productImg.value = [];
  productVideo.value = [];
  form.value = initialData.value;
}
const message = window.$message;

const formRef = ref();
function save() {
  formRef.value?.validate(errors => {
    if (!errors) {
      const obj = {
        ...form.value,
        mediaType: +form.value.mediaType,
        linkTopic: [form.value.newTopic],
        newTopic: [form.value.newTopic],
      };
      configUpdates(obj).then(() => {
        message.success(!form.value.id ? '新增成功' : '编辑成功');
        closeModal();
        query();
      });
    } else {
      message.error('验证失败');
    }
  });
}

function query() {
  emit('query');
}

// 关闭模态框
const closeModal = () => {
  isVisible.value = false;
};

onMounted(async () => {});
</script>

<style scoped lang="less">
.spec-item {
  position: relative;
  margin-bottom: 16px;
  background: #eee;
  padding: 20px;
  padding-top: 54px;
  border-radius: 5px;
}

:deep(.mediaUrl-formitem) {
  .n-form-item-blank {
    display: block !important;
  }
}

.del-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

.spec-value {
  display: flex;
  flex-wrap: wrap;
  /* 允许子元素换行 */
  width: 100%;
}

.spec-value-item {
  display: flex;
  flex-wrap: wrap;
  /* 允许子元素换行 */
  align-items: center;
  flex: 1 0 24%;
  /* 每个输入框占据行宽的25%，这样一行最多显示四个 */
  width: 24%;
  /* 确保每个输入框最大宽度为25% */
  max-width: 24%;
  /* 确保每个输入框最大宽度为25% */
  box-sizing: border-box;
  /* 包括padding和border在内的宽度计算方式 */
}
</style>
