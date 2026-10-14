import { DataTableColumns, NSwitch, NButton } from 'naive-ui';
export const dictTypeOptions = [
  {
    label: '普通',
    value: '1',
  },
  {
    label: '规格',
    value: '2',
  },
  {
    label: '分类',
    value: '3',
  },
];
export const dictTypeMap = dictTypeOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});
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
      title: '字典标识',
      key: 'dictSn',
      align: 'center',
    },
    {
      title: '标签名称',
      key: 'label',
      align: 'center',
    },
    {
      title: '字典值',
      key: 'value',
      align: 'center',
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center',
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
            uncheckedValue: 2,
            onUpdateValue: (value: any) => {
              compHandle.handleChangeStatus(row, value);
            },
          },
          {
            checked: () => '开启',
            unchecked: () => '关闭',
          }
        );
      },
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
  dictSn: '',
  status: null,
});

export const visible = reactive({
  groupConfig: false,
});

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
});

export const searchOptions = {
  status: [
    {
      label: '开启',
      value: 1,
    },
    {
      label: '关闭',
      value: 2,
    },
  ],
};
