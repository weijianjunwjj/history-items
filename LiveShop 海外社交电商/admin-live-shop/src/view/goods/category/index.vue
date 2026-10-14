<template>
  <PageLayout>
    <template #btnBar>
      <div class="search mb-3">
        <n-button type="primary" @click="addCategoryModal(0)">新增类目</n-button>
      </div>
    </template>

    <div class="table">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="tableLoading"
        :pagination="false"
        :bordered="false"
      />
      <Pagination
        v-model:total="pagination.total"
        v-model:page="pagination.page"
        v-model:limit="pagination.limit"
        @pagination="queryTable"
      />

      <!-- 新增类目 / 编辑类目 弹窗 -->
      <n-modal
        v-model:show="showAddCategoryModal"
        :title="modalTitle"
        :style="{ width: '400px' }"
        preset="dialog"
      >
        <n-form ref="formRef" :model="form" :rules="rules">
          <n-form-item label="类目名称" path="name" required>
            <n-input
              v-model:value="form.name"
              :placeholder="modalPlaceholder"
              maxlength="20"
              show-count
            />
          </n-form-item>
        </n-form>
        <template #action>
          <n-space justify="end">
            <n-button @click="handleCancel">取消</n-button>
            <n-button type="primary" @click="handleSave">保存</n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- 删除确认弹窗 -->
      <n-modal
        v-model:show="showDeleteConfirmModal"
        preset="dialog"
        title="确认"
        content="你确认要删除吗?"
        positive-text="确认"
        negative-text="取消"
        @positive-click="submitCallback"
        @negative-click="cancelCallback"
      />
    </div>
  </PageLayout>
</template>

<script lang="ts" setup>
import { NButton, useMessage } from 'naive-ui';
import {
  QueryParams,
  addCategory,
  delCategory,
  editCategory,
  getCategory,
} from '@/api/goods/category';
import {createColumns, ProductCategory,pagination} from "@/view/goods/category/data";
import { cloneDeep } from 'lodash';

const showAddCategoryModal = ref(false); // 控制新增/编辑弹窗的显示
const showDeleteConfirmModal = ref(false); // 控制删除确认弹窗的显示
const isEditMode = ref(false); // 用于区分当前是编辑还是新增
const currentRow = ref<ProductCategory>({
  parentId: 0,
  id: 0,
  name: '',
  goodsNum: 0,
  createdAt: '',
}); // 存储当前操作的行数据
const tableLoading = ref(true);

const form = reactive({
  name: '',
});


const modalTitle = ref('');
const modalPlaceholder = ref('');

const rules = {
  name: {
    required: true,
    message: '类目名称不能为空',
    trigger: 'blur',
  },
};

const formRef = ref();
const message = useMessage();

const tableData = ref<ProductCategory[]>([]);



watch(() => showAddCategoryModal.value, (_showAddCategoryModal) => {
  if(!_showAddCategoryModal){
    form.name=''
  }
})

function addCategoryModal(parentId) {
  currentRow.value.parentId = parentId;
  form.name=''
  modalTitle.value = '新增类目';
  showAddCategoryModal.value = true;
  modalPlaceholder.value = '请输入商品类目名称';
}

function edit(row: ProductCategory) {
  isEditMode.value = true; // 设置为编辑模式
  currentRow.value = row; // 记录当前编辑的行
  form.name = row.name; // 填充表单数据
  showAddCategoryModal.value = true; // 显示弹窗
  modalTitle.value = '编辑类目';
}

function handleCancel() {
  showAddCategoryModal.value = false; // 关闭新增/编辑弹窗
}

async function handleSave() {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if (isEditMode.value) {
        await editCategory({
          ...form,
          id: currentRow.value?.id,
          parentId: currentRow.value?.parentId,
        });
        message.success('编辑成功');
        await queryTable();
      } else {
        await addCategory({
          ...form,
          parentId: currentRow.value.parentId,
        });
        message.success('新增成功');
        await queryTable();
      }
      showAddCategoryModal.value = false; // 保存后关闭弹窗
    } else {
      message.error('请检查输入项');
    }
  });
}

async function submitCallback() {
  if (currentRow.value) {
    showDeleteConfirmModal.value = false; // 确认删除后关闭弹窗
    const id = currentRow.value.id;
    await delCategory({ id });
    message.success('删除成功');
    queryTable();
  }
}

function cancelCallback() {
  message.info('取消删除');
  showDeleteConfirmModal.value = false; // 取消删除后关闭弹窗
}

const columns = createColumns((row: any) => {
  isEditMode.value = false; // 设置为新增模式
  currentRow.value = cloneDeep(row) ; // 记录当前父级
  currentRow.value.parentId = row.id;
  showAddCategoryModal.value = true; // 显示弹窗
  modalTitle.value = '新增子级类目';
  modalPlaceholder.value = '请输入商品子级类目名称';
}, (row: any) => {
  isEditMode.value = true; // 设置为编辑模式
  currentRow.value = row; // 记录当前编辑的行
  form.name = row.name; // 填充表单数据
  showAddCategoryModal.value = true; // 显示弹窗
  modalTitle.value = '编辑类目';
}, (row: any) => {
  currentRow.value = row; // 记录当前要删除的行
  showDeleteConfirmModal.value = true; // 显示删除确认对话框
});


const queryTable = async () => {
  const { data } = await getCategory({ ...pagination });
  data.list.forEach(item => (item.key = item.id));
  tableData.value = data.list;
  pagination.total = data.count;

  tableLoading.value = false;
};

onMounted(() => {
  queryTable();
});
</script>
