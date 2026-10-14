<template>
  <div>
    <PageLayout>
      <template #searchForm>
        <n-form style="margin-bottom: -24px" label-placement="left" label-align="right" ref="searchFormRef" inline
          :model="searchForm">
          <n-form-item path="keywords" label="广告名称">
            <n-input v-model:value="searchForm.name" />
          </n-form-item>
          <n-form-item path="status" label="广告类型">
            <n-select v-model:value="searchForm.openType" :options="searchOptions.type" clearable
              style="width: 220px;" />
          </n-form-item>
          <n-form-item path="status" label="广告状态">
            <n-select v-model:value="searchForm.status" :options="searchOptions.status" clearable
              style="width: 220px;" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button attr-type="button" type="primary" @click="handleQuery">查询/刷新</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </template>
      <template #btnBar>
        <n-button type="primary" @click="pageNav.add()">
          <template #icon>
            <n-icon>
              <component :is="'antd-PlusOutlined'"></component>
            </n-icon>
          </template>
          新增
        </n-button>
      </template>
      <n-data-table :columns="columns" :data="listData" :single-line="false" :row-key="(row: any) => { return row.id }" />
      <Pagination v-model:total="paginationReactive.total" v-model:page="paginationReactive.page"
        v-model:limit="paginationReactive.size" @pagination="getListData" />
    </PageLayout>
    <n-modal v-model:show="pageNav.show" preset="dialog" :title="(formItem.id !== 0 ? '编辑' : '新增') + '广告'"
      style="width: 880px" @after-leave="pageNav.cancel">
      <n-form ref="formAddRef" :model="formItem" :rules="formRules" :label-width="120"
        require-mark-placement="right-hanging" style="margin-top: 28px" >
        <AddForm v-model:form-item="formItem" v-model:ad-position="adPosition"  />
      </n-form>
      <template #action>
        <n-button @click="pageNav.show = false"> 取消</n-button>
        <n-button type="primary" @click="submit"> 确认</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  createColumns,
  formItem,
  formRules,
  originFormItem,
  paginationReactive,
  searchForm,
  searchOptions
} from '@/view/operate/poster/data';
import { onMounted, reactive, ref } from 'vue';
import { config, del, getList, putOn, takeOff } from '@/api/operate/poster';
import { useMessage } from 'naive-ui';
import AddForm from '@/view/operate/poster/add-form.vue';
import { getDictSn } from "@/api/login";
import { getUrl } from '@/utils/utils';

const message = useMessage();

const listData = ref();
const adPosition = ref([])
const formAddRef = ref()
// 表格回调
const columns = createColumns({
  del: (row: any) => {
    del(row.id).then(response => {
      let newTotal = paginationReactive.total - 1
      let p = Math.max(Math.ceil(newTotal / paginationReactive.size), 1)
      paginationReactive.page = Math.min(p, paginationReactive.page)

      message.success((response as any).msg);
      getListData();
    });
  },
  edit: (row: any) => {
    pageNav.edit(row);
  },
  changeStatus: (row: any, status: number) => {
    if (status == 1) {
      putOn(row.id).then(response => {
        message.success((response as any).msg);
        getListData();
      });
    } else {
      takeOff(row.id).then(response => {
        message.success((response as any).msg);
        getListData();
      });
    }
  },
  adPosition
});
const $bus: any = inject("$mitt")
// 按钮导航
const pageNav = reactive({
  show: false,
  add: () => {
    pageNav.show = true;
  },
  edit: async (row: any) => {
    formItem.id = row.id;
    formItem.name = row.name;
    formItem.description = row.description;
    formItem.openType = row.openType;
    formItem.jumpUrl = row.jumpUrl;
    formItem.locationId = row.locationId + "";
    formItem.status = row.status;
    formItem.sortId = row.sortId;
    pageNav.show = true;
    const picture = row.picture?.split(',')?.map((item, index) => ({
      url: getUrl(item),
      id: index,
      batchId: index,
      status: 'finished',
    }));
    await nextTick()
    $bus.emit('update_picture', picture)

  },
  cancel: () => {
    pageNav.show = false;
    Object.assign(formItem, originFormItem);
  }
});

const submit = () => {
  formAddRef.value?.validate(errors => {
    if (!errors) {
      config(formItem).then(response => {
        message.success((response as any).msg);
        pageNav.cancel();
        getListData();
      });
    } else {
      message.error('请按要求填写内容');
    }
  });
};

const handleQuery = () => {
  paginationReactive.page = 1;
  getListData();
};

const getListData = () => {
  getList({
    ...searchForm,
    page: paginationReactive.page,
    pageSize: paginationReactive.size,
  }).then(result => {
    listData.value = result.data.list ? result.data.list : [];
    paginationReactive.total = result.data.count;
  });
};

// 在组件挂载后执行的逻辑
onMounted(() => {
  getDictSn("AD_POSITIONS").then(response => {
    adPosition.value = response.data.list
  })

  getListData();
});
</script>
