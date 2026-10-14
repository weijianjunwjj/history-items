<template>
  <div>
    <PageLayout>
      <template #searchForm>
        <n-form
            style="margin-bottom: -24px"
            label-placement="left"
            label-align="right"
            :show-label="false"
            ref="searchFormRef"
            inline
            :model="searchForm"
        >
          <n-select
              v-model:value="searchForm.status"
              :options="searchOptions.status"
              clearable
              style="width: 120px; margin-right: 8px"
          />
          <n-select
              v-model:value="searchForm.type"
              :options="searchOptions.type"
              clearable
              @update:value="handleChangeType"
              style="width: 120px; margin-right: 8px"
          />
          <n-form-item path="keywords">
            <n-input v-model:value="searchForm.keywords"/>
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button attr-type="button" type="primary" @click="handleQuery">查询/刷新</n-button>
              <n-button attr-type="button" strong secondary type="warning" @click="resetQuery">重置</n-button>
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
      <n-data-table
          :columns="columns"
          :data="listData"
          :single-line="false"
          :row-key="(row: any) => {return row.id}"
      />
      <Pagination
          v-model:total="paginationReactive.total"
          v-model:page="paginationReactive.page"
          v-model:limit="paginationReactive.size"
          @pagination="getListData"
      />
    </PageLayout>
    <n-modal
        v-model:show="pageNav.show"
        preset="dialog"
        :title="(formItem.id !== 0 ? '编辑' : '新增') + '用户'"
        style="width: 680px"
        @after-leave="pageNav.cancel"
    >
      <n-form
          ref="formAddRef"
          :model="formItem"
          :rules="formRules"
          label-placement="left"
          :label-width="120"
          require-mark-placement="right-hanging"
          style="margin-top: 28px"
      >
        <AddForm v-model:form-item="formItem" v-model:group-list="groupList"/>
      </n-form>
      <template #action>
        <n-button @click="pageNav.cancel"> 取消</n-button>
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
  groupList,
  originFormItem,
  paginationReactive,
  searchForm,
  searchOptions
} from '@/view/system/user/data';
import {onMounted, reactive, ref} from 'vue';
import {changeStatus, config, del, getGroups, getList} from '@/api/system/user';
import {useMessage} from 'naive-ui';
import AddForm from '@/view/system/user/add-form.vue';

const message = useMessage();

// 表格回调
const columns = createColumns({
  del: (row: any) => {
    del(row.id).then(response => {
      message.success((response as any).msg);
      getListData();
    });
  },
  edit: (row: any) => {
    pageNav.edit(row);
  },
  changeStatus: (row: any, status: number) => {
    changeStatus(status, row.id).then(response => {
      message.success((response as any).msg);
      getListData();
    });
  }
});

// 按钮导航
const pageNav = reactive({
  show: false,
  add: () => {
    getGroups({}).then(response => {
      groupList.info = response.data.list;
      pageNav.show = true;
    });
  },
  edit: (row: any) => {
    formItem.id = row.id;
    formItem.nickname = row.nickname;
    formItem.username = row.username;
    formItem.group_id = row.group_id;
    formItem.password = 'UsesOldPwd';
    getGroups({}).then(response => {
      groupList.info = response.data.list;
      pageNav.show = true;
    });
  },
  cancel: () => {
    pageNav.show = false;
    Object.assign(formItem, originFormItem);
  }
});

const resetQuery = () => {
  searchForm.status = null
  searchForm.type = null
  searchForm.keywords = ""
  getListData();
}

const handleChangeType = () => {
  searchForm.keywords = ""
}

const submit = () => {
  config(formItem).then(response => {
    message.success((response as any).msg);
    pageNav.cancel();
    getListData();
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
    nickname: searchForm.type == 2 ? searchForm.keywords : null,
    username: searchForm.type == 1 ? searchForm.keywords : null
  }).then(result => {
    listData.value = result.data.list ? result.data.list : [];
    paginationReactive.total = result.data.count;
  });
};

const listData = ref();

// 在组件挂载后执行的逻辑
onMounted(() => {
  getListData();
});
</script>
