import { DataTableColumns } from "naive-ui"
import { delButton, editButton, changeStatus, showButton, searchOptions } from "../components/data.ts"
import { h, reactive } from "vue"

const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_: Object, index: number) {
        let p = paginationReactive.page - 1
        return (index + 1) + (p * paginationReactive.pageSize)
      }
    },
    {
      title: "活动名称",
      key: "name",
      align: "center",
    },
    {
      title: "活动类型",
      key: "activityType",
      align: "center",
      width: 100,
      render(row: any) {
        return h(
          'span',
          { clss: "atypespan" },
          {
            default: () => {
              return searchOptions.find(v => v.value == row.activityType)?.label || "未知"
            }
          }
        )
      }
    },
    {
      title: "活动预约结束日期",
      key: "bookingDeadline",
      align: "center",
      width: 180,
    },
    {
      title: "预约人数上限",
      key: "peopleMax",
      align: "center",
      width: 120,
    },
    {
      title: "预约人数",
      key: "bookingUser",
      align: "center",
      width: 120,
    },
    {
      title: "发布时间",
      key: "createdAt",
      align: "center",
      width: 180,
    },
    {
      title: "发布人",
      key: "creatorName",
      align: "center",
      width: 120,
    },
    {
      title: "操作",
      key: "actions",
      align: "center",
      width: 280,
      render(row) {
        return h("div", [
          editButton(h, row, compHandle),
          showButton(h, row, compHandle),
          delButton(h, row, compHandle),
          changeStatus(h, row, compHandle),
        ])
      }
    }
  ]
}

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

const visible = reactive({
  groupConfig: false,
  detailVisible: false
});

export {
  createColumns,
  paginationReactive,
  visible
}

