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
                <n-col v-for="row in data" :key="row.id" :span="6">
                    <n-card
                        :title="row.name || templateTypeOptions.find(item => Number(item.value) === Number(row.templateType))?.label || '消息通知'"
                        header-style="background:rgb(232 232 232);padding:10px 24px;"
                    >
                        <template #header-extra>
                            <n-switch :value="row.onSale === 2" @update:value="handleToggle(row, $event)" />
                        </template>
                        <div style="margin-top: 20px">
                            {{ row.content || row.templateContent || '暂无通知内容' }}
                        </div>
                        <template #footer>
                            <n-flex justify="space-between" align="center">
                                <n-space>
                                    <n-checkbox :checked="Boolean(row.inSite ?? true)" disabled>
                                        站内通知</n-checkbox
                                    >
                                    <n-checkbox :checked="Boolean(row.outSite)" disabled>
                                        站外通知</n-checkbox
                                    >
                                </n-space>
                                <n-button quaternary type="error" @click="handleDel(row)">删除</n-button>
                            </n-flex>
                        </template>
                    </n-card>
                </n-col>
            </n-row>
            <n-empty v-if="!data.length" description="暂无消息通知" style="margin: 40px 0" />

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
import { visible, searchForm, templateTypeOptions } from './data';
import { ref, onMounted } from 'vue';
import GroupConfig from './group-config.vue';
import { getNotificationList, delNotification, OnChangeNotification } from '@/api/operate/message';
import { useMessage, useDialog } from 'naive-ui';

const message = useMessage();
const dialog = useDialog();

const data = ref<any[]>([]);
const currentRow = ref({});

async function handleToggle(row: any, enabled: boolean) {
    await OnChangeNotification({ id: row.id, onSale: enabled ? 2 : 1 });
    message.success(enabled ? '通知已开启' : '通知已关闭');
    fetchList();
}

function handleDel(row: any) {
    dialog.warning({
        title: '删除消息通知',
        content: '确定删除这个消息通知吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            await delNotification({ id: row.id });
            fetchList();
            message.success('删除成功');
        },
    });
}

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
