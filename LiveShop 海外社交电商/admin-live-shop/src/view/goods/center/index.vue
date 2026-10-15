<template>
  <PageLayout>
    <template #btnBar>
      <n-button type="primary" @click="addGoods">新增商品</n-button>
    </template>
    <n-dialog-provider>
      <n-data-table
        :scroll-x="'100%'"
        :single-line="false"
        :columns="columns"
        :data="data"
        :row-key="(row: any) => {return row.id}"
      />
    </n-dialog-provider>
    <Pagination
      v-model:total="paginationReactive.total"
      v-model:page="paginationReactive.page"
      v-model:limit="paginationReactive.size"
      @pagination="query"
    />
    <n-modal v-model:show="showModal">
      <n-card
        content-class="goods-center-modal-add"
        style="width: 1200px; min-height: 700px"
        :bordered="false"
        :title="`${editObj.is ? '编辑' : '新增'}商品`"
        size="huge"
        role="dialog"
        aria-modal="true"
        header-style="text-align:center;padding-bottom:5px"
      >
        <n-form
          :model="form"
          :rules="rules"
          ref="productForm"
          label-placement="left"
          label-width="120px"
        >
          <!-- Tabs 分页 -->
          <n-tabs v-model:value="activeTab">
            <!-- 基础设置 Tab -->
            <n-tab-pane name="基础设置" tab="基础设置"> </n-tab-pane>

            <!-- 规格库存 Tab -->
            <n-tab-pane name="规格库存" tab="规格库存"> </n-tab-pane>

            <!-- 商品详情 Tab -->
            <n-tab-pane name="商品详情" tab="商品详情"> </n-tab-pane>
          </n-tabs>

          <div v-show="activeTab == '基础设置'">
            <n-row :gutter="16">
              <!-- 商品名称 -->
              <n-col span="12">
                <n-form-item label="商品名称" path="name">
                  <n-input
                    v-model:value="form.name"
                    placeholder="请输入商品名称"
                    maxlength="120"
                    show-count
                    :disabled="sold"
                  />
                </n-form-item>
              </n-col>
              <n-col span="12">
                <n-form-item label="在线支付" path="payOnline">
                  <n-radio-group
                    v-model:value="form.payOnline"
                    :disabled="sold"
                  >
                    <n-radio :value="1">允许支付</n-radio>
                    <n-radio :value="2">不允许支付</n-radio>
                  </n-radio-group>
                </n-form-item>
              </n-col>
            </n-row>

            <n-row :gutter="16">
              <!-- 商品简介 -->
              <n-col span="12">
                <n-form-item label="商品简介" path="intro">
                  <n-input
                    type="textarea"
                    v-model:value="form.intro"
                    placeholder="请输入商品简介"
                    maxlength="300"
                    show-count
                    :disabled="sold"
                  />
                </n-form-item>
              </n-col>
              <!-- 采购单价 -->
              <n-col span="12">
                <n-form-item label="采购单价(¥)" path="purPrice">
                  <n-input
                    v-model:value="form.purPrice"
                    type="text"
                    placeholder="请输入采购单价"
                    maxlength="9"
                    show-count
                    :disabled="sold"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-row :gutter="16">
              <!-- 商品原价 -->
              <n-col span="12">
                <n-form-item label="商品原价($)" path="op">
                  <n-input
                    v-model:value="form.op"
                    type="text"
                    placeholder="请输入商品原价"
                    maxlength="9"
                    show-count
                    :disabled="sold"
                  />
                </n-form-item>
              </n-col>
              <n-col span="12">
                <n-form-item label="品牌" path="brand">
                  <n-input
                    v-model:value="form.brand"
                    placeholder="请输入品牌"
                    maxlength="30"
                    show-count
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-row :gutter="16">
              <!-- 规格与库存 -->
              <n-col span="12">
                <n-form-item label="参与规则" path="ProductRule.RuleType">
                  <n-radio-group
                    v-model:value="form.ProductRule.RuleType"
                    :disabled="sold"
                  >
                    <n-radio value="1">仅金币</n-radio>
                    <n-radio value="2">仅积分</n-radio>
                    <n-radio value="3">优先积分或金币</n-radio>
                  </n-radio-group>
                </n-form-item>
              </n-col>

              <template v-if="form.ProductRule.RuleType == 1">
                <n-col span="12">
                  <n-form-item label="所需金币数量" path="ProductRule.Coin">
                    <n-input
                      v-model:value="form.ProductRule.Coin"
                      placeholder="请输入金币数量"
                      maxlength="9"
                      show-count
                      :disabled="sold"
                    />
                  </n-form-item>
                </n-col>
              </template>
              <template v-else-if="form.ProductRule.RuleType == 2">
                <n-col span="12">
                  <n-form-item label="所需积分数量" path="ProductRule.Point">
                    <n-input
                      v-model:value="form.ProductRule.Point"
                      placeholder="请输入积分数量"
                      maxlength="9"
                      show-count
                      :disabled="sold"
                    />
                  </n-form-item>
                </n-col>
              </template>
              <template v-else-if="form.ProductRule.RuleType == 3">
                <n-col span="12">
                  <n-form-item label="换算规则" required>
                    <n-grid :cols="2" x-gap="1">
                      <n-grid-item>
                        <n-form-item
                          label-width="auto"
                          path="ProductRule.Point"
                        >
                          <n-input
                            v-model:value="form.ProductRule.Point"
                            placeholder="请输入积分"
                            maxlength="9"
                            show-count
                            style="width: 70%"
                            :disabled="sold"
                          />
                          <label class="ml-1">积分</label>
                          <span class="ml-2" style="font-weight: bolder"
                            >=</span
                          >
                        </n-form-item>
                      </n-grid-item>
                      <n-grid-item>
                        <n-form-item label-width="auto" path="ProductRule.Coin">
                          <n-input
                            v-model:value="form.ProductRule.Coin"
                            placeholder="请输入金币"
                            maxlength="9"
                            show-count
                            style="width: 70%"
                            :disabled="sold"
                          />
                          <label class="ml-2">金币</label>
                        </n-form-item>
                      </n-grid-item>
                    </n-grid>
                  </n-form-item>
                </n-col>
              </template>
            </n-row>

            <n-row :gutter="16">
              <n-col span="12">
                <n-form-item label="运费" path="freight">
                  <n-input
                    v-model:value="form.freight"
                    type="text"
                    placeholder="请输入金币数量"
                    maxlength="9"
                    show-count
                    :disabled="sold"
                  />
                </n-form-item>
              </n-col>
              <!-- 所在分类 -->
              <n-col span="12">
                <n-form-item label="所在分类" path="classId">
                  <n-select
                    v-model:value="form.classId"
                    placeholder="请选择分类"
                    :options="sortOptions"
                  />
                </n-form-item>
              </n-col>
            </n-row>
          </div>
          <div v-show="activeTab == '规格库存'">
            <n-row :gutter="16">
              <!-- 商品类目 -->
              <n-col span="12">
                <n-form-item label="商品类目" path="categoryId">
                  <n-cascader
                    v-model:value="form.categoryId"
                    placeholder="请选择商品类目"
                    :options="categoryOptions"
                    :disabled="sold"
                    @update:value="handleUpdateValue"
                  />
                </n-form-item>
              </n-col>
              <!-- 添加规格 -->
              <n-col span="12">
                <n-button
                  type="primary"
                  @click="addSpec"
                  :disabled="curSpecCount >= specMax && sold"
                  >添加规格</n-button
                >
              </n-col>
            </n-row>
            <!-- 规格明细表格 -->
            <!-- 这里可以使用表格组件展示不同规格及库存的输入 -->
            <n-card title="规格名称" size="large" v-if="specOptions.length">
              <!-- 遍历数组渲染规格 -->
              <n-row
                v-for="(spec, index) in specs"
                :key="index"
                style="
                  background-color: aliceblue;
                  padding: 10px;
                  margin-bottom: 20px;
                  display: flex;
                  align-items: center;
                  position: relative;
                "
              >
                <!-- 规格名称选择 -->
                <!-- :disabled="editObj.is" -->
                <n-form-item
                  style="display: flex; align-items: center; margin-bottom: 0"
                >
                  <n-select
                    v-model:value="specs[index].selectedSpec"
                    :options="specOptions"
                    placeholder="请选择规格名称"
                    style="width: 200px"
                    :on-update:value="
                      (id, option) => onUpdateSelectedSpec(id, option, index)
                    "
                  />
                </n-form-item>

                <!-- 规格值选择 -->
                <n-form-item
                  class="ml-4"
                  style="display: flex; align-items: center; margin-bottom: 0"
                >
                  <n-checkbox-group
                    v-model:value="spec.selectedSpecValues"
                    :disabled="editObj.is"
                  >
                    <n-checkbox
                      v-for="option in spec.specValueOptions"
                      :key="option.label"
                      :value="option.label"
                    >
                      {{ option.label }}
                    </n-checkbox>
                  </n-checkbox-group>
                </n-form-item>

                <n-icon
                  size="18"
                  color="red"
                  v-if="!editObj.is"
                  @click="removeSpec(index)"
                  style="position: absolute; right: 10px"
                  ><RemoveCircleOutline
                /></n-icon>
              </n-row>
              <!-- 动态生成的表格 -->
              <n-data-table
                v-if="showTable"
                :columns="columns2"
                :data="tableData"
                :single-line="false"
                row-class-name="row-name"
              />
            </n-card>
          </div>
          <div v-show="activeTab == '商品详情'">
            <n-row :gutter="16">
              <n-col span="12">
                <n-form-item label="商品图(1:1)" path="img">
                  <n-upload
                    :action="uploadUrl"
                    :headers="Headers"
                    v-model:file-list="productImg"
                    :max="9 - form.video.length"
                    list-type="image-card"
                    :accept="UploadImgAccept"
                    :customRequest="customRequest1"
                    :on-before-upload="handleBeforeUploadImg"
                    :on-remove="onRemoveImg"
                    :disabled="disabled1"
                  />
                </n-form-item>
              </n-col>
              <n-col span="12">
                <n-form-item label="宣传视频" path="video">
                  <n-upload
                    v-model:file-list="productVideo"
                    :max="9 - form.img.length"
                    list-type="image-card"
                    :accept="UploadVideoAccept"
                    :customRequest="customRequest2"
                    :on-before-upload="handleBeforeUploadVideo"
                    :on-preview="onPreviewVideo"
                    show-preview-button
                    :on-remove="onRemoveVideo"
                    :disabled="disabled2"
                  >
                    <!-- <n-button>上传视频</n-button> -->
                  </n-upload>
                </n-form-item>
              </n-col>
            </n-row>
            <n-row>
              <n-col span="24">
                <n-form-item label="商品详情" path="details">
                  <div style="border: 1px solid #ccc">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editorRef"
                      :defaultConfig="ToolbarConfig"
                    />
                    <Editor
                      style="height: 301px; overflow-y: hidden"
                      v-model="form.details"
                      :defaultConfig="editorConfig"
                      @onCreated="handleCreated"
                      @input="handleEditorInput"
                    />
                  </div>
                </n-form-item>
              </n-col>
            </n-row>
          </div>
        </n-form>

        <template #footer>
          <div class="modal-footer">
            <n-button @click="handleCancel">取消</n-button>
            <n-button
              v-if="activeTab === '商品详情'"
              type="primary"
              @click="handleSubmit"
              class="ml-3"
              >保存</n-button
            >
            <n-button type="primary" @click="handleNext" class="ml-3" v-else
              >下一步</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal
      v-model:show="showVideo"
      style="width: 600px"
      title="视频预览"
      preset="card"
    >
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        header-style="text-align:center;padding-bottom:5px"
        v-clock
      >
        <div class="flex-cc">
          <video controls :src="previewVideoUrlRef" style="width: 100%"></video>
        </div>
      </n-card>
    </n-modal>
  </PageLayout>
</template>

<script setup lang="tsx">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import Config from '../../../config/index';
import { RemoveCircleOutline } from '@vicons/ionicons5';
import {
  createColumns,
  paginationReactive,
  visible,
  showModal,
  form,
  rules,
  handleCancel,
  defaultForm,
  transformData,
  specMap,
} from './data';
import { useMessage, useDialog, NUpload } from 'naive-ui';
import {
  changeStatus,
  del,
  fetchList,
  getDetails,
  add,
  edit,
  getSpecDetails,
} from '@/api/goods/center';
import { UploadCustomRequestOptions } from 'naive-ui';
import { getCategory } from '@/api/goods/category';
import { getSpecsNames } from '@/api/goods/specs';
import $g from '@/utils/globalVariable.js';
import { NInput } from 'naive-ui';
import {
  uploadService,
  Headers,
  UploadImgAccept,
  UploadVideoAccept,
  checkFileSize,
  checkFileType,
  checkImgRatio,
} from '@/utils/uploadService';
import { FileInfo } from 'naive-ui/es/upload/src/interface';
import _ from 'lodash';
import { MENU_CONF, ToolbarConfig } from '@/config/editor';
import { getUrl, noEmpty, removeCurUrlPrefix } from '@/utils/utils';

const uploadUrl = Config.baseUrl + 'BasePrivate/uploadFile';

const message = useMessage();
const dialog = useDialog();
const disabled1=ref(false)
const disabled2=ref(false)
const editorConfig = {
  placeholder: '请输入详情内容...',
  MENU_CONF,
};

const showVideo = ref(false);
const previewVideoUrlRef = ref('');

const editObj = reactive({
  is: false,
  id: null,
});

const productImg = ref([]);
const productVideo: any = ref([]);

watch(
  () => showModal.value,
  val => {
    console.log('val', val)
    if (!val) {
      resetForm();
    }
  }
);

function addGoods() {
  resetForm();
  editObj.is = false;
  showModal.value = true;
}

const onPreviewVideo = (file: FileInfo, detail: { event: MouseEvent }) => {
  const { url } = file;
  if (url) {
    previewVideoUrlRef.value = url;
    showVideo.value = true;
  }
};

const customRequest1 = async (obj: UploadCustomRequestOptions) => {
  disabled1.value=true
  const uploadFile = await uploadService(obj);
  const { batchId: id, url, name } = uploadFile;
  form.img.push({
    id,
    url,
    name,
  });
  await nextTick()
  disabled1.value=false
};

const customRequest2 =  async (obj: UploadCustomRequestOptions) => {
  disabled2.value=true
  const uploadFile: any = await uploadService(obj);
  const { batchId, url, name } = uploadFile;
  form.video.push({
    id: batchId,
    url,
    name,
  });
  productVideo.value = form.video.map(item => {
    return {
      ...item,
      url: getUrl(url),
      batchId,
      status: 'finished',
    };
  });

  await nextTick()
  disabled2.value=false
};

const handleBeforeUploadImg = async file => {
  return (
    checkFileSize(file, 2) &&
    checkFileType(file, UploadImgAccept) &&
    (await checkImgRatio(file, 1))
  );
};

const handleBeforeUploadVideo = file => {
  return checkFileSize(file, 20) && checkFileType(file, UploadVideoAccept);
};



function onRemoveVideo(e) {
  console.log('e', e);
  const { id } = e.file;
  form.video = form.video.filter(item => item.id !== id);
}

function onRemoveImg({ file }) {
  const id = file.id;

  form.img = form.img.filter(item => item.id != id);
}

const activeTab = ref('基础设置');

const mapping = {
  '1': '基础设置',
  '2': '规格库存',
  '3': '商品详情',
  基础设置: 1,
  规格库存: 2,
  商品详情: 3,
};

const handleNext = () => {
  const curIndex = Number(mapping[activeTab.value]);
  let nextIndex;
  if (curIndex < 3) {
    nextIndex = curIndex + 1;
    const nextVal = mapping[nextIndex];
    activeTab.value = nextVal;
  } else {
  }
};

// ---data---
const data = ref([]);
const currentRow: any = ref({});

const resetForm = () => {
  Object.assign(form, _.cloneDeep(defaultForm));
  editObj.is = false;
  editObj.id = null;
  activeTab.value = '基础设置';

  columns2.value = defaultColumns2;
  tableData.value = [];
  disabledArray = [];
  specs.length = 0;
  productImg.value = [];
  productVideo.value = [];
  productForm.value?.restoreValidation?.();
};
const transformSpecData = specData => {
  return specData.map(spec => {
    const { specId, specVal } = spec;

    // 将 specVal 数组转换为所需的 specValueOptions 格式
    const specValueOptions = specVal.map(val => {
      // 从 specValueOptionsMap 中获取 label 和 value
      const value = specValueOptionsMap.value[val];
      return { label: val, value: value || null };
    });

    return {
      selectedSpec: specId,
      selectedSpecValues: specVal,
      specValueOptions,
    };
  });
};

const sold = computed(() => {
  return editObj.is && currentRow.value.status == 2;
});

const columns = createColumns({
  async handleEdit(row: any) {
    currentRow.value = row;
    visible.groupConfig = true;
    resetForm();
    const { data } = await getDetails({ id: row.id });
    const {
      categoryId,
      name,
      itemNumber,
      intro,
      freight,
      classId,
      purPrice,
      op,
      brand,
      details,
      img,
      video,
      coin,
      point,
      payOnline,
      ruleType,
    } = data;
    productImg.value = img?.split(',')?.map((item, index) => ({
      url: getUrl(item),
      id: index,
      batchId: index,
      status: 'finished',
    }));
    if (noEmpty(video)) {
      productVideo.value = video?.split(',')?.map((item, index) => ({
        url: getUrl(item),
        id: index,
        batchId: index,
        status: 'finished',
      }));
    }
    const _form = reactive({
      categoryId, //类目id
      name,
      itemNumber: itemNumber || row.itemNumber || '',
      intro,
      freight,
      payOnline,
      classId: classId + '',
      purPrice,
      op,
      brand,
      details,
      img: productImg.value,
      video: productVideo.value,
      ProductRule: {
        RuleType: ruleType.toString(),
        Point: point,
        Coin: coin,
      },
    });

    // 使用 for...in 循环遍历 _form 并将值赋给 form
    for (const key in _form) {
      form[key] = _form[key];
    }

    showModal.value = true;

    if (form.categoryId) {
      await handleUpdateValue(String(form.categoryId));
    }

    let SkuReply: any = data.SkuReply;
    const _specs: any = transformSpecData(data.spec);

    for (const key in _specs) {
      specs[key] = _specs[key];
    }
    _specs.forEach((item, index) => {
      onUpdateSelectedSpec(item.selectedSpec, null, index, true);
    });

    const flatTableData = reverseSkuToTableData(SkuReply);

    await nextTick();
    tableData.value = flatTableData;

    editObj.is = true;
    editObj.id = row.id;
  },
  handleDelete(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定删除${row.name}吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await del({ id: row.id });
          query();
          message.success('删除成功');
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
  async handleUp(row: any) {
    // "status": 3 //商品状态：1. 待上架，2. 已上架，3. 已下架，4. 缺货',
    dialog.warning({
      title: '警告',
      content: `确定上架${row.name}吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await changeStatus({ id: row.id, status: 2 });
          message.success('上架成功');
          query();
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
  async handleDown(row: any) {
    dialog.warning({
      title: '警告',
      content: `确定下架${row.name}吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await changeStatus({ id: row.id, status: 3 });
          message.success('下架成功');
          query();
        } catch (error) {}
      },
      onNegativeClick: () => {},
    });
  },
});

const query = async () => {
  const { page, size: pageSize } = paginationReactive;
  const res = await fetchList({ page, pageSize });
  data.value = res.data.list;
  paginationReactive.total = res.data.count;
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleEditorInput = val => {};

const specMax = ref(0);
const curSpecCount = ref(0);

// 封装方法，根据 dictionaryId 进行分类
function groupByDictionaryId(data) {
  return data.reduce((result, item) => {
    const key = item.dictionaryId;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
}

const specMapping = ref();

const handleUpdateValue = async (value: string) => {
  // 重置specs
  specs.length = 0;
  curSpecCount.value = 0;
  specMax.value = 0;
  tempColumns.value = [];
  const { data } = await getSpecDetails({ id: value });
  console.log('data', data);
  const data2 = $g.sort(data, 'dictionaryId') as any;
  console.log('data2', data2);
  specMax.value = data2?.length || 0;
  data2?.length &&
    (specOptions.value = data2.map(item => {
      return {
        label: item[0].specName,
        value: item[0].dictionaryId,
      };
    }));

  const _specMapping = groupByDictionaryId(data);

  specMapping.value = _specMapping;
};

// 已禁用选项的ID数组
let disabledArray: any = [];
const onUpdateSelectedSpec = (id, option, index, init?) => {
  const arr = specMapping.value[id];
  specs[index].selectedSpec = id;
  !init && (specs[index].selectedSpecValues = []);

  if (disabledArray[index]) {
    disabledArray.splice(index, 1);
  }
  if (!disabledArray.includes(id)) {
    disabledArray.push(id);
  }
  specOptions.value.forEach((item: any) => {
    item.disabled = disabledArray.includes(item.value);
  });
  if (arr?.length) {
    console.log('arr', arr);
    specs[index].specValueOptions = arr.map(_ => {
      specValueOptionsMap.value[_.specVal] = id;
      return {
        label: _.specVal,
        value: _.id,
      };
    });

    console.log('specs', specs);
  }
};

const specValueOptionsMap = ref({});

// 商品类目
const categoryOptions = ref([]);
// 所在分类
const sortOptions = ref([]);

// 规格明细
const specOptions = ref([]);
const tableData: any = ref([]); // 表格中的数据

const defaultColumns2 = [
  {
    title: '商品售价',
    key: 'price',
    align: 'center',
    render(row) {
      let content;
      const RuleType = +form.ProductRule.RuleType;

      // 校验 coin 和 point 是否为有效数值
      const validatePrice = () => {
        row.error = row.error || {};
        if (RuleType === 1 || RuleType === 3) {
          row.error.coin = !row.coin || isNaN(row.coin);
        }
        if (RuleType === 2 || RuleType === 3) {
          row.error.point = !row.point || isNaN(row.point);
        }
      };

      if (RuleType === 1) {
        content = (
          <div>
            <NInput
              v-model:value={row.coin}
              placeholder="金币"
              onBlur={validatePrice}
              clearable
              disabled={sold.value}
            />
            {row.error?.coin && (
              <div class="error-text">请输入有效的金币数</div>
            )}
          </div>
        );
      } else if (RuleType === 2) {
        content = (
          <div>
            <NInput
              v-model:value={row.point}
              placeholder="积分"
              onBlur={validatePrice}
              clearable
              disabled={sold.value}
            />
            {row.error?.point && (
              <div class="error-text">请输入有效的积分数</div>
            )}
          </div>
        );
      } else if (RuleType === 3) {
        content = (
          <div class="flex-c">
            <NInput
              v-model:value={row.point}
              placeholder="积分"
              onBlur={validatePrice}
              clearable
              disabled={sold.value}
            />
            <span class="mlr-2">+</span>
            <NInput
              v-model:value={row.coin}
              placeholder="金币"
              onBlur={validatePrice}
              clearable
              disabled={sold.value}
            />
            {row.error?.point && (
              <div class="error-text">请输入有效的积分数</div>
            )}
            {row.error?.coin && (
              <div class="error-text">请输入有效的金币数</div>
            )}
          </div>
        );
      }

      return content;
    },
  },
  {
    title: '库存数量',
    key: 'stock',
    align: 'center',
    render(row) {
      const validateStock = () => {
        row.error = row.error || {};
        row.error.stock = !row.stock || isNaN(row.stock);
      };

      return (
        <div>
          <NInput
            v-model:value={row.stock}
            placeholder="请输入库存数量"
            onBlur={validateStock}
            clearable
            disabled={sold.value}
          />
          {row.error?.stock && (
            <div class="error-text">请输入有效的库存数量</div>
          )}
        </div>
      );
    },
  },
  {
    title: '规格图片(1:1)',
    key: 'image',
    align: 'center',
    render(row) {
      const validateImage = () => {
        row.error = row.error || {};
        row.error.img = !row.img || row.img.length === 0;
      };

      watch(
        () => row.img,
        img => {
          validateImage();
        },
        { deep: true }
      );

      return (
        <div>
          <NUpload
            action={uploadUrl}
            headers={Headers}
            v-model:file-list={row.imgs}
            max={1}
            list-type="image-card"
            accept={UploadImgAccept}
            onBeforeUpload={handleBeforeUploadImg}
            disabled={sold.value}
            customRequest={async obj => {
              const uploadFile = await uploadService(obj);
              const { batchId, url, name } = uploadFile;
              const target: any = row.img?.find(
                item => item.batchId === batchId
              );
              const target2: any = row.imgs?.find(
                item => item.batchId === batchId
              );
              console.log(target2);
              if (target) {
                target.url = url;
              } else {
                row.img = [];
                row.img.push({ url });
              }
              if (target2) {
                target2.url = getUrl(url);
              } else {
                row.imgs = [];
                row.imgs.push({ url: getUrl(url) });
              }
              validateImage();
            }}
          />
          {row.error?.img && <div class="error-text">请上传至少一张图片</div>}
        </div>
      );
    },
  },
];

const columns2: any = ref([...defaultColumns2]);

watch(
  () => tableData.value,
  () => {
    const sku = getSku();
    console.log('sku', sku);
  },
  { deep: true }
);

// 校验表格的每一行数据
const validateTableData = () => {
  if (!tableData.value.length) return false;
  const ruleType = Number(form.ProductRule.RuleType);
  tableData.value.forEach(row => {
    row.error = {};
    if (ruleType === 1 || ruleType === 3) {
      row.error.coin = !row.coin || isNaN(row.coin);
    }
    if (ruleType === 2 || ruleType === 3) {
      row.error.point = !row.point || isNaN(row.point);
    }
    row.error.stock = !row.stock || isNaN(row.stock);
    row.error.img = !row.img || row.img.length === 0;
  });

  return !tableData.value.some(row => Object.values(row.error).some(Boolean));
};

// 提交前检查所有校验
const handleSubmitTable = async () => {
  const isValid = validateTableData();
  if (isValid) {
    // 提交表单数据
    return 1;
  } else {
    window.$message.error('请完善规格库存');
    return 0;
  }
};

const tempColumns: any = ref([]); // 记录用户选择的顺序

let mappingSpec = {
  // 2: {
  //   name: '颜色',
  //   key: '颜色',
  // },
};

const specNames = computed(() => {
  return Object.values(mappingSpec).map(item => item.name);
});

// 动态更新表格数据的方法
const updateTableData = async () => {
  const newTableData: any = [];
  const _specNames = specNames.value;

  specs.forEach(spec => {
    const label = allSpecs.value[spec.selectedSpec];
    const { name, key } = mappingSpec?.[spec?.selectedSpec] || {};

    if (!name || !key) return;

    // 判断颜色的条件
    if (spec.selectedSpecValues.length === 0 && label === name) {
      // 如果颜色没有选中，则从表格中移除
      columns2.value = columns2.value.filter(item => item.title !== name);
      tempColumns.value = tempColumns.value.filter(item => item.title !== name);
    } else if (label === name) {
      // 如果已选中颜色，确保颜色列在临时数组中
      if (!tempColumns.value.some(col => col.title === name)) {
        tempColumns.value.push({
          title: name,
          key: key,
          align: 'center',
          rowSpan: (rowData, rowIndex) => getRowSpan(rowData, rowIndex, key),
        });
      }
    }

    // 先移除原有的颜色和尺码列
    columns2.value = columns2.value.filter(
      item => !_specNames.includes(item.title)
    );
    columns2.value.unshift(...tempColumns.value);
  });

  const specKeys = _specNames;
  const selectedSpecValues = specKeys.map(specKey => {
    return (
      specs.find(spec => allSpecs.value[spec.selectedSpec] === specKey)
        ?.selectedSpecValues || []
    );
  });

  // 遵循固定层级生成规格组合数据
  const generateCombinations = (index, currentCombination) => {
    if (index === selectedSpecValues.length) {
      const obj = {
        price: '',
        stock: '',
        image: '',
      };

      // 动态添加每个规格的值到 obj 中
      specKeys.forEach((key, i) => {
        obj[key] = currentCombination[i] || '';
      });

      newTableData.push(obj);
      return;
    }

    // 获取当前规格层级的值
    const specValues = selectedSpecValues[index];
    if (specValues.length > 0) {
      specValues.forEach(value => {
        generateCombinations(index + 1, [...currentCombination, value]);
      });
    } else {
      generateCombinations(index + 1, [...currentCombination, '']);
    }
  };

  generateCombinations(0, []);

  // === 核心代码：合并旧数据与新数据 ===
  // const mergedData = newTableData.map(newRow => {
  //   const existingRow = tableData.value.find(oldRow =>
  //     specKeys.every(key => oldRow[key] === newRow[key]) // 判断是否匹配
  //   );
  //   return existingRow ? { ...existingRow } : { ...newRow }; // 保留旧数据内容
  // });

  console.log('newTableData', newTableData);

  // 更新表格数据
  tableData.value = newTableData;
  refresh.value = false;
  await nextTick();
  refresh.value = true;
};
// 动态计算 rowSpan 的方法，只合并第一列
const getRowSpan = (rowData, rowIndex, key) => {
  // 获取第一列的 key
  const firstColumnKey = columns2.value[0]?.key;

  // 只在第一列时进行合并
  if (key === firstColumnKey) {
    const currentValue = rowData[key];
    let rowSpan = 1;

    // 遍历后续行，合并连续相同的值
    for (let i = rowIndex + 1; i < tableData.value.length; i++) {
      if (tableData.value[i][key] === currentValue) {
        rowSpan++;
      } else {
        break; // 如果值不同，停止合并
      }
    }

    // 如果前一行的值与当前行相同，返回 0 表示合并
    if (rowIndex > 0 && tableData.value[rowIndex - 1][key] === currentValue) {
      return 0;
    }

    return rowSpan >= 2 ? rowSpan : 1;
  }

  // 非第一列，不合并
  return 1;
};
const refresh = ref(true);

// 使用 computed 来监听 selectedSpecValues 并返回是否有大于0的
const showTable = computed(() => {
  return (
    specs.some(spec => spec.selectedSpecValues.length > 0) && refresh.value
  );
});

// 规格数组，每一项是一个对象，包含 selectedSpec 和 selectedSpecValues
const specs = reactive<any>([]);

watch(
  () => specs,
  _specs => {
    updateTableData();
    const l = _specs.length;
    curSpecCount.value = l;
    if (l == 0) {
      disabledArray = [];
    }
  },
  { deep: true }
);

// 添加新的规格
const addSpec = () => {
  specs.push({
    selectedSpec: '',
    selectedSpecValues: [],
    specValueOptions: [],
  });
};

// 删除规格
const removeSpec = async index => {
  const id = specs[index].selectedSpec;
  specOptions.value.forEach((item: any) => {
    if (item.value == id) item.disabled = false;
  });
  specs.splice(index, 1);
  const _index = disabledArray.findIndex(item => item == id);
  disabledArray.slice(_index, 1);

  // 根据key删除表头
  await nextTick();
  const removeKey = columns2.value[index].key;
  columns2.value = columns2.value.filter(item => item.key !== removeKey);
  tempColumns.value = tempColumns.value.filter(item => item.key !== removeKey);
};
const allSpecs = ref({});

const productForm = ref('productForm');

const getSku = () => {
  return tableData.value
    .map(item => {
      const { coin, point, stock } = item;
      let obj = {};
      let remarks: any = [],
        attrGroups: any = [];
      // 遍历规格名，生成 SKU 数据
      specNames.value.forEach(specName => {
        const remark = item[specName];
        if (remark) {
          const attrGroup = specValueOptionsMap.value[remark];
          attrGroups.push(attrGroup);
          remarks.push(remark);
          // 将每个 specName 对应的值合并到 obj 中
          // obj.attrGroup=
          obj = {
            attrGroup: attrGroups.join(','),
            remark: remarks.join(','),
            coin,
            point,
            id: item.id,
            stock: +stock,
            specImg: item.img
              ?.map(img => removeCurUrlPrefix(img?.url))
              .join(', '), // 确保图像链接之间用逗号和空格分隔
          };
        }
      });

      return obj;
    })
    .flat(); // 扁平化数组
};

const reverseSkuToTableData = skuData => {
  return skuData.map(sku => {
    const item = {
      coin: String(sku.coin ?? ''),
      point: String(sku.point ?? ''),
      stock: String(sku.stock ?? ''),
      imgs: sku.specImg?.split(',')?.map((item, index) => ({
        url: getUrl(item),
        batchId: index,
        status: 'finished',
      })),
      img: sku.specImg?.split(',')?.map((item, index) => ({
        url: getUrl(item),
        batchId: index,
        status: 'finished',
      })),
      id: sku.id,
    };

    // 将 `remark` 分割为规格值数组
    const remarksArray = sku.remark.split(',');
    const attrGroupArray = sku.attrGroup.split(',');

    // 根据 `specNames` 将每个规格名称和对应的 `remark` 还原到 item
    attrGroupArray.forEach((id, index) => {
      const key = allSpecs.value[id];
      const value = allSpecs.value[index];
      item[key] = value;
    });
    specNames.value.forEach((specName, index) => {
      const key = allSpecs.value[attrGroupArray[index]];
      const value = remarksArray[index];
      if (value) {
        item[key] = value;
      }
    });

    return item;
  });
};

const handleSubmit = () => {
  productForm.value.validate(async errors => {
    if (!errors) {
      const res = await handleSubmitTable();
      if (!res) return;
      // 提交逻辑
      const data: any = _.cloneDeep(form);
      data['sku'] = getSku();
      const spec = specs.map(item => {
        return {
          specId: item.selectedSpec,
          specVal: item.selectedSpecValues,
        };
      });
      data['spec'] = spec;
      data.classId = String(data.classId);
      data.categoryId = +data.categoryId;
      data.ProductRule.RuleType = +data.ProductRule.RuleType;
      data.id = editObj.id;

      data.img = data.img
        ?.map(item => removeCurUrlPrefix(item.url))
        .filter(Boolean)
        ?.join(',');

      // data.img = JSON.stringify(data.img);
      data.video = data.video
        ?.map(item => item.url)
        .filter(Boolean)
        ?.join(',');

      if (!editObj.is) {
        await add(data);
      } else {
        await edit(data);
      }

      window.$message.success('商品保存成功');
      query();
      showModal.value = false;
    } else {
      window.$message.error(errors[0][0].message);
    }
  });
};

onMounted(async () => {
  query();
  const [res, res2, res3] = await Promise.all([
    getCategory({ isAll: 1 }),
    getSpecsNames('GOODS_CLASS'),
    getSpecsNames('GOODS_TYPE'),
  ]);
  categoryOptions.value = res.data.list.map(item => {
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
  sortOptions.value = res2.data.list.map(item => {
    return {
      label: item.label,
      value: String(item.value),
    };
  });
  let _allSpecs = {};
  console.log('res3.data.list', res3.data.list);
  res3.data.list.forEach(item => {
    const { value, label } = item;
    _allSpecs[value] = label;
    mappingSpec[value] = {
      name: label,
      key: label,
    };
    specMap[label] = value;
  });

  allSpecs.value = _allSpecs;
});
</script>

<style lang="less" scoped>
@import 'quill/dist/quill.snow.css'; /* Quill 默认的雪花主题样式 */

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>

<style>
.goods-center-modal-add {
  .error-text {
    color: red;
  }
  .row-name > td {
    vertical-align: middle; /* 垂直居中 */
  }
}
</style>
