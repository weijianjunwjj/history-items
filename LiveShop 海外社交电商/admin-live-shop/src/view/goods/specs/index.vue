<template>
  <PageLayout>
    <n-form
      ref="specFormaaa"
      :model="specForm"
      label-placement="left"
      label-width="100"
    >
      <!-- 商品类目 -->
      <n-form-item label="商品类目" path="categoryId">
        <n-cascader
          v-model:value="categoryId"
          placeholder="请选择商品类目"
          :expand-trigger="hoverTrigger ? 'hover' : 'click'"
          :options="categorys"
          :check-strategy="checkStrategyIsChild ? 'child' : 'all'"
          :show-path="showPath"
          :filterable="filterable"
          @update:value="handleUpdateValue"
        />
      </n-form-item>

      <n-scrollbar style="max-height: 700px" trigger="none">
        <!-- 规格列表 -->
        <div
          v-for="(specItem, specIndex) in spec"
          :key="specIndex"
          class="spec-item"
        >
          <n-button type="error" class="del-btn" @click="removeSpec(specIndex)"
            >删除</n-button
          >

          <n-form-item label="规格名称" path="specName">
            <n-select
              v-model:value="specItem.dictionaryId"
              placeholder="请选择规格名称"
              :options="specsNames"
              class="mr-4"
              style="width: 200px"
              :on-update:value="
                (id, option) => onUpdateSelectedSpec(id, option, specIndex)
              "
            />
            <n-button text type="primary" @click="addSpecValue(specIndex)"
              >添加规格值</n-button
            >
          </n-form-item>

          <!-- 规格值 -->
          <n-form-item label="规格值" path="specValues">
            <div class="spec-value">
              <div
                v-for="(value, valueIndex) in spec[specIndex].specVal"
                :key="valueIndex"
                class="spec-value-item mr-1"
              >
                <n-input
                  v-model:value="value.label"
                  placeholder="请输入规格值"
                />
              </div>
            </div>

            <n-button
              text
              type="error"
              @click="removeSpecValue(specIndex)"
              class="ml-1"
            >
              <n-icon size="18"><RemoveCircleOutline /></n-icon>
            </n-button>
          </n-form-item>
        </div>
      </n-scrollbar>

      <!-- 添加规格按钮 -->
      <div class="flex-sb-c">
        <n-button
          type="primary"
          @click="addSpec"
          v-if="categoryId"
          :disabled="curSpecCount >= specMax"
          >添加规格</n-button
        >

        <n-button
          type="primary"
          @click="onSave"
          :disabled="btnDisabled"
          v-if="spec.length > 0"
          >保存</n-button
        >
      </div>
    </n-form>

    <!--     
    <AddModal
      v-model:show="showSpecModal"
      :initialData="specData"
      :edit="editNum"
      :detail="detail"
      @save="handleSave"
      @edit="handleEdit"
    /> -->
  </PageLayout>
</template>

<script setup lang="ts">
import { RemoveCircleOutline } from '@vicons/ionicons5';
import _, { debounce } from 'lodash';
import { CascaderOption, useMessage } from 'naive-ui';
import { getCategory } from '../../../api/goods/category';
import {
  add,
  del,
  edit,
  fetchList,
  getSpecsNames,
} from '../../../api/goods/specs';

const categorys = ref([]);
const specsNames = ref([]);
const edits = ref(0);
const btnDisabled = ref(false);
const message = useMessage();
// 已禁用选项的ID数组
let disabledArray: any = [];
// 表单数据
const specForm: any = reactive({
  categoryId: '',
  spec: [],
});

const spec = ref([]);
const categoryId = ref();

watch(
  () => specForm.spec,
  _spec => {
    spec.value = _spec;
  },
  { deep: true }
);
watch(
  () => specForm.categoryId,
  _categoryId => {
    categoryId.value = _categoryId;
  },
  { deep: true }
);

// 监听 spec 数组中是否有 specVal 为空数组的情况
watch(
  () => spec.value.map((item: any) => item.specVal),
  newVals => {
    if (
      newVals.some(specVal => {
        console.log('specVal', specVal);
        return (
          Array.isArray(specVal) &&
          (specVal.length === 0 ||
            specVal.every(specV => {
              console.log('specV', specV);
              return specV.label == '';
            }))
        );
      })
    ) {
      console.log('存在 specVal 为空数组的情况');
      btnDisabled.value = true;
    } else {
      btnDisabled.value = false;
    }
  },
  { deep: true }
);

// 当初始数据发生变化时更新表单
// watch(
//   () => props.initialData,
//   newData => {
//     if (newData) {
//       specForm.categoryId = newData.categoryId;
//       specForm.spec = newData.spec;
//     }
//   },
//   { immediate: true }
// );

// 添加规格
const addSpec = () => {
  console.log('specForm', specForm);

  if (!specForm.spec) {
    specForm.spec = [];
  }
  specForm.spec.push({
    dictionaryId: '',
    specVal: [{ label: '', id: 0 }],
  });
};

// 删除规格
const removeSpec = async index => {
  const target = specForm.spec[index];
  console.log('target', target);
  specForm.spec.splice(index, 1);
  disabledArray.splice(index, 1);
  specsNames.value.forEach((item: any) => {
    item.disabled = disabledArray.includes(item.value);
  });
};

// 添加规格值
const addSpecValue = specIndex => {
  specForm.spec[specIndex].specVal.push({ label: '', id: 0 });
};

// 删除规格值
const removeSpecValue = specIndex => {
  const specVal = specForm.spec[specIndex].specVal;
  if (specVal?.length > 1) {
    specForm.spec[specIndex].specVal.pop();
  } else {
    window.$message.error('至少保留一个规格值');
  }
};

const detail: any = ref({});
const isLock = ref(false);
// 保存规格
const saveSpecs = () => {
  const _spec = _.cloneDeep(spec.value);
  if (!edits.value) {
    handleSave({
      categoryId: +categoryId.value,
      spec: _spec.map(item => {
        return {
          ...item,
          dictionaryId: +item.dictionaryId,
          specVal: item.specVal.map(_ => {
            return { val: _.label };
          }),
        };
      }),
    });
  } else {
    handleEdit({
      id: detail?.CateId,
      categoryId: +categoryId.value,
      spec: _spec.map(item => {
        return {
          ...item,
          dictionaryId: +item.dictionaryId,
          specVal: item.specVal.map(_ => {
            return { val: _.label, id: _.id };
          }),
        };
      }),
    });
  }
};

const onSave = debounce(() => {
  edits.value = relationSpec.value ? 1 : 0;
  console.log('relationSpec.value', relationSpec.value);
  console.log('edits.value', edits.value);
  saveSpecs();
}, 300);

const hoverTrigger = ref(false);
const filterable = ref(false);
const checkStrategyIsChild = ref(true);
const showPath = ref(true);
const relationSpec = ref([]);
const specMax = ref(0);
const curSpecCount = ref(0);

watch(
  () => spec.value,
  _specs => {
    const l = _specs.length;
    curSpecCount.value = l;
    console.log('l', l);
    if (l == 0) {
      disabledArray = [];
    }
  },
  { deep: true }
);

const resetData = () => {
  spec.value = [];
  specForm.value = '';
  specForm.spec = [];
  disabledArray = [];
  curSpecCount.value = 0;
  specMax.value = 0;
};

const handleUpdateValue = async (value: string, option: CascaderOption) => {
  resetData();
  console.log('value', value);
  const { data } = await fetchList(+value);
  console.log('data', data);
  relationSpec.value = data;
  data?.forEach(item => {
    console.log('item', item);
    const { spec } = item;
    console.log('spec', spec);
    const { dictionaryId, specVal } = spec[0];
    console.log('specVal', specVal);
    disabledArray.push(dictionaryId);
    specForm.spec.push({
      dictionaryId,
      specVal: specVal.map(item => {
        return {
          label: item.val,
          id: item.id,
        };
      }),
    });
  });

  specMax.value = specsNames.value?.length || 0;

  specsNames.value.forEach((item: any) => {
    item.disabled = disabledArray.includes(item.value);
  });
};

const onUpdateSelectedSpec = (id, option, index, init?) => {
  console.log('id', id);
  // const arr = specMapping.value[id];
  // specs[index].selectedSpec = id;
  // !init && (specs[index].selectedSpecValues = []);

  if (disabledArray[index]) {
    disabledArray.splice(index, 1);
  }
  if (!disabledArray.includes(id)) {
    disabledArray.push(id);
  }
  specsNames.value.forEach((item: any) => {
    item.disabled = disabledArray.includes(item.value);
  });
  console.log('id', id);
  console.log('index', index);
  spec.value[index].dictionaryId = id;
};
const handleSave = async specData => {
  if (isLock.value) return console.error('新增已锁住');
  isLock.value = true;
  await add(specData);
  message.success('添加成功！');
  const { data } = await fetchList(+categoryId.value);
  relationSpec.value = data;
  setTimeout(() => {
    isLock.value = false;
    console.error('已解锁');
  }, 100);
  // 在此处处理保存后的数据
};
const handleEdit = async specData => {
  await edit(specData);
  message.success('编辑成功！');
  // 在此处处理保存后的数据
};

onMounted(async () => {
  const [res, res2] = await Promise.all([
    getCategory({ isAll: 1 }),
    getSpecsNames('GOODS_TYPE'),
  ]);
  categorys.value = res.data.list.map(item => {
    return {
      label: item.name,
      value: item.id,
      children: item.children.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
    };
  });
  specsNames.value = res2.data.list.map(item => {
    console.log('item', item);
    return {
      label: item.label,
      value: +item.value,
    };
  });
  console.log('spec', spec);
});
</script>

<style lang="less" scoped>
.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.spec-item {
  position: relative;
  margin-bottom: 16px;
  background: #eee;
  padding: 54px 20px 20px;
  border-radius: 5px;
}
.del-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}

.spec-value {
  display: flex;
  flex-wrap: wrap; /* 允许子元素换行 */
  width: 100%;
}

.spec-value-item {
  display: flex;
  flex-wrap: wrap; /* 允许子元素换行 */
  align-items: center;
  flex: 1 0 24%; /* 每个输入框占据行宽的25%，这样一行最多显示四个 */
  width: 24%; /* 确保每个输入框最大宽度为25% */
  max-width: 24%; /* 确保每个输入框最大宽度为25% */
  box-sizing: border-box; /* 包括padding和border在内的宽度计算方式 */
}
</style>
