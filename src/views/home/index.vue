<template>
    <div class="container">
        <!-- 首页入口(分类+轮播图) -->
        <div class="home-entry">
            <!-- 分类 -->
            <HomeCategory></HomeCategory>
            <!-- 轮播图 -->
            <HomeBanner></HomeBanner>
        </div>
        <!-- 新鲜好物 -->
        <HomeNew></HomeNew>
        <!-- 人气推荐 -->
        <HomeHot></HomeHot>
        <!-- 热门品牌 -->
        <HomeBrand></HomeBrand>
        <!-- 最新专题 -->
        <HomeSpecial></HomeSpecial>
        <!-- 使用transition组件 -->
        <!-- <button @click="show = !show">切换</button>
        <Transition>
            <div class="box" v-if="show"></div>
        </Transition>
        <Transition name="height">
            <div class="box" v-if="show"></div>
        </Transition> -->
    </div>
</template>

<script setup>
import HomeCategory from './components/HomeCategory.vue'
import HomeBanner from './components/HomeBanner.vue'
import HomeNew from './components/HomeNew.vue'
import HomeHot from './components/HomeHot.vue'
import HomeBrand from './components/HomeBrand.vue'
import HomeSpecial from './components/HomeSpecial.vue'
// import { ref } from 'vue'
// const show = ref(true)
</script>

<style lang="less" scoped>
.box {
    width: 100px;
    height: 100px;
    background-color: red;
}
// 进入状态 v-enter-from v-enter-active v-enter-to
// 离开状态 v-leave-from v-leave-active v-leave-to
.v {
    &-enter {
        &-from {
            opacity: 0;
        }
        &-active {
            transition: all 1s;
        }
        &-to {
            opacity: 1;
        }
    }
    &-leave {
        &-from {
            opacity: 1;
        }
        &-active {
            transition: all 1s;
        }
        &-to {
            opacity: 0;
        }
    }
}

.height {
    &-enter {
        &-from {
            height: 0;
        }
        &-active {
            transition: all 1s;
        }
        &-to {
            height: 100px;
        }
    }
    &-leave {
        &-from {
            height: 100px;
        }
        &-active {
            transition: all 1s;
        }
        &-to {
            height: 0;
        }
    }
}
</style>
