<template>
    <div class="member-home" v-if="collect && footPrint">
        <!-- 概览 -->
        <HomeOverview />
        <!-- 收藏 -->
        <HomePanel title="我的收藏">
            <GoodsItem
                v-for="goods in collect"
                :key="goods.GoodsItem"
                :goods="goods"
            />
        </HomePanel>
        <!-- 足迹 -->
        <HomePanel title="我的足迹">
            <GoodsItem
                v-for="goods in footPrint"
                :key="goods.GoodsItem"
                :goods="goods"
            />
        </HomePanel>
        <!-- 猜你 -->
        <GoodsRelevant />
    </div>
</template>
<script setup>
import HomeOverview from './components/HomeOverview.vue'
import HomePanel from './components/HomePanel.vue'
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'
import GoodsItem from '@/views/category/components/GoodsItem.vue'
import { getCollectAPI } from '@/api/member.js'
import { ref } from 'vue'
const queryObject = ref({
    page: 1,
    pageSize: 4,
    collectType: 1
})
const collect = ref(null)
async function getCollect() {
    const res = await getCollectAPI(queryObject.value)
    console.log(res)
    collect.value = res.result.items
}
getCollect()
const footPrint = ref(null)
async function getFootPrint() {
    const res = await getCollectAPI(queryObject.value)
    console.log(res)
    footPrint.value = res.result.items
}
getFootPrint()
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
    left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
    right: 5px;
}
</style>
