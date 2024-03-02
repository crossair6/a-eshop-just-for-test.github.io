<template>
    <div class="account-box">
        <div class="toggle">
            <a
                @click="isMsgLogin = false"
                href="javascript:;"
                v-if="isMsgLogin"
            >
                <i class="iconfont icon-user"></i> 使用账号登录
            </a>
            <a @click="isMsgLogin = true" href="javascript:;" v-else>
                <i class="iconfont icon-msg"></i> 使用手机号登录/注册
            </a>
        </div>
        <Form
            class="form"
            :validation-schema="mySchema"
            autocomplete="off"
            v-slot="{ errors }"
            ref="formRef"
        >
            <template v-if="!isMsgLogin">
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field
                            v-model="form.account"
                            name="account"
                            type="text"
                            placeholder="请输入用户名"
                        />
                    </div>
                    <div class="error" v-if="errors.account">
                        <i class="iconfont icon-warning" />{{ errors.account }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field
                            v-model="form.password"
                            name="password"
                            type="password"
                            placeholder="请输入密码"
                        />
                    </div>
                    <div class="error" v-if="errors.password">
                        <i class="iconfont icon-warning" />{{ errors.password }}
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field
                            v-model="form.mobile"
                            name="mobile"
                            type="text"
                            placeholder="请输入手机号"
                        />
                    </div>
                    <div class="error" v-if="errors.mobile">
                        <i class="iconfont icon-warning" />{{ errors.mobile }}
                    </div>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field
                            v-model="form.code"
                            name="code"
                            type="text"
                            placeholder="请输入验证码"
                        />
                        <span class="code" @click="sendCode" v-if="time <= 0"
                            >发送验证码</span
                        >
                        <span class="code disable" v-else
                            >{{ time }}秒后可发送</span
                        >
                    </div>
                    <div class="error" v-if="errors.code">
                        <i class="iconfont icon-warning" />{{ errors.code }}
                    </div>
                </div>
            </template>
            <div class="form-item">
                <div class="agree">
                    <Field
                        as="XtxCheckBox"
                        name="isAgree"
                        v-model="form.isAgree"
                    />
                    <span>我已同意</span>
                    <a href="javascript:;">《隐私条款》</a>
                    <span>和</span>
                    <a href="javascript:;">《服务条款》</a>
                </div>
            </div>
            <a href="javascript:;" class="btn" @click="login">{{
                isMsgLogin ? '登录/注册' : '登录'
            }}</a>
        </Form>
        <div class="action">
            <span id="QQLoginBtn"></span>
            <div class="url">
                <a href="javascript:;">忘记密码</a>
                <a href="javascript:;">免费注册</a>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Form, Field } from 'vee-validate'

import { ref, watch } from 'vue'
import schema from '@/utils/vee-validate-schema.js'
import { accountLoginAPI, WXSimulateLoginAPI } from '@/api/user.js'
import Message from '@/components/library/XtxMessage.js'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const store = useStore()
// 当前实例
// const { proxy } = getCurrentInstance()
// 控制短信登录切换的
const isMsgLogin = ref(true)
// 表单对象数据
const form = ref({
    isAgree: true,
    account: 'demo',
    password: '',
    mobile: '13511112222',
    code: null
})
// password: 'hm#qd@23!',
// mobile: '13511112222',
// 校验规则对象
const mySchema = ref({
    account: schema.account,
    password: schema.password,
    mobile: schema.mobile,
    code: schema.code,
    isAgree: schema.isAgree
})
// 监听isMsgLogin的变化,重置表单
watch(
    isMsgLogin,
    () => {
        for (const key in form.value) {
            if (key === 'isAgree') {
                form.value[key] = true
            } else {
                form.value[key] = null
            }
        }
    },
    { immediate: true }
)
watch(
    () => form.value.isAgree,
    (newValue) => {
        console.log(newValue)
    },
    {
        immediate: true
    }
)
// 点击登录时进行整体表单验证
const formRef = ref(null)

// 发送验证码
const time = ref(0)
const { pause, resume } = useIntervalFn(
    () => {
        if (time.value <= 0) {
            pause()
        } else {
            time.value--
        }
    },
    1000,
    false
)
async function sendCode() {
    const valid = mySchema.value.mobile(form.value.mobile)
    if (valid === true) {
        console.log('手机号校验通过')
        try {
            // 如果倒计时没开始
            if (time.value <= 0) {
                time.value = 60
                resume()
                // const res = await getMobileCodeAPI(form.value.mobile)
                setTimeout(() => {
                    console.log(code)
                    Message({
                        type: 'success',
                        text: `您手机收到的验证码${code}`
                    })
                    form.value.code = code // 自动填写验证码
                }, 1500)
            }
        } catch (e) {
            Message({ type: 'error', text: e.message })
        }
    } else {
        return formRef.value.setFieldError('mobile', valid)
    }
}
const code = getCode()
function getCode() {
    return (Math.random() * 100000000).toString().substring(0, 6)
}

async function login() {
    const isValid = await formRef.value.validate()
    console.log('登录验证结果为' + isValid)
    if (!isValid) {
        return Message({ type: 'error', text: '格式错误' })
    }
    console.log(route)
    // 验证成功,发登录请求
    try {
        // 1.用户名密码登录
        let loginRes = null
        if (!isMsgLogin.value) {
            loginRes = await accountLoginAPI(form.value)
            console.log(loginRes)
            // 2.手机号验证码登录
        } else {
            if (form.value.code !== code) {
                return Message({
                    type: 'error',
                    text: '验证码错误'
                })
            }
            loginRes = await WXSimulateLoginAPI(form.value.mobile)
            console.log('手机号验证码登录')
            console.log(loginRes)
        }
        const { id, account, nickname, avatar, token, mobile } = loginRes.result
        store.commit('user/setUser', {
            id,
            account,
            nickname,
            avatar,
            token,
            mobile
        })
        Message({
            type: 'success',
            text: '登陆成功'
        })
        console.log(route.query.redirectUrl)
        router.push(route.query.redirectUrl || '/')
        // 合并本地购物车
        store.dispatch('cart/mergeLocalCart')
        // 获取服务器购物车
        store.dispatch('cart/getCart')
        Message({
            type: 'success',
            text: '获取服务器购物车成功'
        })
    } catch (error) {
        console.log(error)
        Message({
            type: 'error',
            text: error.message || '登录失败'
        })
    }
}

// 初始化qq登录按钮(官方)
// 1.准备span, id=QQLoginBtn
// 2.QC.Login({btnId:'QQLoginBtn'})
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
    .toggle {
        padding: 15px 40px;
        text-align: right;
        a {
            color: @xtxColor;
            i {
                font-size: 14px;
            }
        }
    }
    .form {
        padding: 0 40px;
        &-item {
            margin-bottom: 28px;
            .input {
                position: relative;
                height: 36px;
                > i {
                    width: 34px;
                    height: 34px;
                    background: #cfcdcd;
                    color: #fff;
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 18px;
                }
                input {
                    padding-left: 44px;
                    border: 1px solid #cfcdcd;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;
                    &.error {
                        border-color: @priceColor;
                    }
                    &.active,
                    &:focus {
                        border-color: @xtxColor;
                    }
                }
                .code {
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 14px;
                    background: #f5f5f5;
                    color: #666;
                    width: 90px;
                    height: 34px;
                    cursor: pointer;
                }
                .disable {
                    color: #bbb;
                }
            }
            > .error {
                position: absolute;
                font-size: 12px;
                line-height: 28px;
                color: @priceColor;
                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
            }
        }
        .agree {
            a {
                color: #069;
            }
        }
        .btn {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: @xtxColor;
            &.disabled {
                background: #cfcdcd;
            }
        }
    }
    .action {
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .url {
            a {
                color: #999;
                margin-left: 10px;
            }
        }
    }
}
</style>
