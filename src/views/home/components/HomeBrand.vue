<template>
    <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
        <template #right>
            <a
                href="javascript:;"
                class="iconfont icon-angle-left prev"
                @click="prev"
                :class="{ disabled: activeIndex === 0 }"
            ></a>
            <a
                href="javascript:;"
                class="iconfont icon-angle-right next"
                @click="next"
                :class="{ disabled: activeIndex === 1 }"
            ></a>
        </template>
        <div class="box" ref="target">
            <Transition name="fade">
                <ul
                    class="list"
                    :style="{
                        transform: `translateX(${-activeIndex * 1240}px)`
                    }"
                    v-if="brand"
                >
                    <li v-for="item in brand" :key="item.id">
                        <RouterLink to="/">
                            <img :src="item.logo" alt="" />
                        </RouterLink>
                    </li>
                </ul>
                <div class="home-brand-skeleton" v-else>
                    <XtxSkeleton
                        class="skeleton-item"
                        v-for="item in 5"
                        :key="item"
                        animated
                        width="240px"
                        height="305px"
                    ></XtxSkeleton>
                </div>
            </Transition>
        </div>
    </HomePanel>
</template>

<script setup>
import HomePanel from './HomePanel.vue'
import { useLazyData } from '@/hooks/index.js'
import { getBrandAPI } from '@/api/home.js'
import { ref } from 'vue'
const { target, data: brand } = useLazyData(getBrandAPI, 10)

const activeIndex = ref(0)
// 上一张
const prev = () => {
    if (activeIndex.value === 1) {
        activeIndex.value = 0
    }
}
// 下一张
const next = () => {
    if (activeIndex.value === 0) {
        activeIndex.value = 1
    }
}
</script>

<style scoped lang="less">
.home-brand-skeleton {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.home-panel {
    background: #f5f5f5;
}
.iconfont {
    width: 20px;
    height: 20px;
    background: #ccc;
    color: #fff;
    display: inline-block;
    text-align: center;
    margin-left: 5px;
    background: @xtxColor;
    &::before {
        font-size: 12px;
        position: relative;
        top: -2px;
    }
    &.disabled {
        background: #ccc;
        cursor: not-allowed;
    }
}
.box {
    display: flex;
    width: 100%;
    height: 345px;
    overflow: hidden;
    padding-bottom: 40px;
    .list {
        width: 200%;
        display: flex;
        transition: all 1s;
        li {
            margin-right: 10px;
            width: 240px;
            &:nth-child(5n) {
                margin-right: 0;
            }
            img {
                width: 240px;
                height: 305px;
            }
        }
    }
}
</style>
