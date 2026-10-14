<template>
    <n-card hoverable>
        <template #header>
            个人信息
        </template>
        <n-divider style="margin-top: 0" />
        <n-grid cols="24" y-gap="12" x-gap="12" item-responsive responsive="screen">
            <n-grid-item span="6">
                <n-form
                    ref="formRef"
                    :model="compData.formItem"
                    :rules="ruleValidate"
                    label-placement="left"
                    label-width="auto"
                >
                    <n-form-item label="用户账户" path="username">
                        <n-input v-model:value="compData.formItem.username" disabled/>
                    </n-form-item>
                    <n-form-item label="用户昵称" path="nickname">
                        <n-input v-model:value="compData.formItem.nickname"/>
                    </n-form-item>
                    <n-form-item label="原密码" path="oldPassword">
                        <n-input type="password" :show-password-on="'click'" v-model:value="compData.formItem.oldPassword"/>
                    </n-form-item>
                    <n-form-item label="新密码" path="password">
                        <n-input type="password" :show-password-on="'click'" v-model:value="compData.formItem.password"/>
                    </n-form-item>
                    <n-form-item label="确认密码" path="rePassword">
                        <n-input type="password" :show-password-on="'click'" v-model:value="compData.formItem.rePassword"/>
                    </n-form-item>
                    <n-form-item label=" " path="rePassword">
                        <n-button @click="cancel">取消</n-button>
                        <n-button type="primary" @click="edit" style="margin-left: 12px">
                            保存
                        </n-button>
                    </n-form-item>
                </n-form>
            </n-grid-item>
        </n-grid>
    </n-card>
</template>
<script lang="ts" setup>
import {compData} from "./data.ts"
import {FormInst, FormItemRule, FormRules, useDialog, useMessage} from "naive-ui"
import {onMounted, ref} from "vue"
import {own} from "@/api/system/user.ts"
import appStore from "@/pinia/app.ts"
import localStore from "@/utils/localStore.ts"
import {useRouter} from "vue-router";

const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const app = appStore()
const formRef = ref<FormInst | null>(null)

const cancel = () => {
    window.location.href = "/"
}

const validatePassword = (rule: FormItemRule, value: string) => {
    if (value) {
        if (value.length < 6 || value.length > 32) {
            return new Error("密码长度必须在6-32之间")
        }
        if (compData.formItem.rePassword && value !== compData.formItem.rePassword) {
            return new Error("两次密码输入不一致")
        }
        if (compData.formItem.oldPassword === "") {
            return new Error("请输入原密码")
        }
    }
}
const validateRePassword = (rule: FormItemRule, value: string) => {
    if (compData.formItem.password) {
        return value === compData.formItem.password
    }
}
const validateOldPassword = (rule: FormItemRule, value: string) => {
    if (compData.formItem.password) {
        return "" !== value
    }
}

const ruleValidate: FormRules = {
    nickname: [
        {
            required: true,
            trigger: ["blur", "input"],
            message: "请输入用户昵称"
        }
    ],
    password: [
        {
            validator: validatePassword,
            trigger: ["blur", "input"]
        }
    ],
    rePassword: [
        {
            validator: validateRePassword,
            message: "两次密码输入不一致",
            trigger: ["blur", "input"]
        }
    ],
    oldPassword: [
        {
            validator: validateOldPassword,
            message: "请输入原密码",
            trigger: ["blur", "input"]
        }
    ]
}

const edit = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(errors => {
        if (!errors) {
            dialog.error({
                title: "确定要提交么",
                content: "个人信息修改后，将会退出系统重新登录，请明确后修改！",
                positiveText: "确定提交",
                negativeText: "再想想",
                onPositiveClick: () => {
                    own({
                        NickName: compData.formItem.nickname,
                        Password: compData.formItem.oldPassword,
                        NewPasswords: compData.formItem.password,
                        ConfirmYourPassword: compData.formItem.rePassword,
                        head_img: ""
                    }).then(response => {
                        message.success(response.msg)

                        compData.formItem.nickname = ""
                        compData.formItem.password = ""
                        compData.formItem.oldPassword = ""
                        compData.formItem.rePassword = ""

                        app.$reset()
                        localStore.clearAll()
                        router.push("/login")
                    })
                }
            })
        }
    })
}

onMounted(() => {
    compData.formItem.username = app.userInfo.username
    compData.formItem.nickname = app.userInfo.nickname
})

</script>
