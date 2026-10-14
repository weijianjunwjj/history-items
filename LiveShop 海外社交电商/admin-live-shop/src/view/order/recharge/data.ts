import { DataTableColumns, NButton, NTag } from "naive-ui"
import { h, reactive } from "vue"

const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: "订单编号",
      key: "orderSn",
      align: "center",
      width: 280,
    },
    {
      title: "用户ID",
      key: "userId",
      align: "center",
      width: 150,
    },
    {
      title: "付款时间",
      key: "payTime",
      align: "center",
      width: 180,
    },
    {
      title: "充值金额",
      key: "rechargeAmount",
      align: "center",
      width: 120,
    },
    {
      title: "实付金额",
      key: "paidAmount",
      align: "center",
      width: 120,
    },
    {
      title: "到账金币",
      key: "coinReceived",
      align: "center",
      width: 140,
    },
    {
      title: "收款账号",
      key: "receivingAccount",
      align: "center",
      minWidth: 280,
    },
    {
      title: "付款方式",
      key: "paymentType",
      align: "center",
      width: 100,
      render(row: any) {
        return h(
          'span',
          { clss: "paymentspan" },
          {
            default: () => {
              return paymentTypeList.find(v => v.value == row.paymentType)?.label || "其他支付"
            }
          }
        )
      }
    },
    {
      title: "支付状态",
      key: "paymentStatus",
      align: "center",
      width: 100,
      render(row: any) {
        return h(
          NTag,
          {
            type: row.paymentStatus === 2 ? 'success' : 'error'
          },
          {
            default: () => (row.paymentStatus === 2 ? '支付成功' : '支付失败')
          }
        )
      }
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      width: 125,
      render(row) {
        return h("div", [
          h(
            NButton,
            {
              type: 'info',
              onClick: () => {
                compHandle.handleDefault(row)
              }
            },
            {
              default: () => '查看'
            }
          )
        ])
      }
    }
  ]
}

const searchOptions = [
  {
    label: "支付成功",
    value: 2
  },
  {
    label: "支付失败",
    value: 1
  }
]

const paymentTypeList = [
  {
    label: "谷歌支付",
    value: 1
  },
  {
    label: "PayPal支付",
    value: 2
  },
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
  paginationReactive,
  paymentTypeList
}

