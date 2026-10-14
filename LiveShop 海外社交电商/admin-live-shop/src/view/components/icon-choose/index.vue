<template>
  <n-input-group>
    <n-input v-model:value="localValue" readonly :on-clear="onClear" placeholder="请选择图标" clearable />
    <n-input-group-label>
      <n-icon>
        <component v-if="localValue" :is="localValue" />
      </n-icon>
    </n-input-group-label>
    <n-button type="primary" @click="showIconStore">选择</n-button>
  </n-input-group>

  <n-modal v-model:show="iconStore">
    <div class="icon-box">
      <n-tabs v-model:value="currentTab" type="line" animated>
        <!-- ionicons5 Tab -->
        <n-tab-pane name="ionicons5" tab="ionicons5" style=" height: 600px;">
          <n-virtual-list :items="ionicons5Grouped" :item-size="100" style="height: 600px;">
            <template #default="{ item }">
              <n-grid x-gap="12" :cols="10">
                <n-gi
                  class="icon-item"
                  v-for="icon in item"
                  :key="icon[0]"
                  @click="clickIcon('ionicons5-' + icon[0])"
                >
                  <n-icon class="icon-icon" :component="icon[1]" size="30" />
                  <p>{{ icon[0] }}</p>
                </n-gi>
              </n-grid>
            </template>
          </n-virtual-list>
        </n-tab-pane>

        <!-- Ant Design Tab -->
        <n-tab-pane name="antd" tab="antd" style=" height: 600px;">
          <n-virtual-list :items="antdGrouped" :item-size="100" style="height: 600px;">
            <template #default="{ item }">
              <n-grid x-gap="12" :cols="10">
                <n-gi
                  class="icon-item"
                  v-for="icon in item"
                  :key="icon[0]"
                  @click="clickIcon('antd-' + icon[0])"
                >
                  <n-icon class="icon-icon" :component="icon[1]" size="30" />
                  <p>{{ icon[0] }}</p>
                </n-gi>
              </n-grid>
            </template>
          </n-virtual-list>
        </n-tab-pane>
      </n-tabs>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import * as ionicons5Import from "@vicons/ionicons5";
import * as antdImport from "@vicons/antd";

// 接收 props 和 emits
const props = defineProps({
  value: String  // 接收父组件传递的 v-model 数据
});
const emits = defineEmits(["update:value"]);

// 使用 computed 实现双向绑定
const localValue = computed({
  get() {
    return props.value;  // 从 props 获取当前值
  },
  set(newValue) {
    emits("update:value", newValue);  // 当本地 value 变化时，发射事件通知父组件
  }
});

// 图标数据
const ionicons5 = Object.entries(ionicons5Import);
const antd = Object.entries(antdImport);

// 将图标按行分组，每组 10 个
const groupIcons = (icons: [string, any][]) => {
  const grouped: [string, any][][] = [];
  for (let i = 0; i < icons.length; i += 10) {
    grouped.push(icons.slice(i, i + 10));
  }
  return grouped;
};

// 分组后的图标数组
const ionicons5Grouped = computed(() => groupIcons(ionicons5));
const antdGrouped = computed(() => groupIcons(antd));

// 控制 iconStore 的显示与隐藏
const iconStore = ref(false);
const currentTab = ref("ionicons5");

const showIconStore = () => {
  iconStore.value = true;
};

const clickIcon = (icon: string) => {
  localValue.value = icon;  // 更新本地的 value，同时触发 set 方法
  iconStore.value = false;  // 关闭图标选择弹窗
};

const onClear = () => {
  localValue.value = '';  // 清空本地 value，同时触发 set 方法
};
</script>

<style scoped lang="less">
.icon-box {
  width: 900px;
  height: 600px;
  background-color: white;
  border-radius: 4px;
  padding: 10px;
  overflow: hidden;
}

.icon-item {
  border-radius: 4px;
  margin-bottom: 4px;
  width: 100%;
  text-align: center;
  height: 78px;
  cursor: pointer;
}

.icon-item:hover {
  background-color: #e8eaec;
}

.icon-icon {
  margin-top: 4px;
}

p {
  font-size: 12px;
  overflow-wrap: break-word;
  margin-top: 8px;
}
</style>