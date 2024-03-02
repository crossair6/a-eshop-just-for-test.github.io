<template>
    <div class="xtx-pay-checkout-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem to="/cart">购物车</XtxBreadItem>
                <XtxBreadItem>填写订单</XtxBreadItem>
            </XtxBread>
            <div class="wrapper">
                <!-- 收货地址 -->
                <h3 class="box-title">收货地址</h3>
                <div class="box-body">
                    <CheckoutAddress
                        v-if="checkoutInfo"
                        :addressList="checkoutInfo.userAddresses"
                        @changeAddress="changeAddress"
                        @submit="getCheckoutInfo"
                    ></CheckoutAddress>
                </div>
                <!-- 商品信息 -->
                <h3 class="box-title">商品信息</h3>
                <div class="box-body">
                    <table class="goods">
                        <thead>
                            <tr>
                                <th width="520">商品信息</th>
                                <th width="170">单价</th>
                                <th width="170">数量</th>
                                <th width="170">小计</th>
                                <th width="170">实付</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="sku in checkoutInfo?.goods"
                                :key="sku?.skuId"
                            >
                                <td>
                                    <a href="javascript:;" class="info">
                                        <img :src="sku?.picture" alt="" />
                                        <div class="right">
                                            <p>
                                                {{ sku?.name }}
                                            </p>
                                            <p>
                                                {{ sku?.attrsText }}
                                            </p>
                                        </div>
                                    </a>
                                </td>
                                <td>&yen;{{ sku?.payPrice }}</td>
                                <td>{{ sku?.count }}</td>
                                <td>&yen;{{ sku?.totalPrice }}</td>
                                <td>&yen;{{ sku?.totalPayPrice }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 配送时间 -->
                <h3 class="box-title">配送时间</h3>
                <div class="box-body">
                    <a
                        class="my-btn"
                        v-for="item in deliverType"
                        :key="item.type"
                        :class="{
                            active: orderInfo.deliveryTimeType === item.type
                        }"
                        @click="onClickDeliveryTime(item.type)"
                        >{{ item.name }}</a
                    >
                </div>
                <!-- 支付方式 -->
                <h3 class="box-title">支付方式</h3>
                <div class="box-body">
                    <a
                        class="my-btn"
                        v-for="item in payType"
                        :key="item.type"
                        :class="{ active: orderInfo.payType === item.type }"
                        @click="onClickPayType(item.type)"
                        >{{ item.name }}</a
                    >

                    <span style="color: #999">货到付款需付5元手续费</span>
                </div>
                <!-- 金额明细 -->
                <h3 class="box-title">金额明细</h3>
                <div class="box-body">
                    <div class="total">
                        <dl>
                            <dt>商品件数：</dt>
                            <dd>{{ checkoutInfo?.summary?.goodsCount }}件</dd>
                        </dl>
                        <dl>
                            <dt>商品总价：</dt>
                            <dd>¥{{ checkoutInfo?.summary?.totalPrice }}</dd>
                        </dl>
                        <dl>
                            <dt>运<i></i>费：</dt>
                            <dd>¥{{ checkoutInfo?.summary?.postFee }}</dd>
                        </dl>
                        <dl>
                            <dt>应付总额：</dt>
                            <dd class="price">
                                ¥{{ checkoutInfo?.summary?.totalPayPrice }}
                            </dd>
                        </dl>
                    </div>
                </div>
                <!-- 提交订单 -->
                <div class="submit">
                    <XtxButton type="primary" @click="submitOrder"
                        >提交订单</XtxButton
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import CheckoutAddress from '@/views/member/pay/components/CheckoutAddress.vue'
import {
    getCheckoutInfoAPI,
    submitOrderAPI,
    rePurchaseOrderAPI
} from '@/api/order.js'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Message from '@/components/library/XtxMessage.js'
import { useStore } from 'vuex'
import { deliverType, payType } from '@/api/constants'
const store = useStore()
const router = useRouter()
const route = useRoute()
const checkoutInfo = ref(null)
// 传递给孙子组件AddAddress.vue,如果添加地址成功,就调用此方法
// provide('getCheckoutInfo', getCheckoutInfo)

async function getCheckoutInfo() {
    try {
        const res = await getCheckoutInfoAPI()
        console.log(res)

        console.log(res?.result?.userAddresses[0].receiver)

        checkoutInfo.value = res.result
        console.log(checkoutInfo.value)
        orderInfo.value.goods = checkoutInfo.value?.goods.map((sku) => {
            return {
                skuId: sku.skuId,
                count: sku.count
            }
        })
    } catch (e) {
        console.log(e)
        Message({ type: 'error', text: e.message })
        // router.push('/cart')
    }
}
if (!route.query.orderId) {
    getCheckoutInfo()
}

async function rePurchaseOrder() {
    try {
        console.log(route)
        const res = await rePurchaseOrderAPI(route.query.orderId)
        console.log(res)
        checkoutInfo.value = res.result
        // console.log(checkoutInfo.value)
    } catch (e) {
        Message({ type: 'error', text: e.message })
        // router.push('/cart')
    }
}

// 有订单id为再次购买
if (route.query.orderId) {
    rePurchaseOrder()
} else {
    // 没有订单id则是从购物车来的
    getCheckoutInfo()
}

// 接收到CheckoutAddress组件传过来的选中的地址Id

function changeAddress(showAddress) {
    orderInfo.value.addressId = showAddress.id
}
// 点击配送时间
function onClickDeliveryTime(deliveryTimeType) {
    orderInfo.value.deliveryTimeType = deliveryTimeType
}
// 点击支付方式
function onClickPayType(payType) {
    orderInfo.value.payType = payType
}
// 提交订单用的订单信息
const orderInfo = ref({
    goods: [],
    addressId: '',
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: ''
})
// 提交订单
async function submitOrder() {
    if (!orderInfo.value.addressId) {
        return Message({
            type: 'error',
            text: '请先选择地址'
        })
    }
    console.log(orderInfo.value)
    if (route.query.orderId) {
        rePurchaseOrder()
        return
    }
    const res = await submitOrderAPI(orderInfo.value)
    Message({
        type: 'success',
        text: '下单成功'
    })
    // 更新购物车商品
    store.dispatch('cart/getCart')
    router.push({ path: '/member/pay', query: { orderId: res.result.id } })
}
</script>
<style scoped lang="less">
.xtx-pay-checkout-page {
    .wrapper {
        background: #fff;
        padding: 0 20px;
        .box-title {
            font-size: 16px;
            font-weight: normal;
            padding-left: 10px;
            line-height: 70px;
            border-bottom: 1px solid #f5f5f5;
        }
        .box-body {
            padding: 20px 0;
        }
    }
}
.address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;
        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }
        > ul {
            flex: 1;
            padding: 20px;
            li {
                line-height: 30px;
                span {
                    color: #999;
                    margin-right: 5px;
                    > i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }
        > a {
            color: @xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }
    .action {
        width: 420px;
        text-align: center;
        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;
            &:first-child {
                margin-right: 10px;
            }
        }
    }
}
.goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    .info {
        display: flex;
        text-align: left;
        img {
            width: 70px;
            height: 70px;
            margin-right: 20px;
        }
        .right {
            line-height: 24px;
            p {
                &:last-child {
                    color: #999;
                }
            }
        }
    }
    tr {
        th {
            background: #f5f5f5;
            font-weight: normal;
        }
        td,
        th {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid #f5f5f5;
            &:first-child {
                border-left: 1px solid #f5f5f5;
            }
            &:last-child {
                border-right: 1px solid #f5f5f5;
            }
        }
    }
}
.my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
        border-color: @xtxColor;
    }
}
.total {
    dl {
        display: flex;
        justify-content: flex-end;
        line-height: 50px;
        dt {
            i {
                display: inline-block;
                width: 2em;
            }
        }
        dd {
            width: 240px;
            text-align: right;
            padding-right: 70px;
            &.price {
                font-size: 20px;
                color: @priceColor;
            }
        }
    }
}
.submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
}
</style>
