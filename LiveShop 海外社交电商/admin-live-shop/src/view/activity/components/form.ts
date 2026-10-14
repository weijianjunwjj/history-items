
import { FormItemRule } from 'naive-ui';

interface fromTypeScrp {
    id: any;
    name: string;
    activityType: string;
    peopleMax: number;
    bookingDeadline: number;
    freight: number;
    shortDesc: string;
    isAutoStart: number | string;
    ruleType: number | string;
    coin: number;
    integral: number;
    banner: string;
    reward: Array<any>;
    detail: string;
}

const form = ref<fromTypeScrp>({
    id: undefined,
    name: '',
    activityType: '',
    peopleMax: 0,
    bookingDeadline: null!,
    freight: 0,
    shortDesc: '',
    isAutoStart: '',
    ruleType: '',
    coin: 0,
    integral: 0,
    banner: '',
    reward: [],
    detail: ''
});
const rules = {
    name: {
        required: true,
        trigger: ['blur'],
        message: '请输入活动名称'
    },
    activityType: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择活动类型'
    },
    peopleMax: {
        required: true,
        trigger: ['blur'],
        type: 'number',
        message: '请输入人数上限'
    },
    bookingDeadline: {
        type: 'number',
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择预约结束日期'
    },
    freight: {
        required: true,
        trigger: ['blur'],
        type: 'number',
        message: '请输入运费'
    },
    shortDesc: {
        required: true,
        trigger: ['blur'],
        message: '请输入活动简介'
    },
    isAutoStart: {
        required: true,
        trigger: 'change',
        message: '请选择是否自动开始'
    },
    ruleType: {
        required: true,
        trigger: 'change',
        message: '请选择参与规则'
    },
    coin: {
        required: true,
        trigger: ['blur'],
        type: 'number',
        message: '请输入金币数量'
    },
    integral: {
        required: true,
        trigger: ['blur'],
        type: 'number',
        message: '请输入积分数量'
    },
    banner: {
        key: 'banner',
        required: true,
        trigger: ['blur', 'change'],
        message: '请上传封面图',
        validator(rule: FormItemRule, value: string) {
            if (!value?.length) {
                return new Error('请上传封面图');
            }
            return true;
        }
    },
    reward: {
        key: 'reward',
        type: 'array',
        required: true,
        trigger: 'change',
        message: '请上传奖品图',
        validator(rule: FormItemRule, value: string) {
            if (!value?.length) {
                return new Error('请上传奖品图');
            }
            return true;
        }
    },
    detail: {
        key: 'detail',
        required: true,
        trigger: ['blur', 'input', 'change'],
        validator(rule: FormItemRule, value: string) {
            if (value === '<p><br></p>') {
                return new Error('活动详情不可为空');
            }
            return true;
        }
    },
    rangeTime: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择开始日期-结束日期',
        validator(rule: FormItemRule, value: string) {
            if (!rangeTime.value?.length) {
                return new Error('请选择开始日期-结束日期');
            }
            return true;
        }
    }
};
const rangeTime = ref<any>(null);

export {
    form,
    rules,
    rangeTime
}
