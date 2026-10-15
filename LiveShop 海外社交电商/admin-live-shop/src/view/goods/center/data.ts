import {
  DataTableColumns,
  NButton,
  FormItemRule,
} from 'naive-ui';
import { FormRules } from 'naive-ui';
import { h } from 'vue';
import { formatDate } from '@/utils/utils';
export const createColumns = (compHandle: any): DataTableColumns => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_: Object, index: number) {
        let p = paginationReactive.page - 1
        return (index + 1) + (p * paginationReactive.size)
      }
    },
    {
      title: '商品名称',
      key: 'name',
      align: 'center',
      minWidth:200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '商品编号',
      key: 'itemNumber',
      align: 'center',
      width:250,
    },
    {
      title: '采购价(¥)',
      key: 'purPrice',
      align: 'center',
      width:130,
      render(row: any) {
        return `¥${row.purPrice}`;
      },
    },
    {
      title: '商品原价($)',
      key: 'priceOp',
      align: 'center',
      width:130,
      render(row: any) {
        return `$${row.priceOp}`;
      },
    },
    {
      title: '运费',
      key: 'freight',
      align: 'center',
      width:130,
      render(row: any) {
        return `${row.freight}`;
      },
    },
    {
      title: '所在分类',
      key: 'cateName',
      align: 'center',
      width:130,
    },
    {
      title: '商品类目',
      key: 'className',
      align: 'center',
      width:130,
    },
    {
      title: '创建时间',
      width:200,
      key: 'createdTime',
      align: 'center',
      render(row) {
        return formatDate(row.createdTime);
      },
    },
    {
      title: '添加人',
      key: 'nickName',
      align: 'center',
      width:130,
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
          ),
          row.status ===  2
            ? h(
                NButton,
                {
                  type: 'warning',
                  onClick: () => {
                    compHandle.handleDown(row);
                  },
                },
                {
                  default: () => '下架',
                }
              )
            : h(
                NButton,
                {
                  type: 'success',
                  onClick: () => {
                    compHandle.handleUp(row);
                  },
                },
                {
                  default: () => '上架',
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
interface ProductRule {
  RuleType: string;
  Point?: string;
  Coin?: string; // Coin 在第二个 specStock 对象中出现，应该是可选的
}

interface FormState {
  categoryId: string;
  name: string;
  intro: string;
  itemNumber: string;
  freight: string;
  classId: number;
  purPrice: string;
  op: string;
  brand: string;
  details: string;
  img: any[]; // 假设 img 和 video 是字符串数组
  video: any[];
  ProductRule: ProductRule;
}

export const defaultForm={
  categoryId: undefined, //类目id
  payOnline: 1,
  name: '',
  intro: '',
  itemNumber: '',
  freight: '',
  classId: undefined,
  purPrice: '',
  op: '',
  brand: '',
  details: '',
  img: [],
  video: [],
  ProductRule: {
    RuleType: '1',
    Point: '',
    Coin:''
  },
}

export const form = reactive<FormState>({...defaultForm});
window.form=form
export const categoryOptions = [
  { label: '数码', value: 'essentials' },
  { label: '生活用品', value: 'daily' },
  { label: '运动户外', value: 'sports' },
];

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
  intro: {
    required: true,
    trigger: ['blur', 'input'],
    message: '商品简介不可为空',
    max: 300,
  },
  classId: {
    required: true,
    trigger: ['blur', 'change'],
    message: '所在分类不可为空',
  },
  categoryId: {
    required: true,
    trigger: ['blur', 'change'],
    message: '商品类目不可为空',
    type: 'number',
  },
  img: {
    required: true,
    trigger: ['blur', 'change'],
    message: '商品图不可为空',
    validator(rule: FormItemRule, value: string) {
      if (!value?.length) {
        return new Error('商品图不可为空');
      }
      return true;
    },
  },
  'ProductRule.RuleType': {
    required: true,
    trigger: ['blur', 'change'],
    message: '参与规则不可为空',
  },
  'ProductRule.Coin': {
    required: true,
    trigger: ['blur', 'change'],
    message: '金币不可为空',
  },
  'ProductRule.Point': {
    required: true,
    trigger: ['blur', 'change'],
    message: '积分不可为空',
  },
  purPrice: {
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
  op: {
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
  freight: {
    required: true,
    trigger: ['blur', 'input'],
    message: '运费不可为空',
  },
  details: {
    required: true,
    trigger: ['blur', 'input'],
    validator(rule: FormItemRule, value: string) {
      if (value === '<p><br></p>') {
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
};


export const handleCancel = () => {
  showModal.value = false;
};

function generateUniqueValue(specVal, type) {
  // 这里通过规格值的名称和类型生成唯一值，当然可以根据需求更改逻辑
  return `${type}-${specVal}`;
}

export let specMap = {
};


export function transformData(data) {
  const result = [];

  // 遍历specMap并处理每种规格
  for (const [specKey, specId] of Object.entries(specMap)) {
    // 找到与当前specId匹配的数据
    const filteredData = data.filter(item => item.specNameId == specId);

    // 如果当前规格匹配到主数据
    if (filteredData.length > 0) {
      const specObj = {
        selectedSpec: specId,
        selectedSpecValues: [],
        specValueOptions: []
      };

      filteredData.forEach(item => {
        // 去重添加 selectedSpecValues
        if (!specObj.selectedSpecValues.includes(item.specVal)) {
          specObj.selectedSpecValues.push(item.specVal);
        }

        // 添加 specValueOptions
        specObj.specValueOptions.push({
          label: item.specVal,
          value: generateUniqueValue(item.specVal, specKey)
        });
      });

      result.push(specObj);
    }

    // 处理嵌套的 subSku 数据（比如尺码在subSku中）
    data.forEach(item => {
      if (item.subSku && specId == specMap.size) { // 确保只处理尺码规格
        const sizeSpecObj = {
          selectedSpec: specId,
          selectedSpecValues: [],
          specValueOptions: []
        };

        const sizeSet = new Set();

        item.subSku.forEach(subItem => {
          if (subItem.specNameId == specId) {
            sizeSet.add(subItem.specVal);

            sizeSpecObj.specValueOptions.push({
              label: subItem.specVal,
              value: generateUniqueValue(subItem.specVal, specKey)
            });
          }
        });

        sizeSpecObj.selectedSpecValues = Array.from(sizeSet);

        // 避免重复添加sizeSpecObj
        if (sizeSpecObj.selectedSpecValues.length > 0 &&
            !result.some(obj => obj.selectedSpec === specId)) {
          result.push(sizeSpecObj);
        }
      }
    });
  }

  return result;
}





