<template>
    <div id="background"></div>
    <div class="bg-backdrop-layout"></div>
    <n-flex class="login-container">
        <n-flex class="login-width" justify="space-between" align="center">
            <n-grid cols="2" x-gap="16" responsive="screen">
                <n-grid-item span="1" class="left-panel">
                    <div class="logo">
                        <img src="@/assets/logo-min.png" alt="logo" />
                        <span>LiveShop后台管理</span>
                    </div>
                    <div class="slogan">---- 开箱即用的高质量中后台管理系统</div>
                </n-grid-item>
                <n-grid-item span="1">
                    <div style="padding: 0 1rem 0 1rem">
                        <h2 style="
                                font-size: 1.875rem;
                                line-height: 2.25rem;
                                margin: 4.5rem 0 3.5rem 0;
                                font-weight: 300;
                            ">
                            登录
                        </h2>
                        <n-form label-placement="left" autocomplete="off" :rules="compData.rules" ref="formRef"
                            label-width="80" layout="vertical" :model="compData.form">
                            <n-form-item label="账号" path="username">
                                <n-input size="large" v-model:value="compData.form.username" placeholder="输入你的用户名">
                                    <template #suffix>
                                        <n-icon>
                                            <component :is="'ionicons5-HappyOutline'"></component>
                                        </n-icon>
                                    </template>
                                </n-input>
                            </n-form-item>
                            <n-form-item label="密码" path="password">
                                <n-input size="large" :show-password-on="'click'" type="password"
                                    v-model:value="compData.form.password" placeholder="输入你的密码" />
                            </n-form-item>
                            <n-form-item label="验证码" path="captcha">
                                <n-grid cols="5" item-responsive>
                                    <n-grid-item span="3">
                                        <n-input size="large" v-model:value="compData.form.captcha"
                                            @keyup.enter="handleEnter" placeholder="输入验证码" />
                                    </n-grid-item>
                                    <n-grid-item span="2">
                                        <img :src="captchaUrl" width="100%" @click="refreshCaptcha" height="40px"
                                            style="margin-left: 5px;" alt="" />
                                    </n-grid-item>
                                </n-grid>
                            </n-form-item>
                            <n-space justify="space-between" :size="[10, 15]" vertical>
                                <n-button type="primary" style="width: 100%" :loading="loggingIn" @click="handleLogin">
                                    登录</n-button>
                                <n-text depth="3">本地体验：账号 admin，密码 admin123，验证码 1234</n-text>
                            </n-space>
                        </n-form>
                    </div>
                </n-grid-item>
            </n-grid>
        </n-flex>
    </n-flex>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import appStore from '@/pinia/app';
import localStore from '@/utils/localStore';
import { login, getCaptcha, userInfo } from '@/api/login';

console.log("Welcome Live Shop")

const router = useRouter();
const formRef = ref();
const compData = reactive({
    form: {
        username: 'admin',
        password: 'admin123',
        captcha: '1234',
        captchaId: '',
    },
    rules: {
        username: [{ required: true, message: '请输入你的用户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入你的密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
    }
});
const captchaUrl = ref('');
const loggingIn = ref(false);

const refreshCaptcha = () => {
    getCaptcha().then(result => {
        captchaUrl.value = result.data.picPath;
        compData.form.captchaId = result.data.captchaId;
    }).catch(() => window.$message?.error('无法连接本地后端，请检查服务是否启动'));
};
refreshCaptcha();

const handleLogin = () => {
    if (loggingIn.value) return;
    formRef.value?.validate((errors: any) => {
        if (!errors) {
            loggingIn.value = true;
            login(compData.form).then(async (result: any) => {
                const token = result.data.token
                localStore.set('token', token);
                const app = appStore();
                app.userInfo = result.data.user || (await userInfo()).data;
                app.permissions = result.data.access || [];
                app.hasRoles = false;
                window.SITE_CONFIG.dynamicMenuRoutesHasAdded = false;
                await app.setMenuList()
                await router.replace('/home');
            }).catch((err) => {
                refreshCaptcha()
                compData.form.captcha=''
            }).finally(() => { loggingIn.value = false; })

        }
    });
};

const handleEnter = () => {
    handleLogin()
}

</script>

<style scoped lang="less">
#background {
    position: fixed;
    top: 0;
    left: 0;
    background-image: url('@/assets/login_bg_1.jpg');
    z-index: 1;
    width: 100%;
    height: 100%;
}

.bg-backdrop-layout {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    backdrop-filter: blur(25px);
}

.login-container {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    z-index: 3;

    .login-width {
        width: 950px;
        margin-left: auto;
        margin-right: auto;
        background: #fff;
        padding: 10px;
        height: 500px;
        position: relative;
        top: 50%;
        margin-top: -255px;
        border-radius: 10px;
    }

    .left-panel {
        padding: 0 1.25rem 0 1.25rem;
        height: 491px;
        background-image: url('@/assets/xwc.svg');
        background-repeat: no-repeat;
        background-position: center 60px;
        background-size: contain;
    }

    .logo {
        display: flex;
        margin-top: 20px;
        color: #333;

        span {
            font-weight: 300;
            font-size: 28px;
            color: #165dff;
            margin-left: 15px;
        }

        img {
            width: 33px;
        }
    }

    .slogan {
        display: flex;
        font-weight: 300;
        justify-content: flex-end;
        margin-left: auto;
        font-size: 16px;
        line-height: 50px;
    }
}
</style>
