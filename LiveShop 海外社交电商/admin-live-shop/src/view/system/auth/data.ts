import { DataTableColumns, NSwitch, NButton } from 'naive-ui'
export const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_, index) {
        let p = paginationReactive.page - 1
        return (index + 1) + (p * paginationReactive.size)
      }
    },
    {
      title: '权限组',
      key: 'name',
      align: 'center'
    },
    {
      title: '描述',
      key: 'description',
      align: 'center'
    },
    {
      title: '成员授权',
      align: 'center',
      key: '',
      width: 130,
      render(row: any) {
        return h(
          NButton,
          {
            secondary: true,
            type: 'primary',
            style: {
              marginRight: '8px'
            },
            size: 'small',
            onClick: () => {
              compHandle.handleMemberList(row)
            }
          },
          {
            default: () => '成员列表'
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
            NButton,
            {
              type: 'primary',
              style: {
                marginRight: '8px'
              },
              tertiary: true,
              onClick: () => {
                compHandle.handleRule(row)
              }
            },
            {
              default: () => '设置权限'
            }
          ),

          h(
            NButton,
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
            }
          ),
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
  groupMember: false,
  groupRule: false,
})

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
})
export const statusOptions = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]
