<template>
    <PageLayout>
        <template #searchForm>
            <n-form
                style="margin-bottom: -24px"
                label-placement="left"
                label-align="right"
                :show-label="false"
                ref="searchFormRef"
                inline
                :model="searchForm"
            >
                <n-select
                    v-model:value="searchForm.status"
                    :options="statusOptions"
                    clearable
                    style="width: 120px; margin-right: 8px"
                />
                <n-form-item path="keywords">
                    <n-input v-model:value="searchForm.keywords" />
                </n-form-item>
                <n-form-item>
                    <n-space>
                        <n-button attr-type="button" type="primary" @click="handleQuery"
                            >查询/刷新</n-button
                        >
                    </n-space>
                </n-form-item>
            </n-form>
        </template>
        <template #btnBar>
            <n-button type="primary" @click="visible.groupConfig = true">
                <template #icon>
                    <n-icon>
                        <component is="antd-PlusOutlined"></component>
                    </n-icon>
                </template>
                新增
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
        <GroupMember v-model:visible="visible.groupMember" :current-row="currentRow" />
        <GroupRule
            v-model:visible="visible.groupRule"
            :current-row="currentRow"
            @confirm="onConfigRuleSuccess"
        />
    </PageLayout>
</template>

<script setup lang="ts">
import { createColumns, paginationReactive, statusOptions, visible, searchForm } from './data';
import GroupConfig from './group-config.vue';
import GroupMember from './group-member.vue';
import GroupRule from './group-rule.vue';
import { getGroupList, delGroup, changeGroupStatus } from '@/api/system/auth';
import { useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const data = ref([]);
const currentRow = ref({});
const columns = createColumns({
    handleChangeStatus(row: any, status: any) {
        const tip: string = status === 1 ? '开启' : '关闭';
        dialog.warning({
            title: '提示',
            content: `确定${tip}${row.name}吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    await changeGroupStatus({ id: row.id, status });
                    fetchList();
                    message.success(`${tip}成功`);
                } catch (error) {}
            },
            onNegativeClick: () => {}
        });
    },
    handleEdit(row: any) {
        currentRow.value = row;
        visible.groupConfig = true;
    },
    handleDel(row: any) {
        dialog.warning({
            title: '警告',
            content: `确定删除${row.name}吗？`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    await delGroup({ id: row.id });
                    fetchList();
                    message.success('删除成功');
                } catch (error) {}
            },
            onNegativeClick: () => {}
        });
    },
    handleMemberList(row: any) {
        currentRow.value = row;
        visible.groupMember = true;
    },
    handleRule(row) {
        currentRow.value = row;
        visible.groupRule = true;
    }
});

function fetchList() {
    getGroupList({
        ...searchForm,
        page: paginationReactive.page,
        pageSize: paginationReactive.size
    }).then(res => {
        data.value = res.data.list;
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

/* 查询 */
function handleQuery() {
    paginationReactive.page = 1;
    fetchList();
}

/* 配置规则成功 */
function onConfigRuleSuccess() {
    currentRow.value = {};
    visible.groupRule = false;
}

onMounted(() => {
    fetchList();
});
</script>
