<template>
    <nav class="app-topnav">
        <div class="container">
            <ul class="menu-list">
                <template v-if="profile.token">
                    <li class="menu-item">
                        <a @click="$router.push('/member')"
                            ><i class="iconfont icon-user"></i
                            >{{ profile.nickname || profile.account }}</a
                        >
                    </li>
                    <li><a @click="logOut">退出登录</a></li>
                </template>
                <template v-else>
                    <li><RouterLink to="/login">请先登录</RouterLink></li>
                    <li><a>免费注册</a></li>
                </template>
                <li>
                    <RouterLink to="/member/order">我的订单</RouterLink>
                </li>
                <li @click="$router.push('/member')"><a>会员中心</a></li>
                <li><a>帮助中心</a></li>
                <li><a>关于我们</a></li>
                <li>
                    <a><i class="iconfont icon-phone"></i>手机版</a>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// 获取用户的登录信息,控制切换导航菜单
const store = useStore()
const router = useRouter()

// 1.使用vuex中的state必须用computed包装,否则没有响应式
const profile = computed(() => {
    return store.state.user.profile
})
// 2.直接使用,没有响应式!
// const profile2 = store.state.user.profile

// 退出登录
function logOut() {
    store.commit('user/setUser', {})
    store.commit('cart/setCart', [])
    router.push('/login')
}
</script>
<style scoped lang="less">
.app-topnav {
    background: @xtxColor;
    // ul {
    //     display: flex;
    //     height: 53px;
    //     justify-content: flex-end;
    //     align-items: center;
    //     li {
    //         transition: font-size 0.2s ease;
    //         font-size: 14px;
    //         a {
    //             padding: 0 15px;
    //             color: #fff;
    //             line-height: 1;
    //             display: inline-block;

    //             // i {
    //             //     font-size: 14px;
    //             //     margin-right: 2px;
    //             // }
    //         }
    //         &:hover {
    //             font-size: 30px;
    //         }
    //         &:not(:last-child)::after {
    //             content: '';
    //             display: inline-block;
    //             width: 2px;
    //             height: 14px;
    //             background-color: #fff;
    //         }
    //     }
    // }
    ul {
        display: flex;
        height: 53px;
        justify-content: flex-end;
        align-items: center;
        font-size: 14px;
        li {
            // background-color: purple;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 30px;
            transition: all 0.2s ease;
            a {
                color: #fff;
                margin: 0 15px;
                &:hover {
                    color: orange;
                }
            }
            &:not(:last-child)::after {
                content: '';
                display: inline-block;
                width: 2px;
                height: 20px;
                background-color: #fff;
            }
        }
        .iconfont {
            &:hover {
                color: #000;
            }
        }
    }
}
</style>
