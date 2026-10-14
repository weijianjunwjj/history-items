<template>
  <div class="container">
    <n-card title="商品类目" size="large" class="category-card">
      <!-- 当前选择 -->
      <div v-if="selectedCategoryPath?.length" class="current-selection">
        当前选择: {{ selectedCategoryPath.join(' > ') }}
      </div>

      <!-- 商品类目树 -->
      <n-tree :data="treeData" class="category-tree" default-expand-all :selected-keys="selectedKeys"
        @update:selected-keys="handleSelect" />
    </n-card>
  </div>
</template>

<script setup>
// 接收父组件传入的 treeData
const props = defineProps({
  width: {
    type: Number,
    default: 300,
  },
  treeData: {
    type: Array,
    required: true,
  },
});

// 发出选择事件，通知父组件
const emit = defineEmits(['update:selectedCategory']);

// 当前选中的类别路径
const selectedCategoryPath = ref([]);

// 当前选中的类别 key
const selectedKeys = ref([]);

const $mitt = inject("$mitt")

$mitt.on('clear_selectedCategoryPath',()=>{
  selectedCategoryPath.value=[]
})

onBeforeUnmount(() => {
  $mitt.off('clear_selectedCategoryPath')
})


// 处理选择事件
const handleSelect = (keys, info) => {
  selectedKeys.value = keys;
  selectedCategoryPath.value = info.map(node => node.label);

  // 发出当前选中类别的路径
  emit('update:selectedCategory', {
    keys,
    path: selectedCategoryPath.value,
  });
};

</script>

<style scoped>
.container {
  width: 350px;
  display: flex;
  height: calc(100vh - 125px);
  overflow-y: auto;
}

.category-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
}

.current-selection {
  padding: 10px;
  background: #f5f5f5;
  margin-bottom: 10px;
}
</style>
