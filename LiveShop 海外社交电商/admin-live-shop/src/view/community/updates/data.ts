import {DataTableColumns, FormItemRule, FormRules, NButton} from 'naive-ui';
import {h} from 'vue';

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
      title: '动态标题',
      key: 'title',
      align: 'center',
      width: 160,
    },
    {
      title: '动态内容',
      key: 'content',
      align: 'center',
      width:400,
      minWidth: 200,
      ellipsis: {
        tooltip: true
      },
      render(row){
        return h('div', { innerHTML: row.content })
      }
    },
    {
      title: '发布时间',
      key: 'createdAt',
      align: 'center',
      width: 180,
    },
    {
      title: '话题(#)',
      key: 'linkTopic',
      align: 'center',
      width:200,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        const {linkTopic} = row;
        return linkTopic?.map(item => `#${linkTopic}`);
      },
    },
    {
      title: '发布人',
      key: 'userName',
      align: 'center',
      width: 110,
    },
    {
      title: '点赞数',
      key: 'likeCount',
      align: 'center',
      width: 100,
    },
    {
      title: '评论数',
      key: 'commentCount',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 218,
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
                compHandle.handleDetail(row);
              },
            },
            {
              default: () => '查看',
            }
          ),
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
                compHandle.handleDelete(row);
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
  keywords: '',
  status: undefined,
});

export const visible = reactive({
  groupConfig: false,
});

export const paginationReactive = reactive({
  page: 1,
  size: 10,
  total: 0,
});
export const statusOptions = [
  {
    label: '开启',
    value: 1,
  },
  {
    label: '关闭',
    value: 0,
  },
];

export const showModal = ref(false);
export const form = ref({
  name: '',
  code: '',
  brand: '',
  description: '',
  purchasePrice: undefined,
  originalPrice: undefined,
  shipping: '',
  category: '',
  subCategory: '',
  images: [],
  video: [],
  details: undefined,
  specification: '',
});

export const categoryOptions = [
  {label: '数码', value: '1'},
  {label: '生活用品', value: '2'},
  {label: '运动户外', value: '3'},
];

export const specNameOptions = [
  {label: '颜色', value: '1'},
  {label: '尺寸/大小', value: '2'},
  {label: '材质', value: '3'},
  {label: '重量', value: '4'},
];

export const subCategoryOptions = [
  {label: '手机', value: 'mobile'},
  {label: '电脑', value: 'computer'},
  {label: '家电', value: 'home_appliances'},
];

export const rules: FormRules = {
  title: {
    required: true,
    trigger: ['blur', 'input'],
    message: '标题不可为空',
  },
  newTopic: {
    required: true,
    trigger: ['blur', 'input'],
    message: '话题不可为空',
  },
  content: {
    required: true,
    trigger: ['blur', 'input'],
    message: '内容不可为空',
  },
  mediaUrl: {
    required: true,
    trigger: ['blur', 'input'],
    message: '上传不可为空',
  },
};
