import { DataTableColumns, NButton, NPopconfirm } from "naive-ui"
import { h, reactive } from "vue"
import dayjs from "dayjs"

const createColumns = (del: any): DataTableColumns => {
    return [
        {
            type: "expand",
            renderExpand: (rowData) => {
                return `${rowData.data}`
            }
        },
        {
            title: "行为名称",
            key: "actionName",
            align: "center",
            ellipsis: true,
            minWidth: 360
        },
        {
            title: "用户ID",
            key: "uid",
            align: "center",
            ellipsis: true,
            width: 100
        },
        {
            title: "用户昵称",
            key: "nickName",
            align: "center",
            ellipsis: true,
            width: 130
        },
        {
            title: "操作URL",
            align: "center",
            key: "url",
            minWidth: 200
        },
        {
            title: "执行时间",
            align: "center",
            width: 200,
            key: "addTime",
            render(row: any) {
                return h("span", dayjs(row.addTime * 1000).format("YYYY-MM-DD HH:mm:ss"))
            }
        },
        {
            title: "操作",
            key: "actions",
            align: "center",
            width: 125,
            render(row: any) {
                return h("div", [
                    h(NPopconfirm,
                        {
                            onPositiveClick: () => {
                                del(row)
                            },
                            negativeText: "取消",
                            positiveText: "确定"
                        },
                        {
                            trigger: () => {
                                return h(
                                    NButton,
                                    {
                                        type: "error"
                                    },
                                    { default: () => "删除" }
                                )
                            },
                            default: () => {
                                return "确认删除该条数据嘛？"
                            }
                        }
                    ),
                ])
            }
        }
    ]
}

const searchOptions = [
    {
        label: "操作URL",
        value: 1
    },
    {
        label: "用户昵称",
        value: 2
    },
    {
        label: "用户ID",
        value: 3
    }
]

const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    itemCount: 0,
    pageSizes: [10, 40, 100]
})

export {
    createColumns,
    searchOptions,
    paginationReactive
}
