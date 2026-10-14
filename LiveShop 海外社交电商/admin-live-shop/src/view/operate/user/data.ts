import { NButton } from 'naive-ui/es/button';

export const defaultSearchForm = {
  username: '',
  nickname: '',
  id: '',
  providerName: null,
  status:1,
  startTime: '',
  endTime: '',
};
export const defaultPaginationReactive = {
  page: 1,
  pageSize: 10,
  total: 0,
};

export const paginationReactive = reactive({ ...defaultPaginationReactive });

export const createColumns = (compHandle: any): any => {
  return [
    {
      title: '序号',
      key: 'id',
      align: 'center',
      width: 80,
      render(_, index) {
        let p = paginationReactive.page - 1;
        return index + 1 + p * paginationReactive.pageSize;
      },
    },
    {
      title: '用户ID',
      key: 'Id',
      align: 'center',
      width: 130,
    },
    {
      title: '用户昵称',
      key: 'nickname',
      align: 'center',
      width: 180,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '用户名称',
      key: 'username',
      align: 'center',
      width: 180,
      ellipsis: {
        tooltip: true,
      },
    },
    {
      title: '注册时间',
      key: 'create_time',
      align: 'center',
      width: 180,
    },
    {
      title: '生日',
      key: 'birthDay',
      align: 'center',
      width: 180,
    },
    {
      title: '体重(KG)',
      key: 'weight',
      align: 'center',
      width: 120,
    },
    {
      title: '身高(CM)',
      key: 'height',
      align: 'center',
      width: 120,
    },
    {
      title: '性别',
      key: 'gender',
      align: 'center',
      width: 80,
      render({gender}) {
        return gender==1 ? '男' : '女';
      },
    },
    {
      title: '注册天数',
      key: 'registered_days',
      align: 'center',
      width: 120,
    },
    {
      title: '累计充值金额($)',
      key: 'totalRechargeAmount',
      align: 'center',
      width: 180,
    },
    {
      title: '登录方式',
      key: 'providerName',
      align: 'center',
      width: 120,
    },
    {
      title: '积分',
      key: 'integral',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 400,
      fixed: 'right',
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
          h(
            NButton,
            {
              type: 'warning',
              style: {
                marginRight: '8px',
              },
              onClick: () => {
                if(row.status==1){
                  compHandle.closeLogin(row);
                }else{
                  compHandle.openLogin(row);
                }
              },
            },
            {
              default: () => row.status ==1 ? '限制登录' : '启用登录',
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
                compHandle.handleBuyQuery(row);
              },
            },
            {
              default: () => '消费查询',
            }
          ),
        ]);
      },
    },
  ];
};
