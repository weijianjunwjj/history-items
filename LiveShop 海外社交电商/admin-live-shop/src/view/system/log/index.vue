<template>
  <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
    <n-grid-item span="24 m:24 l:24">
      <n-space :wrap-item="false">
        <n-card content-style="padding: 15px;">
          <n-form
            style="margin-bottom: -24px"
            label-placement="left"
            label-align="right"
            :show-label="false"
            ref="searchFormRef"
            inline
            :model="form"
          >
            <n-select
              v-model:value="form.type"
              :options="searchOptions"
              clearable
              style="width: 120px; margin-right: 8px"
            />
            <n-form-item path="keyword">
              <n-input v-model:value="form.keyword" />
            </n-form-item>
            <n-form-item>
              <n-space>
                <n-button attr-type="button" type="primary" @click="getListData"
                  >查询/刷新</n-button
                >
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
        <n-card content-style="padding:15px">
          <n-data-table
            :columns="columns"
            :data="listData"
            :single-line="false"
            :row-key="(row: any) => {return row.id}"
          />
          <Pagination
            v-model:total="paginationReactive.itemCount"
            v-model:page="paginationReactive.page"
            v-model:limit="paginationReactive.pageSize"
            @pagination="getListData"
          />
        </n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import {
  createColumns,
  searchOptions,
  paginationReactive,
} from '@/view/system/log/data';
import { reactive, onMounted, ref } from 'vue';
import { getList, del } from '@/api/system/log';
import { useMessage } from 'naive-ui';

const message = useMessage();

const columns = createColumns((row: any) => {
  del(row.id).then(response => {
    let newTotal = paginationReactive.itemCount - 1;
    console.log('newTotal', newTotal)
    let p = Math.max(Math.ceil(newTotal / paginationReactive.pageSize), 1);
    console.log('p', p)
    paginationReactive.page = Math.min(p, paginationReactive.page);
    console.log('paginationReactive.page ', paginationReactive.page )
    message.success((response as any).msg);
    getListData();
  });
});

const form = reactive({
  type: null,
  keyword: '',
});

const getListData = () => {
  getList({
    ...form,
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
  }).then(result => {
    listData.value = result.data.list;
    paginationReactive.itemCount = result.data.count;
  });
};

const listData = ref();

// 在组件挂载后执行的逻辑
onMounted(async () => {
  getListData();
});
</script>
