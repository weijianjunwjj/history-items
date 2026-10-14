<template>
  <n-modal
    v-model:show="isVisible"
    transform-origin="center"
    preset="dialog"
    title=""
    style="width: 900px"
    :show-icon="false"
    @close="handleCancel"
  >
    <div>
      <n-row>
        <n-col :span="12">
          <label>动态标题：</label>
          <span>{{ form.title }}</span>
        </n-col>
        <n-col :span="12">
          <label>话题：</label>
          <span>{{ form.linkTopic }}</span>
        </n-col>
      </n-row>
      <div class="hide">占位</div>
      <n-row>
        <n-col :span="24">
          <label>动态内容：</label>
          <span>{{ form.content }}</span>
        </n-col>
      </n-row>
      <div class="hide">占位</div>
      <n-row>
        <n-col :span="24">
          <n-form-item
            label="图片内容："
            path="mediaUrl"
            class="mediaUrl-formitem"
          >
            <template v-if="form.mediaType == 1">
              <img
                v-for="(item, index) in form.mediaUrl?.split(',')"
                :key="index"
                class="imgs"
                :src="getUrl(item)"
                alt=""
              />
            </template>
            <template v-else>
              <video
                v-for="(item, index) in form.mediaUrl?.split(',')"
                :key="index"
                class="imgs"
                :src="getUrl(item)"
              />
            </template>
          </n-form-item>
        </n-col>
      </n-row>
      <div class="hide">占位</div>

      <n-row>
        <n-col :span="12">
          <label>点赞数：</label>
          <span>{{ form.likeCount }}</span>
        </n-col>
        <n-col :span="12" >
          <label>评论数：</label>
          <span>{{ form.commentCount }}</span>
        </n-col>
      </n-row>
      <div class="hide">占位</div>

      <n-row>
        <n-col :span="12">
          <label>发布人：</label>
          <span>{{ form.userName }}</span>
        </n-col>
        <n-col :span="12">
          <label>发布时间：</label>
          <span>{{ form.createdAt }}</span>
        </n-col>
      </n-row>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { getUrl } from '@/utils/utils';

const form: any = ref({});

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  currentRow: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits();

// 控制模态框显示
const isVisible = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

function handleCancel() {
  emit('update:visible', false);
  emit('cancel');
}

watch(
  () => props.currentRow,
  _currentRow => {
    const currentRow={..._currentRow}
    currentRow.urls = currentRow.mediaUrl?.split(',')?.filter(v => v);
    currentRow.linkTopic = currentRow?.linkTopic?.join(',');
    form.value = { ...currentRow };
  }
);

</script>

<style lang="less" scoped>
.imgs {
  width: 100px;
  height: 100px;
}
</style>
