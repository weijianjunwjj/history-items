import { DataTableColumns } from "naive-ui"
import { changeStatus, delButton, editButton, showButton } from "../components/data.ts"
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
      width: 160,
    },
    {
      title: "活动简介",
      key: "shortDesc",
      align: "center",
    },
    {
      title: "参与人数上限",
      key: "peopleMax",
      align: "center",
      width: 120,
    },
    {
      title: "参与人数",
      key: "participants",
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

