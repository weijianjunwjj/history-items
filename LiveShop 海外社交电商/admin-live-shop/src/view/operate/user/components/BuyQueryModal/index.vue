<template>
  <n-modal
    v-model:show="isVisible"
    title="消费查询"
    preset="dialog"
    style="width: 1300px; min-height: 750px"
    @negative-click="closeModal"
    class="operate-user-buy-modal"
  >
    <header>
      <n-tabs animated v-model:value="tabs">
        <n-tab-pane :name="1" tab="充值"></n-tab-pane>
        <n-tab-pane :name="2" tab="商品"> </n-tab-pane>
        <n-tab-pane :name="3" tab="活动"> </n-tab-pane>
        <n-tab-pane :name="4" tab="积分"> </n-tab-pane>
      </n-tabs>
    </header>

    <main>
      <RechargeTable v-show="tabs == 1" :isQuery="tabs == 1" />
      <ShopTable v-show="tabs == 2" :isQuery="tabs == 2" />
      <ActivityTable v-show="tabs == 3" :isQuery="tabs == 3" />
      <IntegralTable v-show="tabs == 4" :isQuery="tabs == 4" />
    </main>
  </n-modal>
</template>

<script setup lang="ts">
import RechargeTable from './components/RechargeTable.vue';
import ShopTable from './components/ShopTable.vue';
import ActivityTable from './components/ActivityTable.vue';
import IntegralTable from './components/IntegralTable.vue';

const props = defineProps({
  show: Boolean,
});

const tabs = ref(1);

const isVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  },
});

const detail: any = defineModel('detail');

watch(
  () => isVisible.value,
  (newValue, oldValue) => {
    console.log('detail', detail);
  }
);

watch(
  () => tabs.value,
  tabs => {
    console.log('tabs', tabs);
  }
);

const emit = defineEmits(['update:show']);

function closeModal() {
  isVisible.value = false;
}
</script>

<style lang="less" scoped>
.operate-user-buy-modal {
  .w20 {
    width: 20%;
  }
  .w40 {
    width: 40%;
  }
  .mtb-2 {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .mb-2 {
    margin-bottom: 20px;
  }
}
</style>
