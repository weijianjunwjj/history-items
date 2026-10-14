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
              <n-form-item path="userId" label="用户ID">
                <n-input-number
                  v-model:value="form.userId"
                  clearable
                  :show-button="false"
                  style="width: 150px"
                  :max="999999999"
                />
              </n-form-item>
              <n-form-item path="activityName" label="活动名称">
                <n-input v-model:value="form.activityName" clearable style="width: 150px" />
              </n-form-item>

              <n-form-item label="订单状态">
                <n-select
                  v-model:value="form.orderStatus"
                  :options="searchOptions.orderStatusList"
                  clearable
                  style="width: 120px"
                />
              </n-form-item>
              <n-form-item label="活动状态">
                <n-select
                  v-model:value="form.activityStatus"
                  :options="searchOptions.activityStatusList"
                  clearable
                  style="width: 120px"
                />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button attr-type="button" type="primary" @click="handleSearchSubmit"
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
      v-model:show="showDetailModal"
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
          <p>{{ customKeyLabelFilter(item.key) }}</p>
        </div>
        <div class="items_content flex">
          <p class="items_label">收货人:</p>
          <p>{{ tableRowsDate.receiveName || '-' }}</p>
        </div>
        <div class="items_content flex">
          <p class="items_label">联系方式:</p>
          <p>{{ tableRowsDate.receivePhone || '-' }}</p>
        </div>
        <div class="items_content flex" style="width: 800px">
          <p class="items_label">收货地址:</p>
          <p>{{ tableRowsDate.receiveAddress || '-' }}</p>
        </div>
      </div>
      <div class="goodTableTitle flex"><span></span>商品清单</div>
      <div class="detailTableBox">
        <n-data-table
          :columns="detailColumns"
          :data="tableRowsDate.rewardList"
          :row-key="(row: any) => {return row.id}"
          :max-height="180"
          :single-line="false"
        />
      </div>
    </n-modal>
    <changeShipping
      :visible="shippingModel"
      :current-row="currentRow"
      @cancel="handleShippingCancel"
      @confirm="handleShippingSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { createColumns, paginationReactive, searchOptions } from './data';
import { h, onMounted, reactive, ref } from 'vue';
import { getGroupOrderCrowdList, onGroupOrderRefundAudit } from '@/api/order-manage/order';
import { NInput, useDialog, useMessage } from 'naive-ui';
import changeShipping from '../change-shipping.vue';

const message = useMessage();
const dialog = useDialog();
const showDetailModal = ref(false);
const tableRowsDate = ref<any>({});
const tableColumn = ref<any[]>([]);
const shippingModel = ref(false);
const currentRow = ref({});

function handleShippingSubmit() {
  getListData();
  currentRow.value = {};
  shippingModel.value = false;
}

function handleSearchSubmit() {
  paginationReactive.page = 1;
  getListData();
}

function handleShippingCancel() {
  currentRow.value = {};
  shippingModel.value = false;
}

const columns = createColumns({
  handleLogShippingSn(row: any) {
    currentRow.value = row;
    shippingModel.value = true;
  },
  handleDefault(row: any) {
    tableRowsDate.value = row;
    showDetailModal.value = true;
    tableColumn.value = columns.slice(0, -1);
  },
  refundExamineOrder(row: any, status: string) {
    const tip: string = status == '1' ? '同意' : '拒绝';
    const reasonInput = ref('');
    dialog.warning({
      title: '提示',
      positiveText: '确定',
      negativeText: '取消',
      content: () => {
        return h('div', [
          h(
            'p',
            {
              class: 'customDialogP',
              style: {
                marginBottom: '10px'
              }
            },
            {
              default: () => `确定${tip}活动为${row.activityName}订单的退款申请吗？`
            }
          ),
          h(() => {
            if (status == '2') {
              return h(NInput, {
                type: 'textarea',
                placeholder: '请输入拒绝退款的理由',
                value: reasonInput.value,
                onUpdateValue(v) {
                  reasonInput.value = v;
                }
              });
            }
          })
        ]);
      },
      onPositiveClick: async () => {
        if (status == '2' && !reasonInput.value) {
          message.warning('请输入拒绝退款的理由！');
          return false;
        }
        await onGroupOrderRefundAudit({
          id: row.id,
          action: Number(status),
          reason: reasonInput.value
        });
        getListData();
        message.success(`已${tip}退款!`);
      },
      onNegativeClick: () => {
        reasonInput.value = '';
      }
    });
  }
});

const detailColumns = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
    width: 80,
    render(_: Object, index: number) {
      return index + 1;
    }
  },
  {
    title: '兑奖编号',
    key: 'rewardSn',
    align: 'center'
  },
  {
    title: '兑奖状态',
    key: 'rewardStatus',
    align: 'center',
    render(row: any) {
      return ['未中奖', '已中奖'][row.rewardStatus - 1];
    }
  }
];

function customKeyLabelFilter(key: string) {
  if (key == 'activityStatus') {
    return searchOptions.activityStatusList.find(v => v.value == tableRowsDate.value[key])?.label;
  }
  if (key == 'orderStatus') {
    return searchOptions.orderStatusList.find(v => v.value == tableRowsDate.value[key])?.label;
  }

  return tableRowsDate.value[key];
}

const defaultForm = {
  orderStatus: null,
  activityStatus: null,
  userId: null,
  activityName: ''
};

const form = reactive({
  ...defaultForm
});

const getListData = () => {
  getGroupOrderCrowdList({
    ...form,
    page: paginationReactive.page,
    pageSize: paginationReactive.pageSize
  }).then(result => {
    listData.value = result.data.list;
    paginationReactive.itemCount = result.data.count;
  });
};

const resetForm = () => {
  Object.assign(form, defaultForm);
  paginationReactive.page = 1;
  getListData();
};

const listData = ref();

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
      width: 80px;
      text-align: left;
      color: rgb(164, 164, 164);
    }
  }
}

.goodTableTitle {
  font-size: 14px;
  font-weight: 600;
  align-items: center;
  height: 30px;
  margin-bottom: 10px;
  margin-top: 10px;

  span {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #105cfb;
    margin-right: 5px;
  }
}
</style>
