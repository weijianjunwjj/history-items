<template>
    <n-modal
        :show="visible"
        preset="dialog"
        title="组成员"
        style="width: 1080px"
        @close="handleCancel"
    >
        <div style="margin-top: 12px">
            <n-data-table :single-line="false" :columns="columns" :data="data" :max-height="250" />
        </div>
        <Pagination
            :total="paginationReactive.total"
            v-model:page="paginationReactive.page"
            v-model:limit="paginationReactive.size"
            @pagination="fetchList"
        />
    </n-modal>
</template>

<script setup lang="ts">
import { getGroupMemberList, delMember } from '@/api/system/auth';
import { createColumns, paginationReactive } from './member-data';
import { useMessage } from 'naive-ui';

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

const data = ref([]);

const columns = createColumns({
    async handleDel(row: any) {
        try {
            await delMember({ uid: row.id, gid: props.currentRow.id });
            fetchList();
            message.success('删除成功');
        } catch (error) {}
    }
});
watch(
    () => props.visible,
    n => {
        if (n) {
            paginationReactive.page = 1;
            paginationReactive.size = 10;
            fetchList();
        }
    }
);

function fetchList() {
    getGroupMemberList({
        page: paginationReactive.page,
        size: paginationReactive.size,
        group_id: props.currentRow.id
    }).then(res => {
        data.value = res.data.list;
        paginationReactive.total = res.data.count;
    });
}

function handleCancel() {
    data.value = [];
    emit('update:visible', false);
}
</script>
