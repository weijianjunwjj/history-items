<template>
    <PageLayout>
        <template #btnBar>
            <n-button type="primary" @click="visible.groupConfig = true">
                <template #icon>
                    <n-icon>
                        <component is="antd-PlusOutlined"></component>
                    </n-icon>
                </template>
                新增充值档位
            </n-button>
        </template>
        <n-dialog-provider>
            <n-data-table :single-line="false" :columns="columns" :data="data" />
        </n-dialog-provider>
        <!-- <Pagination
             v-model:total="paginationReactive.total"
             v-model:page="paginationReactive.page"
             v-model:limit="paginationReactive.size"
            @pagination="fetchList"
        /> -->
        <newEditForm
            :visible="visible.groupConfig"
            :current-row="currentRow"
            @cancel="onCancelGroupConfig"
            @confirm="configGroupSuccess"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import { createColumns, paginationReactive, visible } from './data';
import newEditForm from './new-edit-form.vue';
import { getRechargeList, delRecharge } from '@/api/promotion/recharge';
import { useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const data = ref([]);
const currentRow = ref({});
const columns = createColumns({
    handleEdit(row: any) {
        currentRow.value = row;
        visible.groupConfig = true;
    },
    handleDel(row: any) {
        dialog.warning({
            title: '警告',
            content: `确定删除${row.gearName}这个充值档位吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    await delRecharge({ id: row.id });
                    fetchList();
                    message.success('删除成功');
                } catch (error) {}
            },
            onNegativeClick: () => {}
        });
    }
});

function fetchList() {
    getRechargeList({
        // page: paginationReactive.page,
        // size: paginationReactive.size
    }).then(res => {
        data.value = res.data;
        // paginationReactive.total = res.data.count;
    });
}

/* 取消新增编辑 */
function onCancelGroupConfig() {
    currentRow.value = {};
    visible.groupConfig = false;
}

/* 新增编辑成功 */
function configGroupSuccess() {
    fetchList();
    currentRow.value = {};
    visible.groupConfig = false;
}

/* 查询 */
function handleQuery() {
    paginationReactive.page = 1;
    fetchList();
}

onMounted(() => {
    fetchList();
});
</script>
