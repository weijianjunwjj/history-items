import { DataTableColumns, NButton } from 'naive-ui'
export const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_: any, index: number) {
        return index + 1
      }
    },
    {
      title: '充值档位名称',
      key: 'gearName',
      align: 'center'
    },
    {
      title: '金币数量',
      key: 'coinNum',
      align: 'center'
    },
    {
      title: '充值金额',
      key: 'amount',
      align: 'center'
    },
    {
      title: '额外赠送金币比例(%)',
      key: 'giftRatio',
      align: 'center'
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

export const visible = reactive({
  groupConfig: false,
})

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
})
