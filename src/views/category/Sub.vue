<template>
    <div class="container">
        <!--二级类目面包屑 -->
        <SubBread></SubBread>

        <!-- 筛选区 -->
        <SubFilter @filterChange="filterChange"></SubFilter>
        <!-- 商品面板 排序列表 -->
        <div class="goods-list">
            <SubSort @sortChange="sortChange"></SubSort>
            <!-- 列表 -->
            <ul>
                <li v-for="item in goodsList" :key="item.id">
                    <GoodsItem :goods="item" />
                </li>
            </ul>
            <XtxInfiniteLoading
                :loading="loading"
                :finished="finished"
                @infinite="getGoodsList"
            ></XtxInfiniteLoading>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getGoodsListAPI } from '@/api/category.js'
import SubBread from './components/SubBread.vue'
import SubFilter from './components/SubFilter.vue'
import SubSort from './components/SubSort.vue'
import GoodsItem from './components/GoodsItem.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const loading = ref(false)
const finished = ref(false)
const reqParams = ref({
    page: 1,
    pageSize: 20
})
const goodsList = ref([])
// 获取商品信息
async function getGoodsList() {
    loading.value = true
    const res = await getGoodsListAPI(reqParams.value)

    goodsList.value.push(...res.result.items)
    if (goodsList.value.length >= res.result.counts) {
        finished.value = true
        loading.value = false
        return
    }
    reqParams.value.page++
    console.log(goodsList.value)
    loading.value = false
}

// 更换筛选,排序条件或二级分类id后重新加载数据的通用方法
function getAllNewData() {
    reqParams.value.page = 1
    reqParams.value.pageSize = 20
    goodsList.value = []
    finished.value = false
    getGoodsList()
}

// 更改二级分类时重新加载数据
watch(
    () => route.params.id,
    (newVal) => {
        if (newVal && `/category/sub/${newVal}` === route.path) {
            getAllNewData()
        }
    }
)
// 更换筛选条件后重新加载数据
function filterChange(filterParams) {
    reqParams.value = { ...reqParams.value, ...filterParams }
    console.log(reqParams.value)
    getAllNewData()
}
// 更换排序条件后重新加载数据
function sortChange(sortParams) {
    reqParams.value = { ...reqParams.value, ...sortParams }
    console.log(reqParams.value)
    getAllNewData()
}
</script>

<style lang="less" scoped>
.goods-list {
    background: #fff;
    padding: 0 25px;
    margin-top: 25px;

    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 5px;

        li {
            margin-right: 20px;
            margin-bottom: 20px;

            &:nth-child(5n) {
                margin-right: 0;
            }
        }
    }
}
</style>
