import {reactive} from "vue"

const options = [
    {
        label: "刷新菜单",
        key: "refresh"
    },
    {
        label: "收合所有",
        key: "expandOne"
    },
    {
        label: "展开一级",
        key: "expandTwo"
    },
    {
        label: "展开所有",
        key: "expandAll"
    }
]

const compData = reactive({
    list: [],
    level1: [],
    loading: true
})

const treeConf = reactive({
    "default-expand-all": false,
    "selected-keys": [],
    "default-expanded-keys": [] as any
})

const menuData = reactive<{
    name: string;
    level: number;
    id: number;
    pattern: string;
    checkedKeys: number[];
}>({
    name: "",
    level: 0,
    id: 0,
    pattern: "",
    checkedKeys: []
});

const originFormItem = {
    id: 0,
    fid: 0,
    title: "",
    level: 0,
    icon: "",
    router: "",
    method: 1,
    url: "",
    component: "",
    auth: 0,
    log: 0,
    permission: 0,
    show: 1,
    sort: 0
}

const formRules = {
    title: {
        required: true,
        trigger: ["blur", "input"],
        message: "菜单名称不能为空"
    },
}

export {
    options,
    compData,
    treeConf,
    formRules,
    menuData,
    originFormItem
}
