<template>
  <PageLayout>
    <div class="user-admin">
      <header class="pl-5">
        <n-tabs animated :bar-width="0" v-model:value="searchForm.status">
          <n-tab-pane :name="1" tab="账号管理"></n-tab-pane>
          <n-tab-pane :name="2" tab="黑名单用户"> </n-tab-pane>
        </n-tabs>
      </header>

      <main class="pl-5 mt-1">
        <n-form
          style="margin-bottom: -24px"
          label-placement="left"
          label-align="right"
          ref="searchFormRef"
          inline
          :model="searchForm"
        >
          <n-form-item label="用户昵称">
            <n-input v-model:value="searchForm.nickname" />
          </n-form-item>
          <n-form-item label="用户ID">
            <n-input v-model:value="searchForm.id" />
          </n-form-item>
          <n-form-item label="注册时间">
            <n-date-picker
              v-model:value="rangeTime"
              :on-update:value="onRangeTime"
              type="datetimerange"
              clearable
              separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </n-form-item>
          <n-form-item label="登录方式">
            <n-select
              v-model:value="searchForm.providerName"
              :options="searchOptions.loginType"
              placeholder="请选择你的登录方式"
              clearable
              style="width: 220px"
            />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button attr-type="button" type="primary" @click="searchQuery"
                >查询</n-button
              >

              <n-button attr-type="button" type="primary" @click="resetForm"
                >重置</n-button
              >
            </n-space>
          </n-form-item>
        </n-form>

        <view class="hide mt-10"> 占位 </view>

        <n-data-table
          :single-line="false"
          :columns="columns"
          :data="tableData"
          :scroll-x="2000"
        />

        <Pagination
          v-model:total="paginationReactive.total"
          v-model:page="paginationReactive.page"
          v-model:limit="paginationReactive.pageSize"
          @pagination="query"
        />
      </main>
    </div>

    <DetailModal v-model:show="showDetailModal" :detail="currentRow" :editMode="editMode" @query="query" />
    <BuyQueryModal v-model:show="showBuyModal" :detail="currentRow" />
  </PageLayout>
</template>

<script setup lang="ts">
import { banUser, delUser, getList, openUser } from '@/api/operate/user';
import { defaultSearchForm, paginationReactive, createColumns } from './data';
import { forin } from '@/utils/utils';
import { useDialog, useMessage } from 'naive-ui';
import DetailModal from './components/DetailModal.vue';
import BuyQueryModal from './components/BuyQueryModal/index.vue';

const dialog = useDialog();
const message = useMessage();
const rangeTime: any = ref(null);
const tableData = ref([]);
const searchOptions = reactive({
  loginType: [
    {
      label: 'google',
      value: 'google',
    },
    {
      label: 'x',
      value: 'x',
    },
  ],
});
const searchForm: any = reactive({
  ...defaultSearchForm,
});
const showDetailModal = ref(false);
const showEditModal = ref(false);
const showBuyModal = ref(false);
const currentRow = ref({});
const editMode=ref(false)
provide('currentRow', currentRow);
watch(
  () => searchForm.status,
  () => {
    query();
  }
);
function resetForm() {
  forin(searchForm, defaultSearchForm);
  rangeTime.value = null;
  paginationReactive.page = 1;
  query();
}

const columns = createColumns({
  async handleEdit(row: any) {
    currentRow.value = row;
    editMode.value=true
    showDetailModal.value = true;
  },
  handleDetail(row) {
    editMode.value=false
    currentRow.value = row;
    showDetailModal.value = true;
    console.log('row', row)
  },
  handleDelete(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定删除[${row?.username ?? ''}]吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await delUser({ id: row.Id });
          message.success('删除成功');
          paginationReactive.page = 1;
          query();
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
  closeLogin(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定限制[${row?.username ?? ''}]登录吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await banUser({ id: row.Id });
          message.success('限制成功');
          paginationReactive.page = 1;
          query();
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
  openLogin(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定启用[${row?.username ?? ''}]登录吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await openUser({ id: row.Id });
          message.success('启用成功');
          paginationReactive.page = 1;
          query();
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
  handleBuyQuery(row: any) {
    currentRow.value=row
    showBuyModal.value=true
  },
});

function onRangeTime(value: number | null, formattedValue: string | null) {
  console.log('formattedValue', formattedValue);
  console.log('rangeTime', rangeTime);
  rangeTime.value = value;
  if (formattedValue?.length) {
    searchForm.startTime = formattedValue[0];
    searchForm.endTime = formattedValue[1];
  } else {
    searchForm.startTime = '';
    searchForm.endTime = '';
  }
}

const query = async () => {
  const res = await getList({
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    ...searchForm,
  });
  tableData.value = res.data.list;
  paginationReactive.total = res.data.count;
};


function searchQuery(){
  paginationReactive.page=1
  query()
}

onMounted(() => {
  query();
});
</script>

<style lang="less">
.user-admin {
  .n-tabs-tab__label {
    font-size: 18px;
  }
  .n-tabs-tab-pad {
    width: 72px;
  }
}
</style>
