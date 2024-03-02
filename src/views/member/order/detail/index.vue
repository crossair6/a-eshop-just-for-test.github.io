<template>
    <div class="member-order-detail" v-if="order">
        <!-- 头部 -->
        <DetailHead :order="order"></DetailHead>
        <!-- 进度 -->
        <DetailStep :order="order"></DetailStep>
        <!-- 物流 -->
        <DetailLogistics
            v-if="[3, 4, 5].includes(order.orderState)"
            :order="order"
        ></DetailLogistics>
        <!-- 信息 -->
        <DetailGoods :order="order"></DetailGoods>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderAPI } from '@/api/order.js'
import DetailHead from './components/DetailHead.vue'
import DetailStep from './components/DetailStep.vue'
import DetailLogistics from './components/DetailLogistics.vue'
import DetailGoods from './components/DetailGoods.vue'
const order = ref(null)
const route = useRoute()
async function getOrder() {
    console.log(route.params.id)
    const res = await getOrderAPI(route.params.id)
    console.log(res)
    order.value = res.result
}
getOrder()
</script>

<style lang="less" scoped>
.member-order-detail {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>
