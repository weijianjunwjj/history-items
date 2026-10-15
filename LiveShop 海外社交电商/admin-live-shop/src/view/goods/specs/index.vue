<template>
  <PageLayout>
    <n-form ref="formRef" :model="form" :rules="rules" label-placement="left" :label-width="100">
      <n-form-item label="商品类目" path="categoryId">
        <n-cascader
          :value="form.categoryId"
          :options="categoryOptions"
          :disabled="initializing || saving || initializationFailed"
          placeholder="请选择商品类目"
          check-strategy="child"
          clearable
          filterable
          @update:value="handleCategoryChange"
        />
      </n-form-item>

      <n-alert v-if="initializationFailed" type="error" class="load-error">
        类目或规格名称加载失败。
        <n-button text type="primary" @click="initialize">重新加载</n-button>
      </n-alert>
      <n-alert v-else-if="loadFailed" type="error" class="load-error">
        规格加载失败，请重新加载后再编辑。
        <n-button text type="primary" :disabled="loading || saving" @click="retryLoad">重新加载</n-button>
      </n-alert>

      <n-spin :show="loading">
        <n-empty
          v-if="!form.specs.length && !loading && !initializationFailed && !loadFailed"
          :description="form.categoryId === null ? '请先选择商品类目' : '暂无规格，点击添加规格开始配置'"
          class="empty-state"
        />
        <n-scrollbar style="max-height: 700px">
          <n-card v-for="(spec, specIndex) in form.specs" :key="spec.key" size="small" class="spec-item">
            <div class="spec-header">
              <n-text strong>规格 {{ specIndex + 1 }}</n-text>
              <n-button text type="error" :disabled="editorDisabled" @click="removeSpec(specIndex)">
                删除规格
              </n-button>
            </div>
            <n-form-item label="规格名称" :path="`specs.${specIndex}.dictionaryId`">
              <div class="spec-name">
                <n-select
                  v-model:value="spec.dictionaryId"
                  :options="getSpecOptions(spec.dictionaryId)"
                  :disabled="editorDisabled"
                  placeholder="请选择规格名称"
                  class="spec-select"
                />
                <n-button text type="primary" :disabled="editorDisabled" @click="addSpecValue(spec)">
                  添加规格值
                </n-button>
              </div>
            </n-form-item>
            <div class="spec-values-row">
              <n-text class="spec-values-label">规格值</n-text>
              <div class="spec-values">
                <n-form-item
                  v-for="(value, valueIndex) in spec.specVal"
                  :key="value.key"
                  :path="`specs.${specIndex}.specVal.${valueIndex}.label`"
                  :show-label="false"
                >
                  <div class="spec-value-item">
                    <n-input v-model:value="value.label" :disabled="editorDisabled" placeholder="请输入规格值" />
                    <n-button
                      text
                      type="error"
                      :disabled="editorDisabled || spec.specVal.length === 1"
                      :aria-label="`删除第 ${specIndex + 1} 个规格的第 ${valueIndex + 1} 个规格值`"
                      @click="removeSpecValue(spec, valueIndex)"
                    >
                      <n-icon size="18"><RemoveCircleOutline /></n-icon>
                    </n-button>
                  </div>
                </n-form-item>
              </div>
            </div>
          </n-card>
        </n-scrollbar>
      </n-spin>

      <div v-if="form.categoryId !== null && !initializationFailed" class="spec-actions">
        <n-button type="primary" :disabled="!canAddSpec" @click="addSpec">添加规格</n-button>
        <n-button v-if="form.specs.length" type="primary" :loading="saving" :disabled="editorDisabled" @click="onSave">
          保存
        </n-button>
      </div>
    </n-form>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RemoveCircleOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { getCategory } from '@/api/goods/category';
import { add, edit, fetchList, getSpecsNames } from '@/api/goods/specs';
import {
  createSpec,
  createSpecValue,
  getSpecFormError,
  getSpecNameError,
  toCategoryOptions,
  toSpecDrafts,
  toSpecPayload,
} from './data';
import type { CategoryOption, SpecDraft, SpecForm, SpecNameOption } from './data';

const message = useMessage();
const formRef = ref<FormInst | null>(null);
const form = reactive<SpecForm>({ categoryId: null, specs: [] });
const categoryOptions = ref<CategoryOption[]>([]);
const specNames = ref<SpecNameOption[]>([]);
const initializing = ref(true);
const initializationFailed = ref(false);
const loading = ref(false);
const loadFailed = ref(false);
const saving = ref(false);
const hasExistingSpecs = ref(false);
const loadedCategoryId = ref<number | null>(null);
let loadVersion = 0;
let disposed = false;

const editorDisabled = computed(() => initializing.value || loading.value || saving.value || loadFailed.value);
const canAddSpec = computed(() =>
  !editorDisabled.value && form.categoryId !== null && loadedCategoryId.value === form.categoryId && form.specs.length < specNames.value.length
);
const selectedIds = computed(() => new Set(form.specs.map(spec => spec.dictionaryId)));
const getSpecOptions = (currentId: number | null) => specNames.value.map(option => ({
  ...option,
  disabled: option.value !== currentId && selectedIds.value.has(option.value),
}));

const rules = computed<FormRules>(() => {
  const result: FormRules = {
    categoryId: { required: true, type: 'number', message: '请选择商品类目', trigger: 'change' },
  };
  form.specs.forEach((spec, index) => {
    result[`specs.${index}.dictionaryId`] = {
      trigger: 'change',
      validator: () => {
        const error = getSpecNameError(form, specNames.value, index);
        return error ? new Error(error) : true;
      },
    };
    spec.specVal.forEach((_, valueIndex) => {
      result[`specs.${index}.specVal.${valueIndex}.label`] = {
        trigger: ['input', 'blur'],
        validator: (_rule, value: string) => value?.trim() ? true : new Error('请输入规格值'),
      };
    });
  });
  return result;
});

// 业务错误已由 HTTP 拦截器提示；页面补充网络或数据格式错误。
function reportError(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'msg' in error) return;
  message.error(fallback);
}

async function initialize() {
  initializing.value = true;
  initializationFailed.value = false;
  try {
    const [categories, names] = await Promise.all([
      getCategory({ isAll: 1 }),
      getSpecsNames('GOODS_TYPE'),
    ]);
    if (disposed) return;
    categoryOptions.value = toCategoryOptions(categories.data.list);
    specNames.value = names.data.list.map((item: { label: string; value: string | number }) => ({
      label: item.label,
      value: Number(item.value),
    }));
  } catch (error) {
    if (disposed) return;
    initializationFailed.value = true;
    reportError(error, '类目或规格名称加载失败，请重试');
  } finally {
    if (!disposed) initializing.value = false;
  }
}

async function loadSpecs(categoryId: number, keepDraft = false) {
  const version = ++loadVersion;
  loading.value = true;
  loadFailed.value = false;
  loadedCategoryId.value = null;
  if (!keepDraft) {
    form.specs = [];
    hasExistingSpecs.value = false;
  }
  try {
    const { data } = await fetchList(categoryId);
    if (disposed || version !== loadVersion || categoryId !== form.categoryId) return;
    const specs = toSpecDrafts(data);
    form.specs = specs;
    hasExistingSpecs.value = specs.length > 0;
    loadedCategoryId.value = categoryId;
    await nextTick();
    formRef.value?.restoreValidation();
  } catch (error) {
    if (disposed || version !== loadVersion) return;
    loadFailed.value = true;
    reportError(error, '规格加载失败，请重试');
  } finally {
    if (!disposed && version === loadVersion) loading.value = false;
  }
}

function handleCategoryChange(value: string | number | null) {
  if (saving.value) return;
  form.categoryId = value === null ? null : Number(value);
  formRef.value?.restoreValidation();
  if (form.categoryId !== null) {
    void loadSpecs(form.categoryId);
  } else {
    ++loadVersion;
    form.specs = [];
    loadedCategoryId.value = null;
    hasExistingSpecs.value = false;
    loadFailed.value = false;
    loading.value = false;
  }
}

function retryLoad() {
  if (form.categoryId !== null && !loading.value && !saving.value) {
    void loadSpecs(form.categoryId, true);
  }
}

function addSpec() {
  if (canAddSpec.value) form.specs.push(createSpec());
}

function removeSpec(index: number) {
  if (!editorDisabled.value) form.specs.splice(index, 1);
}

function addSpecValue(spec: SpecDraft) {
  if (!editorDisabled.value) spec.specVal.push(createSpecValue());
}

function removeSpecValue(spec: SpecDraft, index: number) {
  if (!editorDisabled.value && spec.specVal.length > 1) spec.specVal.splice(index, 1);
}

async function onSave() {
  if (editorDisabled.value || form.categoryId === null || loadedCategoryId.value !== form.categoryId) return;
  // 在 await validate 之前加锁，校验期间的重复点击也不会重复提交。
  saving.value = true;
  try {
    try {
      await formRef.value?.validate();
    } catch {
      message.warning('请检查规格名称和规格值');
      return;
    }
    const validationError = getSpecFormError(form, specNames.value);
    if (validationError) {
      message.warning(validationError);
      return;
    }
    const categoryId = form.categoryId;
    const isEdit = hasExistingSpecs.value;
    await (isEdit ? edit : add)(toSpecPayload(form, isEdit));
    if (disposed) return;
    hasExistingSpecs.value = true;
    message.success(isEdit ? '编辑成功！' : '添加成功！');
    // 回读服务器 ID；回读失败时阻止再次提交，保留草稿供重新加载。
    await loadSpecs(categoryId, true);
  } catch (error) {
    if (!disposed) reportError(error, '保存失败，请重试');
  } finally {
    if (!disposed) saving.value = false;
  }
}

onMounted(initialize);
onBeforeUnmount(() => {
  disposed = true;
  ++loadVersion;
});
</script>

<style lang="less" scoped>
.load-error { margin-bottom: 16px; }
.empty-state { padding: 48px 0; }
.spec-item {
  margin-bottom: 16px;
}
.spec-header, .spec-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.spec-header { margin-bottom: 16px; }
.spec-name, .spec-value-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.spec-name { flex-wrap: wrap; }
.spec-select { width: 200px; max-width: 100%; }
.spec-values-row { display: flex; }
.spec-values-label { flex: 0 0 100px; padding-top: 6px; }
.spec-values {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 0 12px;
  flex: 1;
  min-width: 0;
}
.spec-value-item :deep(.n-input) { flex: 1; min-width: 0; }
.spec-actions { margin-top: 16px; }
@media (max-width: 600px) {
  .spec-values-row { flex-direction: column; }
  .spec-values-label { flex-basis: auto; margin-bottom: 8px; }
}
</style>
