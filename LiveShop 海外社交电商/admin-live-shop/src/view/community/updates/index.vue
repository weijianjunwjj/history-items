<template>
  <PageLayout>
    <template #searchForm>
      <n-form style="margin-bottom: -24px" label-placement="left" label-align="right" ref="searchFormRef" inline
        :model="forms">
        <n-form-item label="动态标题">
          <n-input v-model:value="forms.title" clearable placeholder="请输入查询的动态标题" />
        </n-form-item>
        <n-form-item label="话题">
          <n-input v-model:value="forms.topic" clearable placeholder="请输入查询的话题" />
        </n-form-item>
        <n-form-item label="发布时间">
          <n-date-picker v-model:value="rangeTime" :on-update:value="onRangeTime" type="datetimerange" clearable separator="~" start-placeholder="开始时间"
            end-placeholder="结束时间" />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button attr-type="button" type="primary" @click="searchQuery">查询</n-button>
            <n-button attr-type="button" type="primary" @click="resetForm">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </template>
    <template #btnBar>
      <n-button type="primary" @click="openModal">新增动态</n-button>
    </template>
    <n-data-table :single-line="false" :columns="columns" :data="data" />
    <Pagination v-model:total="paginationReactive.total" v-model:page="paginationReactive.page"
      v-model:limit="paginationReactive.size" @pagination="query" />
    <AddModal v-model:show="showSpecModal" :initialData="initialData" :edit="editNum" :detail="detail"
       @query="query" />
    <Detail v-model:show="showDetail" :currentRow="currentRow" />
  </PageLayout>
</template>

<script setup lang="ts">
import {  paginationReactive, createColumns } from './data';
import { useMessage, useDialog, NButton } from 'naive-ui';
import {
  getUpdatesList,
  delUpdates
} from '@/api/community/updates';
import AddModal from './add-modal.vue';
import Detail from './detail.vue';

const message = useMessage();
const rangeTime = ref(null);
const dialog = useDialog();
const showDetail=ref(false)
// ---data---
const data = ref([]);
const forms: any = reactive({
  title:'',
  topic:'',
})
const currentRow = ref({});
const editNum = ref(0);
const detail = ref({});
const columns = createColumns({
  async handleEdit (row: any) {
    initialData.value=row
    editNum.value = 1;
    showSpecModal.value = true;
  },
  handleDetail(row){
    currentRow.value=row
    console.log('row', row)
    showDetail.value=true
  },
  handleDelete (row: any) {
    dialog.warning({
      title: '警告',
      content: `确定删除[${row?.specName ?? ''}]吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await delUpdates({ id: row.id });
          message.success('删除成功');
          query();
        } catch (error) { }
      },
      onNegativeClick: () => { },
    });
  },
});

const initialData=ref({
  mediaType: 1,
})

function onRangeTime(value: number | null, formattedValue: string | null){
  console.log('formattedValue', formattedValue)
  console.log('rangeTime', rangeTime)
  rangeTime.value=value
  if(formattedValue?.length){
    forms.startTime=formattedValue[0]
    forms.endTime=formattedValue[1]
  }else{
    forms.startTime = '';
    forms.endTime = '';
  }
 
}

// 新增弹窗
const showSpecModal = ref(false);

const openModal = () => {
  showSpecModal.value = true;
  editNum.value = 0;
};

function resetForm () {
  forms.title = ''
  forms.topic = ''
  forms.startTime = ''
  forms.endTime = ''
  rangeTime.value=null
  paginationReactive.page = 1
  query()
  console.log('forms', forms)
}

const query = async () => {
  const res = await getUpdatesList({
    page: paginationReactive.page,
    pageSize: paginationReactive.size,
    ...forms
  });
  data.value = res.data.list;
  paginationReactive.total = res.data.count;
};

function searchQuery(){
  paginationReactive.page=1
  query()
}

onMounted(async () => {
  query();
});


</script>

<style lang="less" scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
