<template>
    <div class="xtx-infinite-loading" ref="target">
        <div class="loading" v-if="loading">
            <span class="img"></span>
            <span class="text">正在加载...</span>
        </div>
        <div class="none" v-if="finished">
            <span class="img"></span>
            <span class="text">亲，没有更多了</span>
        </div>
    </div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

// 组件使用方法
// 1.由外界传递的loading和finished来控制显示加载图片和没有更多图片
// 2.每次进入可视区,就向外界发送一个事件,通知外界,应该加载数据了
// <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getGoodsList"></XtxInfiniteLoading>

// 组件实现思路
// 1.把无限加载组件放在最下方
// 2.只要组件进入可视区,
// 2.1 如果loading为false, finished为false, 发送infinite事件, 此时变更为加载状态("加载"图片)
// 2.2 如果finished为true,变更为加载完成状态("没有更多"图片)
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    finished: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['infinite'])
const target = ref(null)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
    if (isIntersecting) {
        if (!props.finished) {
            if (!props.loading) {
                console.log('已进入可视区')
                emit('infinite')
            }
        } else {
            console.log('已经加载完毕')
        }
    }
})
</script>

<style scoped lang="less">
.xtx-infinite-loading {
    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;

        .img {
            width: 50px;
            height: 50px;
            background: url(../../assets/images/load.gif) no-repeat center /
                contain;
        }

        .text {
            color: #999;
            font-size: 16px;
        }
    }

    .none {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;

        .img {
            width: 200px;
            height: 134px;
            background: url(../../assets/images/none.png) no-repeat center /
                contain;
        }

        .text {
            color: #999;
            font-size: 16px;
        }
    }
}
</style>
