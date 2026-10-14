<template>
    <div>
        <n-card content-style="padding:15px">
            <n-space :wrap-item="false">
                <n-button type="primary" @click="addChild()">
                    <template #icon>
                        <n-icon>
                            <component :is="'antd-PlusOutlined'"></component>
                        </n-icon>
                    </template>
                    增加子菜单
                </n-button>
                <n-button @click="addTop()">
                    <template #icon>
                        <n-icon>
                            <component :is="'antd-PlusOutlined'"></component>
                        </n-icon>
                    </template>
                    添加顶级菜单
                </n-button>
                <n-button :disabled="menuData.checkedKeys.length === 0" @click="apiHandle.confirmDel()">
                    <template #icon>
                        <n-icon>
                            <component :is="'ionicons5-TrashSharp'"></component>
                        </n-icon>
                    </template>
                    批量删除
                </n-button>
                <n-dropdown :options="options" placement="bottom-start" trigger="hover" @select="handleDropdown">
                    <n-button icon-placement="right">
                        更多操作
                        <template #icon>
                            <n-icon size="12">
                                <component :is="'antd-CaretDownFilled'"></component>
                            </n-icon>
                        </template>
                    </n-button>
                </n-dropdown>
            </n-space>
            <n-grid x-gap="12" style="margin-top: 15px">
                <n-gi span="8">
                    <n-alert type="info">
                        当前选择编辑：<span v-if="menuData.name">{{ menuData.name }}</span>
                    </n-alert>
                    <n-space vertical :size="12" style="margin-top: 15px">
                        <n-input v-model:value="menuData.pattern" placeholder="输入菜单名称搜索" size="large">
                            <template #suffix>
                                <n-icon size="12">
                                    <component :is="'ionicons5-SearchOutline'"></component>
                                </n-icon>
                            </template>
                        </n-input>
                        <n-tree checkable show-line :pattern="menuData.pattern" @update:checked-keys="handleChecked"
                            :data="compData.list" key-field="id" cascade label-field="title"
                            :selected-keys="treeConf['selected-keys']" @update:selected-keys="handleSelected"
                            :default-expand-all="treeConf['default-expand-all']"
                            :default-expanded-keys="treeConf['default-expanded-keys']" block-line />
                    </n-space>
                </n-gi>
                <n-gi span="10">
                    <n-form ref="formRef" :model="formItem" :rules="formRules" label-placement="left" :label-width="120"
                        require-mark-placement="right-hanging">
                        <AddForm v-model:form-item="formItem" />
                        <n-form-item label=" ">
                            <n-button type="primary" @click="apiHandle.edit">
                                <template #icon>
                                    <n-icon>
                                        <component :is="'ionicons5-CloudUploadOutline'"></component>
                                    </n-icon>
                                </template>
                                修改并保存
                            </n-button>
                            <n-button style="margin-left: 8px" @click="cancelEdit">
                                取消修改
                            </n-button>
                        </n-form-item>
                    </n-form>
                </n-gi>
            </n-grid>
        </n-card>
        <n-modal v-model:show="addConf.show" preset="dialog" :title="'新增' + (menuData.name !== '' ? '子级' : '顶级') + '菜单'"
            style="width: 680px">
            <n-form ref="formAddRef" :model="formAddItem" :rules="formRules" label-placement="left" :label-width="120"
                require-mark-placement="right-hanging" style="margin-top: 28px">
                <AddForm v-model:form-item="formAddItem" :f-menu-name="menuData.name" />
            </n-form>
            <template #action>
                <n-button type="primary" @click="apiHandle.add">
                    <template #icon>
                        <n-icon>
                            <component :is="'ionicons5-CloudUploadOutline'"></component>
                        </n-icon>
                    </template>
                    保存
                </n-button>
                <n-button @click="cancelAdd">
                    取消
                </n-button>
            </template>
        </n-modal>
    </div>
</template>

<script lang="ts" setup>
import AddForm from "@/view/system/menu/add-form.vue"
import { useMessage, useDialog, FormInst } from "naive-ui"
import { getList, edit, add, delBatch } from "@/api/system/menu"
import { options, compData, treeConf, menuData, originFormItem, formRules } from "@/view/system/menu/data"
const message = useMessage()
const dialog = useDialog()
const formRef = ref<FormInst | null>(null)
const formAddRef = ref<FormInst | null>(null)
const addConf = reactive({
    show: false
})
const formAddItem = reactive({ ...originFormItem })
const formItem = reactive({ ...originFormItem })

const handleDropdown = (name: any) => {
    if (name === "expandOne") {
        treeConf["default-expand-all"] = false
        treeConf["default-expanded-keys"] = []
    } else if (name === "expandTwo") {
        treeConf["default-expand-all"] = false
        treeConf["default-expanded-keys"] = compData.level1
    } else if (name === "expandAll") {
        treeConf["default-expand-all"] = true
    } else if (name === "refresh") {
        treeConf["default-expand-all"] = false
        treeConf["default-expanded-keys"] = []
        apiHandle.getTableData()
    }
}
const handleSelected = (keys: any, option: any) => {
    if (keys.length === 0) {
        treeConf["selected-keys"] = []
        menuData.name = ""
        menuData.level = 0
        menuData.id = 0
        Object.assign(formItem, originFormItem)
    } else {
        treeConf["selected-keys"] = keys
        menuData.name = option[0].title
        menuData.level = option[0].level
        menuData.id = keys[0]

        for (const key in formItem) {
            if (Object.prototype.hasOwnProperty.call(option[0], key)) {
              formItem[key] = option[0][key]
            }
        }
    }
}
const handleChecked = (keys: any) => {
    menuData.checkedKeys = keys
}
const addChild = () => {
    formAddRef.value?.restoreValidation()
    if (menuData.id == 0) {
        message.warning("请先点击选择要修改的节点")
        return
    }
    addConf.show = true
    formAddItem.fid = menuData.id
    formAddItem.level = 1 + menuData.level
}
const addTop = () => {
    formAddRef.value?.restoreValidation()
    handleSelected([], null)
    addConf.show = true
    formAddItem.level = 1
}
const cancelAdd = () => {
    addConf.show = false
    Object.assign(formAddItem, originFormItem)
}
const cancelEdit = () => {
    formRef.value?.restoreValidation()
    handleSelected([], null)
}

const apiHandle = reactive({
    async getTableData () {
        compData.loading = true
        const res = await getList({})
        compData.list = res.data
        compData.level1 = []
        compData.list.forEach((item: any) => {
            compData.level1.push(item.id)
        })
        compData.loading = false
        appStore.setMenuList()
    },
    confirmDel () {
        dialog.error({
            title: "警告",
            content: "你确定删除这几个菜单么？",
            positiveText: "确定删除",
            negativeText: "再想想",
            onPositiveClick: async () => {
                const res = await delBatch(menuData.checkedKeys)
                message.success((res as any).msg)
                apiHandle.getTableData()

            }
        })
    },
    edit (e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate(errors => {
            if (!errors) {
                if (!formItem.id) {
                    message.warning("请先点击选择要修改的节点")
                    return
                }
                edit(formItem).then(response => {
                    message.success((response as any).msg)
                    apiHandle.getTableData()
                })
            }
        })
    },
    add (e: MouseEvent) {
        e.preventDefault()
        formAddRef.value?.validate(errors => {
            if (!errors) {
                add(formAddItem).then(response => {
                    message.success((response as any).msg)
                    apiHandle.getTableData()
                    cancelAdd()
                    cancelEdit()
                })
            }
        })
    }
})

apiHandle.getTableData()



</script>
