<template>
    <div class="xtx-dialog" :class="{ fade }" v-if="modelValue" @wheel.prevent>
        <div class="wrapper" :class="{ fade }">
            <div class="header">
                <h3>{{ title }}</h3>
                <a
                    href="JavaScript:;"
                    class="iconfont icon-close-new"
                    @click="close"
                ></a>
            </div>
            <div class="body"><slot name="default"></slot></div>
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue', 'close'])
const fade = ref(false)
watch(
    () => props.modelValue,
    (newVal) => {
        requestAnimationFrame(() => {
            fade.value = newVal
        })
    },
    {
        immediate: true
    }
)
// 点击叉号后关闭对话框,并将关闭事件传递给外界
function close() {
    emit('close')
    emit('update:modelValue', false)
}
</script>
<style scoped lang="less">
.xtx-dialog {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, 0);
    // overflow: scroll;
    &.fade {
        transition: all 0.4s;
        background: rgba(0, 0, 0, 0.5);
    }
    .wrapper {
        width: 700px;
        background: #fff;
        border-radius: 4px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -80%);
        opacity: 0;
        // max-height: 700px;
        // overflow: scroll;
        &.fade {
            transition: all 0.4s;
            transform: translate(-50%, -50%);
            opacity: 1;
        }
        .body {
            padding: 20px 40px;
            font-size: 16px;
            overflow-y: scroll;
            border-bottom: 1px dashed #ccc;

            .icon-warning {
                color: @priceColor;
                margin-right: 3px;
                font-size: 16px;
            }
        }
        .footer {
            // padding: 10px 0 30px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
        }
        .header {
            position: relative;
            height: 100px;
            line-height: 70px;
            padding: 0 20px;
            border-bottom: 1px dashed #eee;
            h3 {
                font-weight: normal;
                font-size: 18px;
            }
            a {
                position: absolute;
                right: 25px;
                top: 25px;
                font-size: 24px;
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
