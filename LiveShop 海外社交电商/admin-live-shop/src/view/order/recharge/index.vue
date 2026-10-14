<template>
  <div>
    <n-grid cols="24" x-gap="10" item-responsive responsive="screen">
      <n-grid-item span="24 m:24 l:24">
        <n-space :wrap-item="false">
          <n-card content-style="padding: 15px;">
            <n-form
              style="margin-bottom: -24px"
              label-placement="left"
              label-align="right"
              ref="searchFormRef"
              inline
              :model="form"
            >
              <n-form-item path="keyword" label="用户ID">
                <n-input-number
                  v-model:value="form.userId"
                  clearable
                  :show-button="false"
                  :max="999999999"
                />
              </n-form-item>
              <n-form-item label="订单状态">
                <n-select
                  v-model:value="form.paymentStatus"
                  :options="searchOptions"
                  clearable
                  style="width: 120px"
                />
              </n-form-item>
              <n-form-item label="付款时间">
                <!-- :formatted-value="dateTimeFormat" -->
                <n-date-picker
                  v-model:value="rangeTime"
                  type="daterange"
                  clearable
                  separator="—"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </n-form-item>

              <n-form-item>
                <n-space>
                  <n-button attr-type="button" type="primary" @click="searchForm"
                    >查询/刷新
                  </n-button>
                  <n-button attr-type="button" type="primary" @click="resetForm">重置 </n-button>
                </n-space>
              </n-form-item>
            </n-form>
          </n-card>
          <n-card content-style="padding:15px">
            <n-data-table
              :columns="columns"
              :data="listData"
              :single-line="false"
              :row-key="(row: any) => {return row.id}"
            />
            <!-- flex-height
                style="height: 650px"
                :max-height="650" -->

            <Pagination
              v-model:total="paginationReactive.itemCount"
              v-model:page="paginationReactive.page"
              v-model:limit="paginationReactive.pageSize"
              @pagination="getListData"
            />
          </n-card>
        </n-space>
      </n-grid-item>
    </n-grid>
    <n-modal
      v-model:show="showModal"
      title=""
      transform-origin="center"
      preset="dialog"
      :show-icon="false"
      style="width: 950px"
    >
      <div class="modelCustomHead flex">
        <span></span>
        订单详情
      </div>
      <div class="rowsItems">
        <div class="items_content flex" v-for="(item, index) in tableColumn" :key="index">
          <p class="items_label">{{ item.title }}:</p>
          <p v-if="item.key == 'paymentStatus'">
            <n-tag :type="tableRowsDate[item.key] === 2 ? 'success' : 'error'">
              {{ tableRowsDate[item.key] === 2 ? '支付成功' : '支付失败' }}
            </n-tag>
          </p>
          <p v-else-if="item.key == 'paymentType'">
            {{ paymentTypeList.find(v => v.value == tableRowsDate[item.key])?.label || '其他支付' }}
            <!-- {{ tableRowsDate[item.key] === 1 ? '谷歌支付' : '其他支付' }} -->
          </p>
          <p v-else>{{ tableRowsDate[item.key] || '-' }}</p>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { createColumns, paginationReactive, searchOptions, paymentTypeList } from './data';
import { onMounted, reactive, ref } from 'vue';
import { getRechargeOrderList } from '@/api/order-manage/order';
import dayjs from 'dayjs';

const showModal = ref(false);
const tableRowsDate = ref<any>({});
const tableColumn = ref<any[]>([]);

const columns = createColumns({
  handleDefault(row: any) {
    tableRowsDate.value = row;
    showModal.value = true;
    tableColumn.value = columns.slice(0, -1);
  }
});

const defaultForm = {
  paymentStatus: null,
  userId: null
};
const rangeTime = ref(null);

const form = reactive({
  ...defaultForm
});

const getListData = () => {
  getRechargeOrderList({
    ...form,
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize,
    payTime: rangeTime.value
      ? [
          dayjs(rangeTime.value![0]).format('YYYY-MM-DD'),
          dayjs(rangeTime.value![1]).format('YYYY-MM-DD')
        ]
      : null
  }).then(result => {
    listData.value = result.data.list;
    paginationReactive.itemCount = result.data.count;
  });
};

const searchForm = () => {
  paginationReactive.page = 1;
  getListData();
};

const resetForm = () => {
  Object.assign(form, defaultForm);
  rangeTime.value = null;
  paginationReactive.page = 1;
  getListData();
};

const listData = ref();

// 在组件挂载后执行的逻辑
onMounted(async () => {
  getListData();
});
</script>

<style lang="less" scoped>
.modelCustomHead {
  font-size: 14px;
  font-weight: 600;
  align-items: center;
  height: 30px;
  margin-bottom: 20px;

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
  flex-wrap: wrap;

  .items_content {
    width: 33.3%;
    margin-bottom: 10px;
    color: #333333;

    p {
      display: flex;
      align-items: center;
    }

    .items_label {
      width: 90px;
      text-align: left;
      color: rgb(164, 164, 164);
    }
  }
}
</style>
