import {DataTableColumns, NButton, NDropdown, NTag} from "naive-ui"
import {h, reactive} from "vue"

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
      title: "活动名称",
      key: "activityName",
      align: "center",
      minWidth: 280,
    },
    {
      title: "活动状态",
      key: "activityStatus",
      align: "center",
      width: 100,
      render(row: any) {
        return h(
          NTag,
          {
            type: 'default'
          },
          {
            default: () => {
              return searchOptions.activityStatusList.find(v => v.value == row.activityStatus)?.label || "活动结束"
            }
          }
        )
      }
    },

    {
      title: "支付金币",
      key: "paiedCoin",
      align: "center",
      width: 120,
    },
    {
      title: "支付积分",
      key: "paiedIntegral",
      align: "center",
      width: 120,
    },
    {
      title: "创建时间",
      key: "createdAt",
      align: "center",
      width: 180,
    },
    {
      title: "订单状态",
      key: "orderStatusMsg",
      align: "center",
      width: 100,
      render(row: any) {
        if (!row.orderStatusMsg) return ""
        return h(
          NTag,
          {
            type: 'primary',
            color: colorArrayList[row.orderStatus - 1]
          },
          {
            default: () => {
              return row.orderStatusMsg
              // return searchOptions.orderStatusList.find(v => v.value == row.orderStatus).label
            }
          }
        )
      }
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      width: 280,
      render(row) {
        return h("div", [
          h(
            NButton,
            {
              type: 'info',
              style: {
                marginRight: '8px'
              },
              onClick: () => {
                compHandle.handleDefault(row)
              }
            },
            {
              default: () => '查看'
            }
          ),
          h(() => {
            if (row.refundStatus == 1) {
              return h(
                NDropdown,
                {
                  options: [{
                    label: '同意',
                    key: '1',
                    props: {
                      onClick: () => {
                        compHandle.refundExamineOrder(row, '1')
                      }
                    }
                  }, {
                    label: '拒绝',
                    key: '2',
                    props: {
                      onClick: () => {
                        compHandle.refundExamineOrder(row, '2')
                      }
                    }
                  },]
                },
                {
                  default: () => {
                    return h(
                      NButton,
                      {
                        type: 'default',
                      },
                      {
                        default: () => '审批'
                      }
                    )
                  }
                }
              )
            } else {
              return h(
                NButton,
                {
                  type: 'default',
                  disabled: true
                },
                {
                  default: () => '审批'
                }
              )
            }
          }),
          h(
            NButton,
            {
              type: 'info',
              style: {
                marginLeft: '8px'
              },
              onClick: () => {
                compHandle.handleLogShippingSn(row)
              }
            },
            {
              default: () => '物流信息'
            }
          ),
        ])
      }
    }
  ]
}

const colorArrayList = [{
  color: '#18A058', textColor: '#fff', borderColor: '#18A058'
}, {
  color: '#B5D533', textColor: '#fff', borderColor: '#B5D533'
}, {
  color: '#18A058', textColor: '#fff', borderColor: '#18A058'
}, {
  color: '#097B16', textColor: '#fff', borderColor: '#097B16'
}, {
  color: '#D53333', textColor: '#fff', borderColor: '#D53333'
}]

const searchOptions = {
  orderStatusList: [{
    label: "待收货",
    value: 1
  },
    {
      label: "已完成",
      value: 2
    },
    {
      label: "已退款",
      value: 3
    },
    {
      label: "退款申请",
      value: 4
    },
    {
      label: "已拒绝",
      value: 5
    },
    {
      label: "待支付",
      value: 6
    }],
  activityStatusList: [{
    label: "未开始",
    value: 1
  }, {
    label: "已结束",
    value: 2
  }]
}


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

