import { DataTableColumns, NSwitch, NButton, FormItemRule } from 'naive-ui';
import { FormRules } from 'naive-ui';
import { h } from 'vue';
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
      title: '商品类目',
      key: 'cateName',
      align: 'center',
    },
    {
      title: '规格名称',
      key: 'specName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'actions',
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
          )
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
  brand:'',
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
  { label: '数码', value: '1' },
  { label: '生活用品', value: '2' },
  { label: '运动户外', value: '3' },
];

export const specNameOptions=[
  { label: '颜色', value: '1' },
  { label: '尺寸/大小', value: '2' },
  { label: '材质', value: '3' },
  { label: '重量', value: '4' },
]

export const subCategoryOptions = [
  { label: '手机', value: 'mobile' },
  { label: '电脑', value: 'computer' },
  { label: '家电', value: 'home_appliances' },
];

export const rules: FormRules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品名称不可为空',
    max: 120,
  },
  code: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('编号不可为空');
      }
      if (value.length > 20) {
        return new Error('已超过最大字数限制');
      }
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        return new Error('请输入数字和英文组合');
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
  //
  description: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品简介不可为空',
    max: 300,
  },
  purchasePrice:{
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('采购单价不可为空');
      }
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        return new Error('请输入有效的数字（最多两位小数）');
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
  originalPrice:{
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('商品原价不可为空');
      }
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        return new Error('请输入有效的数字（最多两位小数）');
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
  shipping: {
    required: true,
    trigger: ['blur', 'input'],
    message: '运费不可为空',
    type: 'number',
  },
  details: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule: FormItemRule, value: string) {
        if (value==='<p><br></p>') {
          return new Error('商品详情不可为空');
        }
        return true;
      },
  },
  category: {
    required: true,
    trigger: ['blur', 'change'],
    message: '商品类目不可为空',
  },
  images: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品图不可为空',
  },
  specification: {
    required: true,
    trigger: ['blur', 'change'],
    message: '规格与库存不可为空',
  },
};

