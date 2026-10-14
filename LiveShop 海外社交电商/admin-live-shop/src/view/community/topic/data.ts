import { DataTableColumns, NButton } from 'naive-ui';

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
      },
    },
    {
      title: '话题名称',
      key: 'name',
      align: 'center',
    },
    {
      title: '话题热度',
      key: 'heat',
      align: 'center',
      render(row: any) {
        if (row.heat < 1000) {
          return row.heat
        } else {
          return (row.heat / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }


      }
    },
    {
      title: '创建时间',
      key: 'createAt',
      align: 'center',
      width:200,
    },
    {
      title: '话题添加人',
      key: 'nickname',
      align: 'center',
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
                marginRight: '8px',
              },
              onClick: () => {
                compHandle.handleEdit(row);
              },
            },
            {
              default: () => '编辑',
            }
          ),
          h(
            NButton,
            {
              type: 'info',
              style: {
                marginRight: '8px',
              },
              onClick: () => {
                compHandle.handleDetail(row)
              }
            },
            {
              default: () => '查看'
            }
          ),
          h(
            NButton,
            {
              type: 'error',
              onClick: () => {
                compHandle.handleDel(row);
              },
            },
            {
              default: () => '删除',
            }
          ),
        ]);
      },
    },
  ];
};

export const searchForm = reactive({
  keyword: '',
});

export const visible = reactive({
  groupConfig: false,
  detailVisible: false
});

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
  pageSizes: [10, 20, 30, 50, 100]
});
