<template>
    <!-- 概览 -->
    <div class="home-overview">
        <!-- 用户信息 -->
        <div class="user-meta">
            <div class="avatar">
                <RouterLink to="/member/user">
                    <img :src="$store.state.user.profile.avatar" />
                </RouterLink>
            </div>
            <h4>
                {{
                    $store.state.user.profile.nickname ||
                    $store.state.user.profile.account
                }}
            </h4>
        </div>
        <div class="item">
            <RouterLink to="/member/user">
                <span class="iconfont icon-user"></span>
                <p>个人信息</p>
            </RouterLink>
            <a href="javascript:;">
                <span class="iconfont icon-aq"></span>
                <p>安全设置</p>
            </a>
            <RouterLink to="/member/address">
                <span class="iconfont icon-dw"></span>
                <p>地址管理</p>
            </RouterLink>
        </div>
    </div>
</template>
<script setup></script>
<style scoped lang="less">
.home-overview {
    height: 132px;
    background: url(../../../../assets/images/center-bg.png) no-repeat center /
        cover;
    display: flex;
    .user-meta {
        flex: 1;
        display: flex;
        align-items: center;
        .avatar {
            width: 85px;
            height: 85px;
            border-radius: 50%;
            overflow: hidden;
            margin-left: 60px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        h4 {
            padding-left: 26px;
            font-size: 18px;
            font-weight: normal;
            color: white;
        }
    }
    .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &:first-child {
            border-right: 1px solid #f4f4f4;
        }
        a {
            color: white;
            font-size: 16px;
            text-align: center;
            .iconfont {
                font-size: 32px;
            }
            p {
                line-height: 32px;
            }
        }
    }
}
</style>
