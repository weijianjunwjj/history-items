<template>
  <n-modal
    :show="visible"
    preset="dialog"
    :title="title"
    positive-text="发布"
    negative-text="取消"
    @positive-click="handleSubmit"
    @negative-click="handleCancel"
    @close="handleCancel"
    style="width: 1080px; min-height: 700px"
    :negative-button-props="{ size: 'medium' }"
    :positive-button-props="{ size: 'medium', loading: confirmLoading }"
  >
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="formBigBoxModelInfo"
      label-placement="left"
      label-width="100"
    >
      <n-row :gutter="16">
        <n-col span="12">
          <n-form-item label="活动名称" path="name">
            <n-input
              v-model:value="form.name"
              placeholder="请输入活动名称"
              clearable
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="预约截止" path="bookingDeadline" v-if="typeFlag == 3">
            <n-date-picker
              v-model:value="form.bookingDeadline"
              type="datetime"
              clearable
              placeholder="请选择预约截止日期"
              style="width: 100%"
              :is-date-disabled="dateBookingDeadlineDisabled"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="活动周期" path="rangeTime">
            <n-date-picker
              v-model:value="rangeTime"
              type="datetimerange"
              clearable
              separator="—"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"
              :disabled="disabledAll"
              :is-date-disabled="dateBookingDeadlineDisabled"
              :is-time-disabled="timeRangeTimeDisabled"
            />
          </n-form-item>
          <n-form-item label="活动简介" path="shortDesc">
            <n-input v-model:value="form.shortDesc" placeholder="请输入活动简介" clearable />
          </n-form-item>
          <n-form-item label="参与规则" path="ruleType">
            <n-radio-group v-model:value="form.ruleType" :disabled="disabledAll">
              <n-radio value="1">仅金币</n-radio>
              <n-radio value="2">仅积分</n-radio>
              <n-radio value="3">积分或金币</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="封面图(5:2)" path="banner">
            <n-upload
              :action="uploadUrl"
              @before-upload="beforeUpload"
              :accept="UploadImgAccept"
              v-model:file-list="formBannerList"
              :max="1"
              list-type="image-card"
              :custom-request="customBannerRequest"
              @remove="onBannerRemoveEvent"
              :disabled="disabledAll"
            />
          </n-form-item>
        </n-col>
        <n-col span="12">
          <n-form-item label="活动类型" path="activityType" v-if="typeFlag == 3">
            <n-select
              v-model:value="form.activityType"
              placeholder="请选择活动类型"
              :options="searchOptions"
              clearable
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="人数上限" path="peopleMax" v-else>
            <n-input-number
              v-model:value="form.peopleMax"
              placeholder="请输入参与人数上限"
              :maxlength="9"
              :min="1"
              :max="999999999"
              :show-button="false"
              clearable
              style="width: 250px"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="预约上限" path="peopleMax" v-if="typeFlag == 3">
            <n-input-number
              v-model:value="form.peopleMax"
              placeholder="请输入预约人数上限"
              :maxlength="9"
              :min="1"
              :max="999999999"
              :show-button="false"
              clearable
              style="width: 100%"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="自动开始" path="isAutoStart">
            <n-radio-group v-model:value="form.isAutoStart" :disabled="disabledAll">
              <n-space>
                <n-radio value="0"> 人数达标，不自动开始</n-radio>
                <n-radio value="1"> 人数达标，自动开始</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="运费" path="freight">
            <n-input-number
              v-model:value="form.freight"
              placeholder="请输入运费"
              :maxlength="9"
              :min="0"
              :max="99999999"
              :show-button="false"
              clearable
              style="width: 100%"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="所需金币" path="coin" v-if="form.ruleType == 1">
            <n-input-number
              v-model:value="form.coin"
              placeholder="请输入金币数量"
              :maxlength="9"
              :min="0"
              :max="99999999"
              :show-button="false"
              clearable
              style="width: 100%"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="所需积分" path="integral" v-if="form.ruleType == 2">
            <n-input-number
              v-model:value="form.integral"
              placeholder="请输入积分数量"
              :maxlength="9"
              :min="0"
              :max="99999999"
              :show-button="false"
              clearable
              style="width: 100%"
              :disabled="disabledAll"
            />
          </n-form-item>
          <n-form-item label="换算规则" v-if="form.ruleType == 3">
            <n-input-number
              v-model:value="form.integral"
              placeholder="请输入"
              :maxlength="9"
              :min="0"
              :max="99999999"
              :show-button="false"
              :disabled="disabledAll"
            />
            <label style="width: 45px; margin: 0 5px 0 5px">积分=</label>
            <n-input-number
              v-model:value="form.coin"
              placeholder="请输入"
              :maxlength="9"
              :min="0"
              :max="99999999"
              :show-button="false"
              :disabled="disabledAll"
            />
            <label style="width: 35px; margin: 0 0 0 5px">金币</label>
          </n-form-item>
          <n-form-item label="奖品图(1:1)" path="reward">
            <n-upload
              :action="uploadUrl"
              :accept="UploadImgAccept"
              @before-upload="beforeUploadReward"
              v-model:file-list="formRewardList"
              :max="typeFlag == 3 ? (form.activityType == 2 ? 9 : 1) : rewardMax"
              list-type="image-card"
              multiple
              :custom-request="customRewardRequest"
              @remove="onRewardRemoveEvent"
            />
          </n-form-item>
        </n-col>
        <n-col span="24">
          <n-form-item label="活动详情" path="detail">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="ToolbarConfig"
              />
              <Editor
                style="width: 100%; height: 301px; overflow-y: hidden"
                v-model="form.detail"
                :defaultConfig="editorConfig"
                @onCreated="handleCreated"
                @input="handleEditorChange"
              />
            </div>
          </n-form-item>
        </n-col>
      </n-row>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { FormInst, UploadCustomRequestOptions, useMessage } from 'naive-ui';
import { getActivityBookingConfigList, getActivityConfigList } from '@/api/activity';
import { searchOptions } from './data';
import { form, rangeTime, rules } from './form';
import dayjs from 'dayjs';
import Config from '../../../config/index';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {
  checkFileSize,
  checkFileType,
  checkImgRatio,
  UploadImgAccept,
  uploadService
} from '@/utils/uploadService.ts';
import { MENU_CONF, ToolbarConfig } from '@/config/editor';
import { getUrl } from '@/utils/utils';

const rewardMax = ref(1);

const uploadUrl = Config.baseUrl + 'BasePrivate/uploadFile';

const editorRef = shallowRef();
const editorConfig = {
  placeholder: '请输入详情内容...',
  MENU_CONF
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

onMounted(() => {
  if (props.typeFlag == 1) {
    rewardMax.value = 1;
  } else if (props.typeFlag == 2) {
    rewardMax.value = 9;
  }
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const beforeUpload = async file => {
  return (
    checkFileSize(file, 3) &&
    checkFileType(file, UploadImgAccept) &&
    (await checkImgRatio(file, 2.5))
  );
};

const beforeUploadReward = async file => {
  return (
    checkFileSize(file, 10) &&
    checkFileType(file, UploadImgAccept) &&
    (await checkImgRatio(file, 1))
  );
};

const handleEditorChange = () => {
  // formRefCustomValidate('detail');
};

const onBannerRemoveEvent = (): any => {
  form.value.banner = '';
};

const onRewardRemoveEvent = (): any => {
  form.value.reward = [];
};

const customBannerRequest = async (obj: UploadCustomRequestOptions) => {
  const uploadFile: any = await uploadService(obj);
  form.value.banner = uploadFile.url;
  formRefCustomValidate('banner');
};

const customRewardRequest = async (obj: UploadCustomRequestOptions) => {
  const uploadFile: any = await uploadService(obj);
  form.value.reward.push(uploadFile.url);
  formRefCustomValidate('reward');
};

function dateBookingDeadlineDisabled(ts: number) {
  return new Date(ts).getTime() < new Date().getTime() - 8.64e7;
}

function timeRangeTimeDisabled(ts: number) {
  return true;
}

function formRefCustomValidate(key: string) {
  formRef.value?.validate(null, rule => {
    return rule?.key === key;
  });
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  },
  typeFlag: {
    type: Number,
    default: 3
  }
});
const emit = defineEmits();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const formBannerList = ref<any>([]);
const formRewardList = ref<any>([]);

const title = computed(() => {
  if (props.typeFlag == 3) {
    return props.currentRow.id ? '编辑预约' : '新增预约';
  } else {
    return props.currentRow.id ? '编辑活动' : '新增活动';
  }
});
const confirmLoading = ref(false);
const disabledAll = ref(false);
watch(
  () => props.visible,
  n => {
    if (n) {
      reset();
      form.value.id = props.currentRow.id;
      form.value.name = props.currentRow.name;
      form.value.activityType = props.currentRow.activityType
        ? String(props.currentRow.activityType)
        : null!;
      form.value.peopleMax = props.currentRow.peopleMax;
      form.value.bookingDeadline = props.currentRow.bookingDeadline
        ? dayjs(props.currentRow.bookingDeadline).valueOf()
        : null!;
      rangeTime.value = props.currentRow.startTime
        ? [dayjs(props.currentRow.startTime).valueOf(), dayjs(props.currentRow.endTime).valueOf()]
        : null;
      form.value.freight = props.currentRow.freight;
      form.value.shortDesc = props.currentRow.shortDesc;
      form.value.isAutoStart = String(props.currentRow.isAutoStart);
      form.value.ruleType = String(props.currentRow.ruleType);
      form.value.coin = props.currentRow.coin;
      form.value.integral = props.currentRow.integral;
      form.value.banner = props.currentRow.banner;
      form.value.reward = props.currentRow.reward || [];
      form.value.detail = props.currentRow.detail || '';
      formBannerList.value = props.currentRow.banner
        ? [{ id: 'banner', status: 'finished', url: getUrl(props.currentRow.banner) }]
        : [];
      formRewardList.value = props.currentRow.reward?.map((v, i) => {
        return { id: i, url: getUrl(v), status: 'finished' };
      });
      disabledAll.value = false;
      // 编辑并且是上架状态
      if (props.currentRow.id && props.currentRow.onSale == 2) {
        disabledAll.value = true;
      }
    }
  }
);

function reset() {
  form.value = {
    id: undefined,
    name: '',
    activityType: '',
    peopleMax: null!,
    bookingDeadline: null!,
    freight: null!,
    shortDesc: '',
    isAutoStart: '',
    ruleType: '',
    coin: null!,
    integral: null!,
    banner: '',
    reward: [],
    detail: ''
  };
  rangeTime.value = null;
  formBannerList.value = [];
  formRewardList.value = [];
  formRef.value?.restoreValidation();
}

function handleSubmit() {
  formRef.value?.validate(errors => {
    if (!errors) {
      confirmLoading.value = true;
      if (props.typeFlag == 3) {
        getActivityBookingConfigList({
          ...form.value,
          activityType: Number(form.value.activityType),
          bookingDeadline: dayjs(form.value.bookingDeadline).format('YYYY-MM-DD HH:mm:ss'),
          startTime: dayjs(rangeTime.value![0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(rangeTime.value![1]).format('YYYY-MM-DD HH:mm:ss'),
          isAutoStart: Number(form.value.isAutoStart),
          ruleType: Number(form.value.ruleType)
        })
          .then(() => {
            message.success(form.value.id ? '编辑成功' : '新增成功');
            emit('confirm');
          })
          .finally(() => {
            confirmLoading.value = false;
          });
      } else {
        getActivityConfigList({
          ...form.value,
          activityType: props.typeFlag,
          bookingDeadline: '',
          startTime: dayjs(rangeTime.value![0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(rangeTime.value![1]).format('YYYY-MM-DD HH:mm:ss'),
          isAutoStart: Number(form.value.isAutoStart),
          ruleType: Number(form.value.ruleType)
        })
          .then(() => {
            message.success(form.value.id ? '编辑成功' : '新增成功');
            emit('confirm');
          })
          .finally(() => {
            confirmLoading.value = false;
          });
      }
    } else {
      message.error('请输入必填信息');
    }
  });
}

function handleCancel() {
  emit('handleCancel');
}
</script>

<style lang="less">
.formBigBoxModelInfo {
  margin-top: 18px;
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
