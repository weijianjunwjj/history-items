import {NButton, NPopconfirm, NSwitch} from "naive-ui";

export const editButton = (h: any, row: any, compHandle: any) => {
    return h(NButton, {
        type: "primary",
        onClick: () => {
            compHandle.edit(row)
        }
    }, {default: () => "编辑"})
}

export const delButton = (h: any, row: any, compHandle: any) => {
    return h(NPopconfirm,
        {
            onPositiveClick: () => {
                compHandle.del(row)
            },
            negativeText: "取消",
            positiveText: "确定",
        },
        {
            trigger: () => {
                return h(
                    NButton,
                    {
                        type: "error",
                        style: {
                            "margin-left": "8px"
                        }
                    },
                    {default: () => "删除"}
                )
            },
            default: () => {
                return "确认删除该条数据嘛？"
            }
        }
    )
}

export const statusElement = (h: any, row: any, compHandle: any) => {
    return h(NSwitch, {
        round: false,
        checkedValue: 1,
        uncheckedValue: 0,
        defaultValue: row.status,
        onUpdateValue: (value: any) => {
            compHandle.changeStatus(row, value)
        }
    })
}
