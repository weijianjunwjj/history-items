import { DataTableColumns, NButton, NPopconfirm } from 'naive-ui';

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
      title: '消息名称',
      key: 'name',
      align: 'center',
      width: 180,
    },
    {
      title: '消息类型',
      key: 'type',
      align: 'center',
      width: 100,
      render(row: any) {
        return templateTypeOptions.value.find(v => v.value == row.type)?.label || ' '
      }
    },
    {
      title: '消息编号',
      key: 'msgSn',
      align: 'center',
      width: 220,
      ellipsis: {
        tooltip: true
      }
    },

    {
      title: '消息状态',
      key: 'name',
      align: 'center',
      width: 100,
      render(row: any) {
        return row.status == 1 ? '下架' : '上架'
      }
    },
    {
      title: '消息内容',
      key: 'content',
      align: 'center',
      width: 300,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '创建人',
      key: 'nickName',
      align: 'center',
      width: 120,
    },
    {
      title: '创建时间',
      key: 'createAt',
      align: 'center',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '操作',
      key: '',
      align: 'center',
      width: 240,
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
              type: 'error',
              style: {
                marginRight: '8px',
              },
              onClick: () => {
                compHandle.handleDel(row);
              },
              disabled: row.status == 2 ? true : false
            },
            {
              default: () => '删除',
            }
          ),

          h(NPopconfirm,
            {
              onPositiveClick: () => {
                compHandle.handleUnmount(row);
              },
              negativeText: "取消",
              positiveText: "确定"
            },
            {
              trigger: () => {
                return h(
                  NButton,
                  {
                    type: "primary"
                  },
                  { default: () => row.status == 1 ? '上架' : '下架' }
                )
              },
              default: () => {
                return `确认${row.status == 1 ? '上架' : '下架'}该消息嘛？`
              }
            }
          ),
        ]);
      },
    },
  ];
};

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
});

export const searchForm = reactive({
  name: ''
});

export const visible = reactive({
  groupConfig: false
});

export const templateTypeOptions = ref([])


