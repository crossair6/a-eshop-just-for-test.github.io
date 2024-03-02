<template>
    <div class="xtx-member-aside">
        <div class="user-manage">
            <h4>我的账户</h4>
            <div class="links">
                <RouterLink
                    :to="item.url"
                    v-for="item in myAccount"
                    :key="item.name"
                    :class="{
                        active: $route.path === item.url
                    }"
                    >{{ item.name }}</RouterLink
                >
            </div>
            <h4>交易管理</h4>
            <div class="links">
                <RouterLink
                    :to="item.url"
                    v-for="item in transactionManagement"
                    :key="item.name"
                    :class="{
                        active: $route.path === item.url
                    }"
                    >{{ item.name }}</RouterLink
                >
            </div>
            <h4>我的收藏</h4>
            <div class="links">
                <RouterLink
                    :to="item.url"
                    v-for="item in myCollection"
                    :key="item.name"
                    :class="{
                        active: $route.path === item.url
                    }"
                    >{{ item.name }}</RouterLink
                >
            </div>
            <h4>帮助中心</h4>
            <div class="links">
                <RouterLink
                    :to="item.url"
                    v-for="item in helpCenter"
                    :key="item.name"
                    :class="{
                        active: $route.path === item.url
                    }"
                    >{{ item.name }}</RouterLink
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    myAccount,
    transactionManagement,
    myCollection,
    helpCenter
} from '@/api/constants'
</script>

<style scoped lang="less">
.xtx-member-aside {
    width: 220px;
    margin-right: 20px;
    border-radius: 2px;
    .user-manage {
        background-color: #fff;
        h4 {
            font-size: 18px;
            font-weight: 400;
            padding: 20px 52px 5px;
            border-top: 1px solid #f6f6f6;
        }

        .links {
            padding: 0 52px 10px;
        }

        a {
            display: block;
            line-height: 1;
            padding: 15px 0;
            font-size: 14px;
            color: #666;
            position: relative;

            &:hover {
                color: @xtxColor;
            }
            &.active {
                color: @xtxColor;

                &:before {
                    display: block;
                }
            }

            &:before {
                content: '';
                display: none;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                position: absolute;
                top: 17px;
                left: -16px;
                background-color: @xtxColor;
            }
        }
    }
}
</style>
