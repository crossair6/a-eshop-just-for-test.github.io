<template>
    <div class="xtx-confirm" :class="{ fade }">
        <div class="wrapper" :class="{ fade }">
            <div class="header">
                <h3>{{ title }}</h3>
                <a @click="cancel" class="iconfont icon-close-new"></a>
            </div>
            <div class="body">
                <i class="iconfont icon-warning"></i>
                <span>{{ message }}</span>
            </div>
            <div class="footer">
                <XtxButton size="small" type="danger" @click="cancel"
                    >取消</XtxButton
                >
                <XtxButton size="small" type="primary" @click="submit"
                    >确认</XtxButton
                >
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import XtxButton from './XtxButton.vue'
const props = defineProps({
    title: {
        type: String,
        default: '温馨提示'
    },
    message: {
        type: String,
        default: '确认执行此操作?'
    },
    cancelCallback: {
        type: Function
    },
    submitCallback: {
        type: Function
    }
})
// 对话框默认隐藏
const fade = ref(false)
// 组件渲染完毕后
onMounted(() => {
    requestAnimationFrame(() => {
        fade.value = true
    })
})
// 取消操作
function cancel() {
    props.cancelCallback()
}
// 确认操作
function submit() {
    props.submitCallback()
}
</script>
<style scoped lang="less">
.xtx-confirm {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 8888;
    background: rgba(0, 0, 0, 0);
    &.fade {
        transition: all 0.4s;
        background: rgba(0, 0, 0, 0.5);
    }
    .wrapper {
        width: 400px;
        background: #fff;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        opacity: 0;
        &.fade {
            transition: all 0.4s;
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        .header,
        .footer {
            height: 50px;
            line-height: 50px;
            padding: 0 20px;
        }
        .body {
            padding: 20px 40px;
            font-size: 16px;
            .icon-warning {
                color: @priceColor;
                margin-right: 3px;
                font-size: 16px;
            }
        }
        .footer {
            // text-align: right;
            display: flex;
            align-items: center;
            justify-content: center;
            .xtx-button {
                margin-left: 20px;
            }
        }
        .header {
            position: relative;
            h3 {
                font-weight: normal;
                font-size: 18px;
            }
            a {
                position: absolute;
                right: 15px;
                top: 15px;
                font-size: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                text-align: center;
                color: #999;
                &:hover {
                    color: #666;
                }
            }
        }
    }
}
</style>
