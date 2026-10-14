<template>
  <n-modal
    v-model:show="isVisible"
    title="用户详情"
    preset="dialog"
    style="width: 1200px; min-height: "
    class="operate-user-detail-modal"
  >
    <div class="flex">
      <div style="width: 70px; margin-right: 20px">
        <img :src="getUrl(detail.avator)" alt="" style="width: 100%" />
      </div>

      <div class="flex-1" style="margin-top: 20px">
        <div class="flex-c flex-1">
          <div class="w20">
            <label>用户名称：</label>
            <span class="value">{{ detail.username }}</span>
          </div>
          <div class="w20 flex-c">
            <template v-if="editMode">
              <label>性别：</label>
              <n-select
                v-model:value="detail.gender"
                :options="genders"
                clearable
                style="width: 120px"
                placeholder="请选择性别"
              />
            </template>
            <template v-else>
              <label>性别：</label>
              <span class="value">{{ detail.gender == 1 ? '男' : '女' }}</span>
            </template>
          </div>
          <div class="w20">
            <label>生日：</label>
            <span class="value">{{ detail.birthDay }}</span>
          </div>
          <div class="w20">
            <label>年龄：</label>
            <span class="value">{{ calculateAge(detail.birthDay) }}</span>
          </div>
          <div class="w20">
            <label>登录方式：</label>
            <span class="value">{{ detail.providerName }}</span>
          </div>
        </div>

        <div class="flex-c flex-1 mtb-2">
          <div class="w20">
            <label>用户ID：</label>
            <span class="value">{{ detail.Id }}</span>
          </div>
          <div class="w20">
            <template v-if="editMode">
              <label>身高：</label>
              <n-input
                v-model:value="detail.height"
                clearable
                style="width: 120px"
                placeholder="请输入身高"
              />
            </template>
            <template v-else>
              <label>身高：</label>
              <span class="value">{{ detail.height }}cm</span>
            </template>
          </div>
          <div class="w20">
            <template v-if="editMode">
              <label>体重：</label>
              <n-input
                v-model:value="detail.weight"
                clearable
                style="width: 120px"
                placeholder="请输入体重"
              />
            </template>
            <template v-else>
              <label>体重：</label>
              <span class="value">{{ detail.weight }}kg</span>
            </template>
          </div>
          <div class="w20">
            <label>注册天数：</label>
            <span class="value">{{ detail.registered_days }}</span>
          </div>
          <div class="w20">
            <label>累计充值金额($)：</label>
            <span class="value">{{ detail.totalRechargeAmount }}</span>
          </div>
        </div>

        <div class="flex-c flex-1 mb-2">
          <div class="w20">
            <label>积分总数：</label>
            <span class="value">{{ detail.integral }}</span>
          </div>
          <div class="w40">
            <label>累计在线时长：</label>
            <span class="value">{{ detail.onlineTotal }}</span>
          </div>
          <div class="w40">
            <label>发布动态数：</label>
            <span class="value">{{ detail.postCount }}</span>
          </div>
        </div>
        <div class="flex-c flex-1">
          <div class="w20">
            <label>互关好友：</label>
            <span class="value">{{ detail.mutualFollowersCount }}</span>
          </div>
          <div class="w20">
            <label>粉丝：</label>
            <span class="value">{{ detail.followerCount }}</span>
          </div>
          <div class="w20">
            <label>已关注：</label>
            <span class="value">{{ detail.followingCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="updates.length">
      <n-infinite-scroll
        style="height: 480px"
        :distance="200"
        @load="handleLoad"
      >
        <template v-for="(item, index) in updates" :key="index">
          <div style="border-bottom: 1px solid #f1f1f1; padding: 10px">
            <div class="title fw-bold">{{ item.title }}</div>
            <div class="content" v-html="item.content"></div>
            <div class="flex">
              <div class="flex-1">
                <template
                  v-for="(media, index) in item.mediaUrl?.split(',')"
                  :key="index"
                >
                  <img
                    v-if="isImage(media)"
                    class="imgs"
                    :src="getUrl(media)"
                    alt=""
                  />
                  <video
                    v-else-if="isVideo(media)"
                    class="videos"
                    :src="getUrl(media)"
                    controls
                  />
                </template>
              </div>

              <div style="width: 200px">
                {{ item.date }}
              </div>
            </div>
          </div>
        </template>
      </n-infinite-scroll>
    </div>

    <div class="footer flex-sb-c">
      <div class="hide">占位</div>

      <div>
        <n-button type="primary" class="mr-2" @click="onSave" v-if="editMode"
          >保存</n-button
        >
        <n-button @click="closeModal">取消</n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { editUser, detailUser, getPosts } from '@/api/operate/user';
import { getUrl, calculateAge, isEmpty, isImage, isVideo } from '@/utils/utils';
import { debounce } from 'lodash';

const props = defineProps({
  show: Boolean,
  editMode: Boolean,
});

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  },
});

const genders = ref([
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
]);

const detail0: any = defineModel('detail');
const detail: any = ref({});
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
const updates: any = ref([]);

watch(
  () => isVisible.value,
  async v => {
    if (v) {
      handleGetPosts();
      const userId: number = detail0.value.Id;
      const p1 = { userId };
      const [{ data }] = await Promise.all([detailUser(p1)]);
      console.log('data', data);
      detail.value = data;
    } else {
      reset();
    }
  }
);

async function handleGetPosts() {
  const userId: number = detail0.value.Id;
  const p = {
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    userId,
  };
  const { data } = await getPosts(p);
  updates.value = [...updates.value, ...data.list];
  paginationReactive.total = data.count;
}

const emit = defineEmits(['update:show', 'query']);

async function onSave() {
  const { gender, height, weight } = detail.value;
  console.log({ gender, height, weight });
  if (isEmpty(gender)) {
    return window.$message.error('请选择性别');
  }
  if (isEmpty(height)) {
    return window.$message.error('请填写身高');
  }
  if (isEmpty(weight)) {
    return window.$message.error('请填写体重');
  }
  const { Id, version } = detail.value;
  await editUser({
    Id,
    version,
    gender: +gender,
    height: +height,
    weight: +weight,
  });

  window.$message.success('编辑成功');
  closeModal();
  emit('query');
}

const handleLoad = debounce(function handleLoad() {
  console.log('到底了');
  const totalPage = +paginationReactive.total / +paginationReactive.pageSize;
  console.log('paginationReactive.page', paginationReactive.page);
  console.log('totalPage', totalPage);
  if (paginationReactive.page >= totalPage) {
    return window.$message.warning('没有更多了');
  }
  paginationReactive.page++;
  handleGetPosts();
}, 200);

function reset() {
  paginationReactive.page = 1;
  paginationReactive.pageSize = 10;
  paginationReactive.total = 0;
  detail.value = {};
  updates.value = [];
}

function closeModal() {
  isVisible.value = false;
}
</script>

<style lang="less" scoped>
.operate-user-detail-modal {
  .w20 {
    width: 20%;
  }
  .w40 {
    width: 40%;
  }
  .mtb-2 {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .mb-2 {
    margin-bottom: 20px;
  }

  .imgs {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .videos {
    width: 300px;
    height: 200px;
    margin-right: 20px;
  }

  .title {
    margin: 20px 0;
    font-weight: bold;
    font-size: 22px;
  }

  .content {
    margin: 10px 0;
  }
}
</style>
