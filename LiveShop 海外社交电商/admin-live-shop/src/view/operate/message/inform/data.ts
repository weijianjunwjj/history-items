import { DataTableColumns, NButton } from 'naive-ui';

export const createColumns = (compHandle: any): DataTableColumns => {
    return [
        {
            title: '序号',
            key: 'id',
            align: 'center',
            width: 80,
            render(_, index) {
                return index + 1;
            },
        },
        {
            title: '模板名称',
            key: 'name',
            align: 'center',
        },
        {
            title: '模板类型',
            key: 'rule',
            align: 'center',
            render(row: any) {
                return templateTypeOptions.find(v => v.value == row.rule)?.label || ' '
            }
        },
        {
            title: '模板编号',
            key: 'name',
            align: 'center',
        },
        {
            title: '模板内容',
            key: 'name',
            align: 'center',
            width: 250,
            ellipsis: {
                tooltip: true
            }
        },
        {
            title: '创建人',
            key: 'creatorName',
            align: 'center',
        },
        {
            title: '创建时间',
            key: 'createdAt',
            align: 'center',
        },
        {
            title: '操作',
            key: '',
            align: 'center',
            width: 280,
            render(row: any) {
                return h('div', [
                    h(
                        NButton,
                        {
                            type: 'primary',
                            style: {
                                marginRight: '8px',
                            },
                            onClick: () => {
                                compHandle.handleEdit(row);
                            },
                        },
                        {
                            default: () => '编辑',
                        }
                    ),
                    h(
                        NButton,
                        {
                            type: 'error',
                            onClick: () => {
                                compHandle.handleDel(row);
                            },
                            disabled: row.onSale == 2 ? true : false
                        },
                        {
                            default: () => '删除',
                        }
                    ),
                    h(
                        NButton,
                        {
                            type: 'primary',
                            style: {
                                marginRight: '8px',
                            },
                            onClick: () => {
                                compHandle.handleUnmount(row);
                            },
                        },
                        {
                            default: () => (row.onSale == 1 ? '上架' : '下架')
                        }
                    )
                ]);
            },
        },
    ];
};

export const searchForm = reactive({
    name: ''
});

export const visible = reactive({
    groupConfig: false
});

export const templateTypeOptions = [
    {
        label: '物流通知',
        value: '1',
    },
    {
        label: '服务通知',
        value: '2',
    },
    {
        label: '动态通知',
        value: '3',
    },
]