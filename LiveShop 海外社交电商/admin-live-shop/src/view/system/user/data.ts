import {DataTableColumns, NButton, NPopconfirm, NSwitch} from "naive-ui"

const editButton = (h: any, row: any, compHandle: any) => {
  return h(NButton, {
    type: "primary",
    onClick: () => {
      compHandle.edit(row)
    }
  }, {default: () => "编辑"})
}

const delButton = (h: any, row: any, compHandle: any) => {
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

const statusElement = (h: any, row: any, compHandle: any) => {
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

const ipElement = (h: any, row: any) => {
  if (
    Object.prototype.hasOwnProperty.call(row, "user_data") &&
    !Object.prototype.hasOwnProperty.call(row, "userData")
  ) {
    row.userData = row.user_data
  }

  return h("span", row.userData === null ? "" : row.userData[0].last_login_ip)
}

const timeElement = (h: any, row: any) => {
  if (
    Object.prototype.hasOwnProperty.call(row, "user_data") &&
    !Object.prototype.hasOwnProperty.call(row, "userData")
  ) {
    row.userData = row.user_data
  }
  return h("span", row.userData === null ? "" : row.userData[0].last_login_time)
}

const loginTimesElement = (h: any, row: any) => {
  if (
    Object.prototype.hasOwnProperty.call(row, "user_data") &&
    !Object.prototype.hasOwnProperty.call(row, "userData")
  ) {
    row.userData = row.user_data
  }
  return h("span", row.userData === null ? "" : row.userData[0].login_times)
}

const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: "ID",
      key: "id",
      align: "center",
      width: 80,
    },
    {
      title: "用户账号",
      key: "username",
      align: "center",
      maxWidth: 100,
      ellipsis: true,
    },
    {
      title: "用户昵称",
      key: "nickname",
      align: "center",
      ellipsis: true,
    },
    {
      title: "登录次数",
      key: "login_times",
      align: "center",
      render(row: any) {
        return loginTimesElement(h, row)
      }
    },
    {
      title: "最后登录时间",
      key: "last_login_time",
      align: "center",
      render(row: any) {
        return timeElement(h, row)
      }
    },
    {
      title: "最后登录IP",
      key: "last_login_ip",
      align: "center",
      render(row: any) {
        return ipElement(h, row)
      }
    },
    {
      title: "状态",
      key: "status",
      width: 100,
      align: "center",
      render(row: any) {
        return statusElement(h, row, compHandle)
      }
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      width: 180,
      render(row: any) {
        return h("div", [
          editButton(h, row, compHandle),
          delButton(h, row, compHandle)
        ])
      }
    }
  ]
}

const originFormItem = {
  username: "",
  nickname: "",
  password: "",
  group_id: [],
  id: 0
}

const groupList = reactive({
  info: []
})

const formItem = reactive({
  ...originFormItem
})

const searchOptions = {
  status: [
    {
      label: "启用",
      value: 1
    },
    {
      label: "禁用",
      value: 2
    }
  ],
  type: [
    {
      label: "用户账号",
      value: 1
    },
    {
      label: "用户昵称",
      value: 2
    }
  ]
}

const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0
})

const searchForm = reactive({
  type: null,
  keywords: "",
  status: null
})

const formRules = {
  username: [
    {required: true, message: "用户账号不能为空", trigger: "blur"}
  ],
  nickname: [
    {required: true, message: "用户昵称不能为空", trigger: "blur"}
  ],
  password: [
    {required: true, message: "用户密码不能为空", trigger: "blur"}
  ],
}

export {
  createColumns,
  groupList,
  formRules,
  searchOptions,
  searchForm,
  originFormItem,
  formItem,
  paginationReactive
}
