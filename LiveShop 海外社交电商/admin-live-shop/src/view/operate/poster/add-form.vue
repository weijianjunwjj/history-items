<template>
  <n-grid x-gap="12">
    <n-gi :span="11">
      <n-form-item label="广告名称" path="name">
        <n-input v-model:value="formItem.name" type="textarea" maxlength="120" show-count/>
      </n-form-item>
      <n-form-item label="广告类型" path="openType">
        <n-radio-group v-model:value="formItem.openType" name="openType">
          <n-space>
            <n-radio v-for="t in searchOptions.type" :key="t.value" :value="t.value">
              {{ t.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="广告位置" path="locationId">
        <n-select v-model:value="formItem.locationId" :options="adPosition" @update:value="changeLocation"/>
      </n-form-item>
      <n-form-item label="广告状态" path="status" v-if="formItem.id == 0">
        <n-select v-model:value="formItem.status" :options="searchOptions.status"/>
      </n-form-item>
      <n-form-item label="广告排序" path="sortId">
        <n-input-number max="10000" min="0" v-model:value="formItem.sortId" clearable style="width: 100%"/>
      </n-form-item>
    </n-gi>
    <n-gi :span="13">
      <n-form-item label="广告简介" path="description">
        <n-input v-model:value="formItem.description" type="textarea" maxlength="300" show-count/>
      </n-form-item>
      <n-form-item label="URL地址" path="jumpUrl" v-if="formItem.openType != 1">
        <n-input v-model:value="formItem.jumpUrl"/>
      </n-form-item>
      <n-form-item :label="headImgConf.label" path="picture" v-if="formItem.locationId != ''">
        <n-upload v-model:file-list="picture" :max="1" list-type="image-card" :accept="UploadImgAccept"
                  :customRequest="customRequest" @before-upload="handleBeforeUploadImg"/>
      </n-form-item>
    </n-gi>
  </n-grid>
</template>
<script lang="ts" setup>
import {ref, watch} from 'vue';
import {searchOptions} from '@/view/operate/poster/data';
import {checkFileSize, checkFileType, UploadImgAccept, uploadService, checkImgRatio} from '@/utils/uploadService';
import {UploadCustomRequestOptions} from 'naive-ui/es/components';

const props = defineProps({
  formItem: {
    type: Object,
    default: () => {
    },
    required: true
  },
  adPosition: {
    type: Array,
    required: true
  },
});
const emits = defineEmits(['update:formItem']);
const headImgConf = reactive({
  label: "广告头图",
  width: 0,
  height: 0,
})

const formItem = computed({
  get() {
    return props.formItem
  },
  set(value) {
    emits('update:formItem', value);
  }
})

const picture = ref([])
watch(() => picture, (_picture: any) => {
  formItem.value.picture = _picture.value?.[0]?.url || undefined
}, {deep: true})

const changeLocation = () => {
  setLocationRadio()
  picture.value = []
}

const setLocationRadio = () => {
  let locationConf = formItem.value.locationId.split("_")
  if (locationConf.length == 1) {
    headImgConf.label = "广告头图(1:1)"
    headImgConf.width = 1
    headImgConf.height = 1
  } else {
    headImgConf.label = "广告头图(" + locationConf[1] + ":" + locationConf[2] + ")"
    headImgConf.width = parseInt(locationConf[1])
    headImgConf.height = parseInt(locationConf[2])
  }
}
setLocationRadio()
const customRequest = async (obj: UploadCustomRequestOptions) => {
  const uploadFile = await uploadService(obj);
  const {batchId, url, name} = uploadFile;
  formItem.value.picture = url
};

const handleBeforeUploadImg = async (file) => {
  let ratio = Math.round(headImgConf.width / headImgConf.height * 10) / 10;
  return checkFileSize(file, 2) && checkFileType(file, UploadImgAccept) && await checkImgRatio(file, ratio)
};

defineExpose({
  picture
})
const $bus: any = inject('$mitt')
$bus.on('update_picture', _picture => {
  picture.value = _picture
})

</script>
