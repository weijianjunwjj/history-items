<template>
  <n-modal
      :show="visible"
      transform-origin="center"
      preset="dialog"
      title=""
      style="width: 550px"
      :show-icon="false"
      @close="handleCancel"
  >
    <div class="ruleDetailModelHead flex">
      <span></span>
      积分规则详情
    </div>

    <div class="rowsItems">
      <div class="items_content flex">
        <p class="items_label">规则名称:</p>
        <p>{{ currentRow.name || '-' }}</p>
      </div>
      <!--            <div class="items_content flex">-->
      <!--                <p class="items_label">积分规则类型:</p>-->
      <!--                <p>-->
      <!--                    {{ integralRuleOptions.find(v => v.value == currentRow.rule)?.label || '-' }}-->
      <!--                </p>-->
      <!--            </div>-->
      <div class="items_content flex">
        <p class="items_label">应用场景:</p>
        <p>{{ sceneObjectKeys[currentRow.scene] || '-' }}</p>
      </div>
      <div class="items_content flex">
        <p class="items_label">详细规则:</p>
        <p>
          每日前{{ currentRow.counts }}次{{ sceneObjectKeys[currentRow.scene] }} ，每次{{
            currentRow.integral
          }}积分； 每日{{ sceneObjectKeys[currentRow.scene] }}积分获取上限为：<n-tag type="info">{{
            currentRow.integralMax
          }}</n-tag>
        </p>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import {useMessage} from 'naive-ui';
import {sceneObjectKeys} from './data.ts';

const message = useMessage();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentRow: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits();

watch(
    () => props.visible,
    n => {
      if (n) {
        //
      }
    }
);

function handleCancel() {
  emit('cancel');
}
</script>

<style lang="less" scoped>
.ruleDetailModelHead {
  font-size: 16px;
  font-weight: 600;
  align-items: center;
  height: 30px;
  margin-bottom: 10px;

  span {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #105cfb;
    margin-right: 5px;
  }
}

.rowsItems {
  display: flex;
  flex-direction: column;

  .items_content {
    margin-bottom: 10px;
    color: #333333;

    .items_label {
      width: 80px;
      text-align: left;
      color: rgb(164, 164, 164);
    }
  }
}
</style>
