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
            <n-data-table :single-line="false" :columns="columns" :data="data" />
        </n-dialog-provider>
        <Pagination
            v-model:total="paginationReactive.total"
            v-model:page="paginationReactive.page"
            v-model:limit="paginationReactive.size"
            @pagination="fetchList"
        />
        <GroupConfig
            :visible="visible.groupConfig"
            :current-row="currentRow"
            @cancel="onCancelGroupConfig"
            @confirm="configGroupSuccess"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import {
    createColumns,
    visible,
    searchForm,
    templateTypeOptions,
    paginationReactive
} from './data';
import GroupConfig from './group-config.vue';
import {
    getMessageTemplateList,
    delMessageTemplate,
    OnSaleMessageTemplate
} from '@/api/operate/message';
import { useMessage, useDialog } from 'naive-ui';
import { getDictSn } from '@/api/login';

getDictSnFn();

const message = useMessage();
const dialog = useDialog();

const data = ref([]);
const currentRow = ref({});
const columns = createColumns({
    handleUnmount(row: any) {
        OnSaleMessageTemplate({ id: row.id, status: row.status == 2 ? 1 : 2 }).then(res => {
            message.success(`${row.status == 2 ? '下架' : '上架'}成功`);
            fetchList();
        });
    },
    handleEdit(row: any) {
        currentRow.value = row;
        visible.groupConfig = true;
    },
    handleDel(row: any) {
        dialog.warning({
            title: '警告',
            content: `确定删除${row.name}这个模版吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    await delMessageTemplate({ ids: [row.id] });
                    fetchList();
                    message.success('删除成功');
                } catch (error) {}
            },
            onNegativeClick: () => {}
        });
    }
});

function fetchList() {
    getMessageTemplateList({
        page: paginationReactive.page,
        pageSize: paginationReactive.size
    }).then(res => {
        data.value = res?.data?.list || [];
        paginationReactive.total = res.data.count;
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

function getDictSnFn() {
    getDictSn('MESSAGE_TYPE').then((res: any) => {
        if (res.code === 0) {
            templateTypeOptions.value = res?.data?.list.map((v: any) => ({
                value: v.value,
                label: v.label
            }));
        }
    });
}

onMounted(() => {
    fetchList();
});
</script>
