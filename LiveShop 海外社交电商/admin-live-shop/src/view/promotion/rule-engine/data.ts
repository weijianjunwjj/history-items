import {DataTableColumns, NButton} from 'naive-ui';

export const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_, index) {
        return index + 1;
      },
    },
    {
      title: '规则名称',
      key: 'name',
      align: 'center',
    },
    // {
    //   title: '规则类型',
    //   key: 'rule',
    //   align: 'center',
    //   render(row: any) {
    //     return integralRuleOptions.find(v => v.value == row.rule)?.label || ' '
    //   }
    // },
    {
      title: '应用场景',
      key: 'scene',
      align: 'center',
      render(row: any) {
        return applySceneOptions.find(v => v.value == row.scene)?.label || ' '
      }
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

export const visible = reactive({
  groupConfig: false,
  detailVisible: false
});

export const integralRuleOptions = [
  {
    label: '获取规则',
    value: '1',
  },
  {
    label: '消耗规则',
    value: '2',
  },
]

export const applySceneOptions = [
  {
    label: '被点赞',
    value: '1',
  },
  {
    label: '被评论',
    value: '2',
  },
  {
    label: '打招呼',
    value: '3',
  },
  {
    label: '发布动态',
    value: '4',
  },
  {
    label: '点赞',
    value: '5',
  },
  {
    label: '评论',
    value: '6',
  },
]

export const sceneObjectKeys = applySceneOptions.reduce((item, cur) => {
  item[cur.value] = cur.label;
  return item;
}, {});
