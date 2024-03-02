import { getOrderLogisticsAPI } from '@/api/order'; import OrderLogisticsVue
from '../../components/OrderLogistics.vue';
<template>
    <div class="detail-logistics">
        <p>
            <span>{{ logistics.list[0].time }}</span>
            <span>{{ logistics.list[0].text }}</span>
        </p>
        <a @click="openOrderLogistics(order)">查看物流</a>
    </div>
    <teleport to="#dialog">
        <OrderLogistics ref="orderLogisticsRef"></OrderLogistics>
    </teleport>
</template>
<script setup>
import { ref } from 'vue'
import { getOrderLogisticsAPI } from '@/api/order.js'
import OrderLogistics from '../../components/OrderLogistics.vue'
import { useOrderLogistics } from '@/hooks'
const props = defineProps({
    order: {
        type: Object,
        default: () => {}
    }
})
const logistics = ref({ list: [{}] })
async function getOrderLogistics() {
    const res = await getOrderLogisticsAPI(props.order.id)
    console.log(res)
    logistics.value = res.result
}
getOrderLogistics()
const { orderLogisticsRef, openOrderLogistics } = useOrderLogistics()
</script>
<style scoped lang="less">
.detail-logistics {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
    > p {
        flex: 1;
        span {
            color: #999;
            &:first-child {
                margin-right: 30px;
            }
        }
    }
    > a {
        color: @xtxColor;
        text-align: center;
    }
}
</style>
