<template>
    <div class="app-header-sticky" :class="{ show: isShow }">
        <div class="container" v-show="isShow">
            <RouterLink class="logo" to="/" />
            <AppHeaderNav />
            <div class="right">
                <RouterLink to="/">品牌</RouterLink>
                <RouterLink to="/">专题</RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import AppHeaderNav from './AppHeaderNav.vue'
import { ref, watch } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const isShow = ref(false)
const showHeight = 78

// 1.传统方式,控制显示隐藏

// onMounted(() => {
//     window.onscroll = () => {
//         const scrollHeight =
//             document.documentElement.scrollTop || document.body.scrollTop
//         if (scrollHeight >= showHeight) {
//             isShow.value = true
//         } else {
//             isShow.value = false
//         }
//     }
// })

// 2.vueuse库
const { y } = useWindowScroll()
watch(y, () => {
    y.value > showHeight ? (isShow.value = true) : (isShow.value = false)
})
</script>

<style scoped lang="less">
.app-header-sticky {
    width: 100%;
    height: 80px;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: #fff;
    border-bottom: 1px solid #e4e4e4;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    &.show {
        transform: translateY(0%);
        opacity: 1;
    }
    .container {
        display: flex;
        align-items: center;
    }
    .logo {
        width: 200px;
        height: 80px;
        background: url(../assets/images/logo.png) no-repeat right 2px;
        background-size: 160px auto;
    }
    .right {
        width: 220px;
        display: flex;
        text-align: center;
        padding-left: 40px;
        border-left: 2px solid @xtxColor;
        a {
            width: 38px;
            margin-right: 40px;
            font-size: 16px;
            line-height: 1;
            &:hover {
                color: @xtxColor;
            }
        }
    }
}
</style>
