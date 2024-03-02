<template>
    <div class="container">
        <!-- 顶部通栏 -->
        <AppNavBar></AppNavBar>

        <!-- 头部组件 -->
        <AppHeader></AppHeader>
        <!-- 吸顶头部组件 -->
        <AppHeaderSticky></AppHeaderSticky>
        <!-- 内容容器 -->
        <div class="main">
            <!-- 二级路由 -->
            <RouterView></RouterView>
        </div>
        <!-- 底部组件 -->
        <AppFooter></AppFooter>
    </div>
</template>

<script setup>
import AppNavBar from '@/components/AppNavBar.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppHeaderSticky from '@/components/AppHeaderSticky.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useStore } from 'vuex'
const store = useStore()
store.dispatch('category/getCategory')
</script>

<style lang="less" scoped>
</style>
