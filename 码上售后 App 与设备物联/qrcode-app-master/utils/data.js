export const statusMapper = {
	1: {
		text: '待派工',
		className: 'tag-wait-dispatched',
	},
	2: {
		text: '处理中',
		className: 'tag-processing',
	},
	3: {
		text: '已完成',
		className: 'tag-completed',
	},
};


export const statusCall = {
	'-1': {
		text: '未接听',
		className: 'tag-wait-dispatched',
	},
	'1': {
		text: '已接听',
		className: 'tag-processing',
	},
};


export const sources = {
	1: {
		text: '客户创建',
		className: 'tag-wait-dispatched',
	},
	2: {
		text: '工程师创建',
		className: 'tag-processing',
	},
};

//创建map
export const mapping = new Map()

//设置值
mapping.set(1, true); // 字符串键
mapping.set(0, false);
mapping.set(true, 1); // 字符串键
mapping.set(false, 0);

console.log('mapping :>> ', mapping);
console.log('mapping.get(0) :>> ', mapping.get(0));

