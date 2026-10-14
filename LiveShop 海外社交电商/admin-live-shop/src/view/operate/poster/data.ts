import {DataTableColumns, FormItemRule, NButton, NPopconfirm, NSwitch, SelectOption} from "naive-ui"

const editButton = (h: any, row: any, compHandle: any) => {
  return h(NButton, {
    type: "primary",
    disabled: row.status == 1,
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
            disabled: row.status == 1,
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

const optionElement = (h: any, row: any, optionArr: Array<SelectOption>, key: string) => {
  let n = ""
  optionArr.forEach((item: any) => {
    if (item.value as number == row[key]) {
      n = item.label
    }
  })
  return h("span", n)
}

const statusElement = (h: any, row: any, compHandle: any) => {
  return h(NSwitch, {
    round: false,
    checkedValue: 1,
    uncheckedValue: 2,
    defaultValue: row.status,
    onUpdateValue: (value: any) => {
      compHandle.changeStatus(row, value)
    }
  }, {
    checked: () => '上架',
    unchecked: () => '下架'
  })
}

const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: "广告名称",
      key: "name",
      align: "center",
      maxWidth: 100,
      ellipsis: true,
    },
    {
      title: "广告类型",
      key: "openType",
      align: "center",
      width: 100,
      render(row: any) {
        return optionElement(h, row, searchOptions.type, "openType")
      }
    },
    {
      title: "广告位置",
      key: "",
      align: "center",
      width: 160,
      render(row: any) {
        return optionElement(h, row, compHandle.adPosition.value, "locationId")
      }
    },
    {
      title: "广告状态",
      key: "",
      width: 100,
      align: "center",
      render(row: any) {
        return statusElement(h, row, compHandle)
      }
    },
    {
      title: "创建人",
      key: "createdName",
      align: "center",
      width: 160,
      ellipsis: true,
    },
    {
      title: "创建时间",
      key: "createdAt",
      width: 220,
      align: "center"
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
  name: "",
  description: "",
  picture: "",
  openType: 1,
  jumpUrl: "",
  locationId: "",
  sortId: 0, // 数字越大越靠前
  status: 1,
  id: 0
}

const formItem = reactive({
  ...originFormItem
})

const searchOptions = {
  status: [
    {
      label: "上架",
      value: 1
    },
    {
      label: "下架",
      value: 2
    }
  ],
  type: [
    {
      label: "仅展示",
      value: 1
    },
    {
      label: "普通内页",
      value: 2
    },
    {
      label: "三方网站",
      value: 3
    },
    {
      label: "Tab页",
      value: 4
    }
  ]
}

const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0
})

const searchForm = reactive({
  openType: null,
  name: "",
  status: null
})

const formRules = {
  name: [
    {required: true, message: "广告名称不能为空", trigger: "blur"}
  ],
  openType: [
    {required: true, type: 'number', message: "请选择广告类型", trigger: "blur"}
  ],
  status: [
    {required: true, type: 'number', message: "请选择广告状态", trigger: "blur"}
  ],
  locationId: [
    {required: true, message: "请选择广告位置", trigger: "blur"}
  ],
  sortId: [
    {required: true, type: 'number', message: "广告排序不能为空", trigger: "blur"}
  ],
  description: [
    {required: true, message: "广告简介不能为空", trigger: "blur"}
  ],
  jumpUrl: [
    {required: true, message: "URL地址不能为空", trigger: "blur"}
  ],
  picture: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请上传广告头图',
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('请上传广告头图');
      }
      return true;
    },
  },
}

export {
  createColumns,
  formRules,
  searchOptions,
  searchForm,
  originFormItem,
  formItem,
  paginationReactive
}
