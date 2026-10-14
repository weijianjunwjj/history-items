import {DataTableColumns, NButton} from "naive-ui";
import {h} from "vue";

export const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});


const createColumns = (addSubCategory: any, edit: any, remove: any): DataTableColumns => {
  return [
    {
      title: "序号",
      key: "no",
      align: "center",
      render: (_, index: any) => {
        if (!_.parentId) {
            let p = pagination.page - 1
            return (index + 1) + (p * pagination.limit)
        }
      },
    },
    {
      title: "商品类目",
      align: "center",
      key: "name",
    },
    {
      title: "商品总数",
      align: "center",
      key: "totalProducts",
      render(row: any) {
        const isTopLevel = !row.parentId;

        if (isTopLevel) {
          return row.children?.reduce((sum: any, child: any) => {
            // 确保 goodsNum 是数字，如果不是，则转换成数字或使用默认值 0
            const goodsNum =
              typeof child.goodsNum === "number"
                ? child.goodsNum
                : Number(child.goodsNum) || 0;
            return sum + goodsNum;
          }, 0) || 0;
        } else {
          return null;
        }
      },
    },
    {
      title: "关联商品数",
      align: "center",
      key: "relatedProducts",
      render(row: any) {
        const isTopLevel = !row.parentId;

        if (!isTopLevel) {
          return row.goodsNum;
        } else {
          return null;
        }
      },
    },
    {
      title: "创建时间",
      align: "center",
      key: "createdAt",
    },
    {
      title: "操作",
      align: "center",
      key: "actions",
      render(row: any) {
        const isTopLevel = !row.parentId;

        return h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
            },
          },
          [
            h(
              NButton,
              {
                type: "success",
                style: {
                  visibility: isTopLevel ? "visible" : "hidden",
                  pointerEvents: isTopLevel ? "auto" : "none",
                },
                onClick: () => addSubCategory(row),
              },
              {default: () => "新增子级类目"}
            ),
            h(
              NButton,
              {
                type: "info",
                onClick: () => edit(row),
              },
              {default: () => "编辑"}
            ),
            h(
              NButton,
              {
                type: "error",
                onClick: () => remove(row),
              },
              {default: () => "删除"}
            ),
          ]
        );
      },
    },
  ]
}

interface ProductCategory {
  parentId: any;
  id: number;
  name: string;
  goodsNum: number;
  createdAt: string;
  children?: ProductCategory[];
}

export {
  createColumns,
  ProductCategory,
}