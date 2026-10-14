import { DataTableColumns, NSwitch, NButton } from 'naive-ui'
export const createColumns = (compHandle: any): DataTableColumns => {
    return [
        {
            title: '序号',
            key: 'id',
            align: 'center',
            width: 80,
            render(_, index) {
                return index + 1
            }
        },
        {
            title: '频道名称',
            key: 'name',
            align: 'center'
        },
        {
            title: '频道标识',
            key: 'description',
            align: 'center'
        },
        {
            title: '类型',
            key: 'type',
            align: 'center',
            render(row: any) {
                return h(
                    NButton,
                    {
                        secondary: true,
                        type: row.id == 1 ? 'primary' : 'error',
                        style: {
                            marginRight: '8px'
                        },
                        size: 'small',
                        onClick: () => {
                            // compHandle.xxxxxxx(row)
                        }
                    },
                    {
                        default: () => {
                            if (row.id == 1) {
                                return '系统频道'
                            }
                            return '自定义频道'
                        }
                    }
                )
            }
        },
        {
            title: '状态',
            key: 'status',
            align: 'center',
            width: 130,
            render(row: any) {
                return h(
                    NSwitch,
                    {
                        value: row.status as number,
                        checkedValue: 1,
                        round: false,
                        uncheckedValue: 0,
                        onUpdateValue: (value: any) => {
                            compHandle.handleChangeStatus(row, value)
                        }
                    },
                    {
                        checked: () => '开启',
                        unchecked: () => '关闭'
                    }
                )
            }
        },
        {
            title: '操作',
            key: '',
            align: 'center',
            width: 280,
            render(row: any) {
                return h('div', [
                    h(
                        () => {
                            if (row.id != 1) {
                                return h(NButton,
                                    {
                                        type: 'primary',
                                        style: {
                                            marginRight: '8px'
                                        },
                                        onClick: () => {
                                            compHandle.handleEdit(row)
                                        }
                                    },
                                    {
                                        default: () => '编辑'
                                    })
                            }
                        }
                    )
                    ,
                    // h(
                    //     NButton,
                    //     {
                    //         type: 'primary',
                    //         style: {
                    //             marginRight: '8px'
                    //         },
                    //         onClick: () => {
                    //             compHandle.handleEdit(row)
                    //         }
                    //     },
                    //     {
                    //         default: () => '编辑'
                    //     }
                    // ),
                    h(
                        NButton,
                        {
                            type: 'error',
                            onClick: () => {
                                compHandle.handleDel(row)
                            }
                        },
                        {
                            default: () => '删除'
                        }
                    )
                ])
            }
        }
    ]
}

export const searchForm = reactive({
    keywords: '',
    status: undefined
})

export const visible = reactive({
    groupConfig: false,
})

export const paginationReactive = reactive({
    page: 1,
    size: 10,
    total: 0,
})
export const statusOptions = [
    {
        label: '开启',
        value: 1
    },
    {
        label: '关闭',
        value: 0
    }
]
