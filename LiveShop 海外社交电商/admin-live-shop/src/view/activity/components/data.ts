import {NButton, NPopconfirm} from "naive-ui";

const delButton = (h: any, row: any, compHandle: any) => {
  return h(
    NButton,
    {
      type: 'error',
      style: {
        marginRight: '8px',
      },
      onClick: () => {
        compHandle.handleDel(row);
      },
      disabled: row.onSale == 2
    },
    {
      default: () => '删除',
    }
  )
}

const editButton = (h: any, row: any, compHandle: any) => {
  return h(
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
  )
}

const showButton = (h: any, row: any, compHandle: any) => {
  return h(
    NButton,
    {
      type: 'info',
      style: {
        marginRight: '8px',
      },
      onClick: () => {
        compHandle.handleDefault(row)
      }
    },
    {
      default: () => '查看'
    }
  )
}

const changeStatus = (h: any, row: any, compHandle: any) => {
  let s = row.onSale == 1 ? '上架' : '下架'

  return h(NPopconfirm,
    {
      onPositiveClick: () => {
        compHandle.handleUnmount(row);
      },
      negativeText: "取消",
      positiveText: "确定",
    },
    {
      trigger: () => {
        return h(
          NButton,
          {
            type: "warning"
          },
          {default: () => s}
        )
      },
      default: () => {
        return "确认"+s+"该条数据嘛？"
      }
    }
  )
}

const searchOptions = [
  {
    label: "众筹活动",
    value: '1'
  },
  {
    label: "拼团活动",
    value: '2'
  }
]

export {
  delButton,
  searchOptions,
  editButton,
  showButton,
  changeStatus
}
