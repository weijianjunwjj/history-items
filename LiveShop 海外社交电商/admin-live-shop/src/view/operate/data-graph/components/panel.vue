<template>
  <n-card>
    <div class="dashboard-item">
      <div style="color: #464c5b; font-size: 16px; font-weight: bold">{{ title }}</div>
      <div style="color: #7E7F80; font-size: 12px;" v-if="date">{{ date }}</div>
      <div style="text-align:left;padding: 4px 0 4px 0">
        <div class="dashboard-item-top">
          <span :style="{ fontSize: '36px' }">{{ panelData.now }}</span>
          <span v-if="suffix" style="font-size: 14px;margin-left: 8px; font-weight: 400">{{suffix}}</span>
        </div>
        <div class="dashboard-item-left">
          <span :style="{ marginTop: '30px' }">
            <n-icon size="24" color="#2d8cf0">
              <component v-if="iconStr" :is="iconStr" />
            </n-icon>
          </span>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
const props = defineProps({
  iconStr: {
    type: String,
    default: ""
  },
  suffix: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    default: ""
  },
  isDay: {
    type: Boolean,
    default: false
  },
  panelData: {
    type: Object,
    default: () => ({
      now: 0,
      yes: 0
    })
  }
});
</script>

<style scoped lang="less">
.dashboard-item {
  padding: 8px;

  &:hover {
    cursor: pointer;
  }

  &-top {
    flex-direction: row;
    align-items: flex-start;

    > span {
      display: inline-block;
      color: rgba(0, 0, 0, 90%);
      font-size: 36px;
    }
  }

  &-left {
    position: absolute;
    top: 0;
    right: 32px;

    > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: #f2f3ff;
      border-radius: 50%;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &-block {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 22px;
    color: #657180;
  }

  &-trend {
    margin-left: 8px;
  }
}
</style>
