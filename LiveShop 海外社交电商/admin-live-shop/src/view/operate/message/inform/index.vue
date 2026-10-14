<template>
    <PageLayout>
        <template #btnBar>
            <n-button type="primary" @click="visible.groupConfig = true">
                <template #icon>
                    <n-icon>
                        <component is="antd-PlusOutlined"></component>
                    </n-icon>
                </template>
                新增消息
            </n-button>
        </template>
        <n-dialog-provider>
            <n-row :gutter="[20, 10]" style="margin-top: 20px">
                <n-col :span="6">
                    <n-card
                        title="物流通知"
                        header-style="background:rgb(232 232 232);padding:10px 24px;"
                    >
                        <template #header-extra>
                            <n-switch v-model:value="switchvalue" />
                        </template>
                        <div style="margin-top: 20px">
                            您于2024-04-05
                            08:23:24购买的商品【商品名称】已发货，物流单号【SF4663634742】
                        </div>
                        <template #footer>
                            <n-flex justify="space-between" align="center">
                                <n-space>
                                    <n-checkbox v-model:checked="checkedvalue1">
                                        站内通知</n-checkbox
                                    >
                                    <n-checkbox v-model:checked="checkedvalue2">
                                        站外通知</n-checkbox
                                    >
                                </n-space>
                                <n-icon color="red" size="25">
                                    <component is="antd-DeleteOutlined"></component>
                                </n-icon>
                            </n-flex>
                        </template>
                    </n-card>
                </n-col>
            </n-row>

            <!-- <n-data-table :single-line="false" :columns="columns" :data="data" /> -->
        </n-dialog-provider>
        <GroupConfig
            :visible="visible.groupConfig"
            :current-row="currentRow"
            @cancel="onCancelGroupConfig"
            @confirm="configGroupSuccess"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import { createColumns, visible, searchForm } from './data';
import GroupConfig from './group-config.vue';
import { getNotificationList, delNotification, OnChangeNotification } from '@/api/operate/message';
import { useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const data = ref([]);
const currentRow = ref({});
const switchvalue = ref(false);
const checkedvalue1 = ref(false);
const checkedvalue2 = ref(false);
const columns = createColumns({
    handleUnmount(row: any) {
        if (row.onSale == 2) {
            //去下架
            OnChangeNotification({ id: row.id, onSale: 1 }).then(res => {
                message.success('下架成功');
                fetchList();
            });
        } else {
            OnChangeNotification({ id: row.id, onSale: 2 }).then(res => {
                message.success('上架成功');
                fetchList();
            });
        }
    },
    handleEdit(row: any) {
        currentRow.value = row;
        visible.groupConfig = true;
    },
    handleDel(row: any) {
        dialog.warning({
            title: '警告',
            content: `确定删除这个消息通知吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    await delNotification({ id: row.id });
                    fetchList();
                    message.success('删除成功');
                } catch (error) {}
            },
            onNegativeClick: () => {}
        });
    }
});

function fetchList() {
    getNotificationList({
        ...searchForm
    }).then(res => {
        data.value = res?.data?.list || [];
    });
}

/* 取消组配置 */
function onCancelGroupConfig() {
    currentRow.value = {};
    visible.groupConfig = false;
}

/* 配置组成功 */
function configGroupSuccess() {
    fetchList();
    currentRow.value = {};
    visible.groupConfig = false;
}

onMounted(() => {
    fetchList();
});
</script>
