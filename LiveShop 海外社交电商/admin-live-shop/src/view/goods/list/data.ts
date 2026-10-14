import { NButton } from "naive-ui/es/button";
import { DataTableColumns } from "naive-ui/es/data-table";


export const defaultPaginationReactive = {
    page: 1,
    pageSize: 10,
    total: 0,
  }
  
export const paginationReactive = reactive({ ...defaultPaginationReactive });
  
  

export const  createColumns = (compHandle: any): DataTableColumns => {


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
          title: "商品名称",
          key: "name",
          align: "center",
          minWidth:200,
          ellipsis: {
            tooltip: true
          }
      },
      {
          title: "商品编号",
          key: "itemNumber",
          align: "center",
          width:230,
      },
      {
          title: "商品原价($)",
          key: "priceOp",
          align: "center",
      },
      {
          title: "商品售价",
          key: "price",
          align: "center",
      },
      {
          title: "运费",
          key: "freight",
          align: "center",
      },
      {
          title: "规格",
          key: "specName",
          align: "center",
      },
      {
          title: "规格值",
          key: "specVal",
          align: "center",
      },
      {
          title: "销量",
          key: "sale_num",
          align: "center",
      },
      {
          title: "剩余库存",
          key: "stock",
          align: "center",
      },
      {
          title: "所在分类",
          key: "className",
          align: "center",
      },
      {
          title: "操作",
          key: "actions",
          align: "center",
          width: 130,
          render(row) {
              return h("div", [
                  h(
                      NButton,
                      {
                          type: 'info',
                          style: {
                              marginRight: '8px',
                          },
                          onClick: () => {
                              compHandle.handleLook(row)
                          }
                      },
                      {
                          default: () => '查看'
                      }
                  ),
              ])
          }
      }
  ]
}