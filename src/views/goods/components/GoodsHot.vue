<template>
    <div class="goods-hot">
        <h3>{{ title }}</h3>
        <div v-if="goodsList">
            <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item" />
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { getHotGoodsAPI } from '@/api/goods.js'
import GoodsItem from '@/views/category/components/GoodsItem.vue'
const props = defineProps({
    type: {
        type: Number,
        default: 1
    },
    goodsId: {
        type: String,
        default: ''
    }
})

const titleObj = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
const title = computed(() => {
    return titleObj[props.type]
})
const goodsList = ref([])
getHotGoodsAPI(props.goodsId, 4, props.type).then((data) => {
    // console.log(data)
    goodsList.value = data.result
})
</script>
<style scoped lang="less">
.goods-hot {
    h3 {
        height: 70px;
        background: @helpColor;
        color: #fff;
        font-size: 18px;
        line-height: 70px;
        padding-left: 25px;
        margin-bottom: 10px;
        font-weight: normal;
    }
    ::v-deep .goods-item {
        background: #fff;
        width: 100%;
        margin-bottom: 10px;
        img {
            width: 200px;
            height: 200px;
        }
        p {
            margin: 0 10px;
        }
        // &:hover {
        //     transform: none;
        //     box-shadow: none;
        // }
    }
}
</style>
