<template>
    <div class="order-item">
        <div class="head">
            <span>下单时间：{{ order.createTime }}</span>
            <span>订单编号：{{ order.id }}</span>
            <span class="down-time" v-if="order.orderState === 1">
                <i class="iconfont icon-down-time"></i>
                <b v-if="order.countdown > 0">付款截止：{{ timeStr }}</b>
                <b v-else>已超时</b>
            </span>
            <a
                @click="deleteOrder"
                class="del"
                v-if="[5, 6].includes(order.orderState)"
                >删除</a
            >
        </div>
        <div class="body">
            <div class="column goods">
                <ul>
                    <li v-for="sku in order.skus" :key="sku.id">
                        <a class="image" href="javascript:;">
                            <img :src="sku.image" alt="" />
                        </a>
                        <div class="info">
                            <p class="name ellipsis-2">
                                {{ sku.name }}
                            </p>
                            <p class="attr ellipsis">
                                <span>{{ sku.attrsText }}</span>
                            </p>
                        </div>
                        <div class="price">¥{{ sku.realPay.toFixed(2) }}</div>
                        <div class="count">x{{ sku.quantity }}</div>
                    </li>
                </ul>
            </div>
            <div class="column state">
                <p>{{ orderStatus[order.orderState].label }}</p>
                <p v-if="order.orderState === 3">
                    <a @click="$emit('getOrderLogistics', order)" class="green"
                        >查看物流</a
                    >
                </p>
                <p v-if="order.orderState === 4">
                    <a href="javascript:;" class="green">评价商品</a>
                </p>
                <p v-if="order.orderState === 5">
                    <a href="javascript:;" class="green">查看评价</a>
                </p>
            </div>
            <div class="column amount">
                <p class="red">¥{{ order.payMoney.toFixed(2) }}</p>
                <p>（含运费：¥{{ order.postFee.toFixed(2) }}）</p>
                <p>在线支付</p>
            </div>
            <div class="column action">
                <XtxButton
                    type="primary"
                    size="small"
                    v-if="order.orderState === 1 && order.countdown > 0"
                    @click="goPay"
                    >立即付款</XtxButton
                >
                <XtxButton
                    v-if="order.orderState === 3"
                    type="primary"
                    size="small"
                    @click="confirmShipped"
                    >确认收货
                </XtxButton>
                <p v-if="[2, 3, 4, 5].includes(order.orderState)">
                    <XtxButton
                        type="primary"
                        size="small"
                        @click="
                            $router.push('/member/checkout?orderId=' + order.id)
                        "
                        >再次购买</XtxButton
                    >
                </p>
                <p>
                    <XtxButton
                        type="plain"
                        size="small"
                        @click="$router.push(`/member/order/${order.id}`)"
                        >查看详情</XtxButton
                    >
                </p>
                <p v-if="order.orderState === 1">
                    <XtxButton @click="cancelOrder" type="danger" size="small"
                        >取消订单</XtxButton
                    >
                </p>
                <p v-if="order.orderState === 2">
                    <a @click="changeOrderStateToShipped">改成已发货</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch } from 'vue'
import { useCountdown } from '@/hooks/index.js'
import { orderStatus } from '@/api/constants.js'
const props = defineProps({
    order: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits([
    'deleteOrder',
    'cancelOrder',
    'changeOrderStateToShipped',
    'confirmShipped',
    'getOrderLogistics'
])
const { start, timeStr } = useCountdown()
watch(
    () => props.order,
    () => {
        start(props.order.countdown)
    },
    {
        immediate: true
    }
)
function goPay() {}
function deleteOrder() {
    emit('deleteOrder')
}

function cancelOrder() {
    emit('cancelOrder', props.order)
}
function changeOrderStateToShipped() {
    emit('changeOrderStateToShipped', props.order)
}
function confirmShipped() {
    emit('confirmShipped', props.order)
}
</script>

<style lang="less" scoped>
.order-item {
    margin-bottom: 20px;
    border: 1px solid #f5f5f5;
    .head {
        height: 50px;
        line-height: 50px;
        background: #f5f5f5;
        padding: 0 20px;
        overflow: hidden;
        span {
            margin-right: 20px;
            &.down-time {
                margin-right: 0;
                float: right;
                i {
                    vertical-align: middle;
                    margin-right: 3px;
                }
                b {
                    vertical-align: middle;
                    font-weight: normal;
                }
            }
        }
        .del {
            margin-right: 0;
            float: right;
            color: #999;
        }
    }
    .body {
        display: flex;
        align-items: stretch;
        .column {
            border-left: 1px solid #f5f5f5;
            text-align: center;
            padding: 20px;
            > p {
                padding-top: 10px;
            }
            &:first-child {
                border-left: none;
            }
            &.goods {
                flex: 1;
                padding: 0;
                align-self: center;
                ul {
                    li {
                        border-bottom: 1px solid #f5f5f5;
                        padding: 10px;
                        display: flex;
                        &:last-child {
                            border-bottom: none;
                        }
                        .image {
                            width: 70px;
                            height: 70px;
                            border: 1px solid #f5f5f5;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .info {
                            width: 220px;
                            text-align: left;
                            padding: 0 10px;
                            p {
                                // margin-bottom: 5px;
                                &.name {
                                    height: 38px;
                                }
                                &.attr {
                                    color: #999;
                                    font-size: 12px;
                                    span {
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }
                        .price {
                            width: 100px;
                        }
                        .count {
                            width: 80px;
                        }
                    }
                }
            }
            &.state {
                width: 120px;
                .green {
                    color: @xtxColor;
                }
            }
            &.amount {
                width: 200px;
                .red {
                    color: @priceColor;
                }
            }
            &.action {
                width: 140px;
                a {
                    display: block;
                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
}
</style>
