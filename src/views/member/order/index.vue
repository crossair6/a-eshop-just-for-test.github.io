<template>
    <div class="member-order">
        <XtxTabs v-model="activeName" @clickTab="clickTab">
            <XtxTabsPanel
                v-for="item in orderStatus"
                :key="item.name"
                :label="item.label"
                :name="item.name"
            >
            </XtxTabsPanel>
        </XtxTabs>
        <div class="order-list">
            <XtxLoading v-if="loading" width="100%" height="800px"></XtxLoading>
            <div v-if="!loading && allOrder.items.length > 0">
                <OrderItem
                    v-for="order in allOrder.items"
                    :key="order.id"
                    :order="order"
                    @deleteOrder="deleteOrder(order.id)"
                    @cancelOrder="cancelOrder"
                    @changeOrderStateToShipped="changeOrderStateToShipped"
                    @confirmShipped="confirmShipped"
                    @getOrderLogistics="getOrderLogistics"
                ></OrderItem>
            </div>
            <div v-if="!loading && allOrder.items.length === 0" class="no-data">
                暂无相关订单
            </div>
            <XtxPagination
                v-if="!loading && allOrder.items.length > 0"
                :total="allOrder.counts"
                :page="queryParams.page"
                :pageSize="queryParams.pageSize"
                @changePage="changePage"
            ></XtxPagination>
        </div>
    </div>

    <teleport to="#dialog">
        <OrderCancel ref="orderCancelRef"></OrderCancel>
    </teleport>
    <OrderLogistics ref="orderLogisticsRef"></OrderLogistics>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { orderStatus } from '@/api/constants.js'
import {
    getAllOrderAPI,
    deleteOrderAPI,
    changeOrderStateToShippedAPI,
    confirmShippedAPI
} from '@/api/order.js'
import OrderItem from './components/OrderItem.vue'
import OrderCancel from './components/OrderCancel.vue'

import Confirm from '@/components/library/XtxConfirm.js'
import Message from '@/components/library/XtxMessage.js'
import OrderLogistics from './components/OrderLogistics.vue'
import { useCancelOrder } from '@/hooks'
import { instance } from '@/utils/request'
const allOrder = ref(null)
const activeName = ref('all')
const loading = ref(false)
const orderState = computed(() => {
    return orderStatus.find((order) => order.name === activeName.value)
        .orderState
})
const queryParams = ref({
    page: 1,
    pageSize: 5,
    orderState: orderState.value
})
// const promiseArr = []
// async function getAllOrder() {
//     loading.value = true
//     promiseArr.push(getAllOrderAPI(queryParams.value))
//     const res = await Promise.all(promiseArr)
//     allOrder.value = res[res.length - 1].result
//     loading.value = false
// }
let controller = null
let index = 0
async function getAllOrder() {
    index++
    if (index > 1) {
        controller && controller.abort()
        controller = new AbortController()
        console.log(instance.defaults.signal)
        instance.defaults.signal = controller.signal
    }
    try {
        loading.value = true
        const res = await getAllOrderAPI(queryParams.value)
        console.log(res)
        allOrder.value = res.result
    } catch (error) {
        console.log(error)
    }
    index = 0
    loading.value = false
}
async function deleteOrder(orderId) {
    try {
        await Confirm({ title: '删除订单', message: '确认删除该订单？' })
        console.log([orderId])
        await deleteOrderAPI([orderId])
        getAllOrder()
    } catch (e) {
        console.log(e)
    }
}

function clickTab(name, index) {
    // console.log(activeName.value)
    activeName.value = name
}
watch(
    () => queryParams.value.page,
    () => {
        getAllOrder()
    },
    { immediate: true }
)
watch(
    () => queryParams.value.orderState,
    () => {
        if (queryParams.value.page !== 1) {
            queryParams.value.page = 1
        } else {
            getAllOrder()
        }
    }
)
watch(orderState, (newVal) => {
    queryParams.value.orderState = newVal
})
function changePage(page) {
    queryParams.value.page = page
}

async function changeOrderStateToShipped(order) {
    const res = await changeOrderStateToShippedAPI(order.id)
    console.log(res)
    Message({
        type: 'success',
        text: '发货成功'
    })
    getAllOrder()
}
async function confirmShipped(order) {
    const res = await confirmShippedAPI(order.id)
    console.log(res)
    Message({
        type: 'success',
        text: '确认收货成功'
    })
    getAllOrder()
}

// 查看物流
const orderLogisticsRef = ref(null)
function getOrderLogistics(order) {
    // console.log(order)
    orderLogisticsRef.value.open(order)
}
// 封装到hooks文件夹的取消订单方法
const { orderCancelRef, cancelOrder } = useCancelOrder()
</script>
<style scoped lang="less">
.order-list {
    background: #fff;
    padding: 20px;
}
.no-data {
    width: 100%;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>
