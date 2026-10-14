import { DataTableColumns, NTag, NButton, NPopconfirm } from 'naive-ui'
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
            title: '用户名',
            key: 'username',
            align: 'center'
        },
        {
            title: '用户昵称',
            key: 'nickname',
            align: 'center'
        },
        // {
        //   title: '登录次数',
        //   key: 'login_times',
        //   align: 'center',
        //   width: 100,
        // },
        // {
        //   title: '最后登录时间',
        //   key: 'last_login_time',
        //   align: 'center',
        //   width: 180,
        // },
        // {
        //   title: '最后登录IP',
        //   key: 'last_login_ip',
        //   align: 'center',
        //   width: 160,
        // },
        {
            title: '状态',
            align: 'center',
            key: '',
            width: 80,
            render(row: any) {
                return h(
                    NTag,
                    {
                        type: row.status === 1 ? 'success' : 'error'
                    },
                    {
                        default: () => (row.status === 1 ? '正常' : '封号')
                    }
                )
            }
        },
        {
            title: '操作',
            key: '',
            align: 'center',
            render(row: any) {
                return h(
                    NPopconfirm,
                    {
                        onPositiveClick() {
                            compHandle.handleDel(row)
                        },
                        onNegativeClick() { }
                    },
                    {
                        default: () => `确定删除${row.username}吗？`,
                        trigger: () => {
                            return h(
                                NButton,
                                {
                                    type: 'error'
                                },
                                {
                                    default: () => '删除'
                                }
                            )
                        }
                    }
                )
            }
        }
    ]
}

export const paginationReactive = reactive({
    page: 1,
    size: 10,
    total: 0
})
