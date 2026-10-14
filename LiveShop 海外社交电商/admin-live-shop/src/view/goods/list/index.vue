<template>
  <PageLayout>
    <div class="goods-list flex">
      <div class="left">
        <CategoryTree v-if="showCategoryTree" ref="CategoryTreeRef" :treeData="treeData"
          @update:selectedCategory="handleCategorySelect" />
      </div>

      <div class="right ml-6 flex-1">
        <div class="flex-c">
          <div class="flex-c">
            <n-form-item label="商品名称" style="width: 200px;">
              <n-input v-model:value="searchForm.name" placeholder="请输入" />
            </n-form-item>
            <n-form-item label="商品编号" class="ml-3" style="width: 200px;">
              <n-input v-model:value="searchForm.ItemNumber" placeholder="请输入" />
            </n-form-item>
            <n-form-item label="所在分类" class="ml-3" style="width: 200px;">
              <n-select v-model:value="searchForm.classId" placeholder="请选择分类" :options="sortOptions" />
            </n-form-item>
          </div>
          <div class="ml-6">
            <n-button type="primary" @click="searchQuery">查询</n-button>
            <n-button type="primary" class="ml-2" @click="reset">重置</n-button>
          </div>
        </div>

        <n-data-table :single-line="false" :columns="columns" :data="tableData" :loading="loading" />
        <Pagination v-model:total="paginationReactive.total" v-model:page="paginationReactive.page"
          v-model:limit="paginationReactive.pageSize" @pagination="query" />

        <n-modal v-model:show="showDetail" style="width: 600px" title="商品详情" preset="card"
          class="goods-list-modal-detail">
          <n-card :bordered="false" size="huge" role="dialog" aria-modal="true"
            header-style="text-align:center;padding-bottom:5px">
            <n-row>
              <n-col :span="12">
                <label>商品名称：</label>
                <span>{{ goodsDetail.name }}</span>
              </n-col>
              <n-col :span="12">
                <label>商品编号：</label>
                <span>{{ goodsDetail.itemNumber }}</span>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <label>商品原价($)：</label>
                <span>{{ goodsDetail.op }}</span>
              </n-col>
              <n-col :span="12">
                <label>商品售价：</label>
                <span>{{ goodsDetail.purPrice }}</span>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <label>运费：</label>
                <span>{{ goodsDetail.freight }}</span>
              </n-col>
              <n-col :span="12">
                <label>规格：</label>
                <span>{{ goodsDetail.specName }}</span>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <label>规格值：</label>
                <span>{{ goodsDetail.specVal }}</span>
              </n-col>
              <n-col :span="12">
                <label>销量：</label>
                <span>{{ goodsDetail.sale_num }}</span>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="12">
                <label>剩余库存：</label>
                <span>{{ goodsDetail.stock }}</span>
              </n-col>
              <n-col :span="12">
                <label>所在分类：</label>
                <span>{{ goodsDetail.className }}</span>
              </n-col>
            </n-row>
            <n-row>
              <n-col :span="24">
                <label>规格图片：</label>
                <div v-if="goodsDetail.img?.length" class="mt-3">
                  <n-image class="mr-3" v-for="(img, index) in goodsDetail.img?.split(',')" width="100" :key="index" :src="getUrl(img)">
                  </n-image>
                </div>
              </n-col>
            </n-row>
          </n-card>
        </n-modal>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { fetchList, getDetails } from '@/api/goods/list';
import CategoryTree from '@/view/components/category-tree/index.vue';
import { createColumns,defaultPaginationReactive,paginationReactive } from './data'
import { getCategory } from '@/api/goods/category';
import { getSpecsNames } from '@/api/goods/specs';
import { forin, getUrl } from '@/utils/utils';
import { goodsDetailType, searchFormType } from './type'
// 树形数据
const treeData = ref([]);
const tableData = ref([]);
const CategoryTreeRef = ref()
const showDetail = ref(false)
const goodsDetail = ref<goodsDetailType>({
  name: '',
  itemNumber: '',
  op: '',
  purPrice: '',
  freight: '',
  specName: '',
  specVal: '',
  sale_num: '',
  stock: '',
  className: '',
  img: ''
})
const loading=ref(true)


const defaultSearchForm = {
  name: '',
  ItemNumber: '',
  classId: null,
  categoryId: undefined,
}

const showCategoryTree = ref(true)

const searchForm: searchFormType = reactive({
  ...defaultSearchForm
})

const columns = createColumns({
  async handleLook (row: any) {
    const { data } = await getDetails({ id: row.id })
    goodsDetail.value = { ...row, ...data,itemNumber: row.itemNumber}
    showDetail.value = true
  },
});



const sortOptions = ref([]);

// 当前选中的类别路径
const selectedCategoryPath = ref([]);

// 处理选中类别的事件
const handleCategorySelect = selection => {
  selectedCategoryPath.value = selection.path;
  searchForm.categoryId = selection.keys[0]
  query()
};


const query = async () => {
  const { page, pageSize } = paginationReactive;
  let classId
  if (searchForm.classId) {
    classId = +searchForm.classId
  }
  const res = await fetchList({
    page, pageSize, ...searchForm, classId
  });
  tableData.value = res.data.list;
  paginationReactive.total = res.data.count;
  setTimeout(() => {
  loading.value=false
  }, 10);
};

const searchQuery=()=>{
  paginationReactive.page=1
  query()
}


const reset = async () => {
  forin(searchForm, defaultSearchForm)
  forin(paginationReactive, defaultPaginationReactive)
  showCategoryTree.value = false
  await nextTick()
  showCategoryTree.value = true
  query()
}



onMounted(async () => {
  query()
  const [{ data: { list } }, res2] = await Promise.all([
    getCategory({ isAll: 1 }),
    getSpecsNames('GOODS_CLASS'),
  ]);
  list.forEach(item => {
    item['key'] = item.id
    item['label'] = item.name
    item.disabled = true
    item.children.forEach(item => {
      item['key'] = item.id
      item['label'] = item.name
      item.isLeaf = true
    })
  })

  sortOptions.value = res2.data.list.map(item => {
    return {
      label: item.label,
      value: String(item.value),
    };
  });


  treeData.value = list
})


</script>

<style lang="less">
.goods-list {
  height: 100%;
}

.goods-list-modal-detail {
  .n-row {
    margin-bottom: 15px !important;
  }

  .n-card>.n-card__content {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  label {
    color: #aaa;
  }

  span {}
}
</style>
