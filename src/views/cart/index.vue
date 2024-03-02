<template>
    <div class="xtx-cart-page">
        <div class="container">
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem>购物车</XtxBreadItem>
            </XtxBread>
            <div class="cart" v-if="store.state.cart.list.length !== 0">
                <table>
                    <thead>
                        <tr>
                            <th width="120">
                                <XtxCheckBox
                                    :modelValue="
                                        $store.getters['cart/isAllChecked']
                                    "
                                    @change="
                                        $store.dispatch(
                                            'cart/updateAllChecked',
                                            $event
                                        )
                                    "
                                    >全选</XtxCheckBox
                                >
                            </th>
                            <th width="400">商品信息</th>
                            <th width="220">单价</th>
                            <th width="180">数量</th>
                            <th width="180">小计</th>
                            <th width="140">操作</th>
                        </tr>
                    </thead>
                    <!-- 有效商品 -->
                    <tbody>
                        <tr
                            v-for="sku in $store.getters['cart/validList']"
                            :key="sku.skuId"
                        >
                            <td>
                                <XtxCheckBox
                                    :modelValue="sku.selected"
                                    @change="
                                        updateSkuChecked({
                                            skuId: sku.skuId,
                                            isCheck: $event
                                        })
                                    "
                                />
                            </td>
                            <td>
                                <div class="goods">
                                    <RouterLink :to="`/goods/${sku.id}`"
                                        ><img :src="sku.picture" alt=""
                                    /></RouterLink>
                                    <div>
                                        <p class="name ellipsis">
                                            {{ sku.name }}
                                        </p>
                                        <!-- 选择规格组件 -->
                                        <CartSku
                                            @getSpecsAndSku="
                                                getSpecsAndSku(sku.skuId)
                                            "
                                            @getGoods="getGoods(sku.id)"
                                            :goods="goods"
                                            :sku="sku"
                                            @layerClose="layerClose"
                                        ></CartSku>
                                    </div>
                                </div>
                            </td>
                            <td class="tc">
                                <p>
                                    &yen;{{ Number(sku.nowPrice).toFixed(2) }}
                                </p>
                                <p v-if="sku.price - sku.nowPrice > 0">
                                    比加入时降价
                                    <span class="red"
                                        >&yen;{{
                                            (sku.price - sku.nowPrice).toFixed(
                                                2
                                            )
                                        }}</span
                                    >
                                </p>
                            </td>
                            <td class="tc">
                                <XtxNumberBox
                                    :label="false"
                                    :modelValue="sku.count"
                                    :max="sku.stock"
                                    @change="
                                        $store.dispatch('cart/updateSkuCount', {
                                            skuId: sku.skuId,
                                            number: $event
                                        })
                                    "
                                />
                            </td>
                            <td class="tc">
                                <p class="f16 red">
                                    &yen;{{
                                        (sku.price * sku.count).toFixed(2)
                                    }}
                                </p>
                            </td>
                            <td class="tc">
                                <p><a href="javascript:;">移入收藏夹</a></p>
                                <p>
                                    <a
                                        class="green"
                                        @click="deleteCart(sku.skuId)"
                                        >删除</a
                                    >
                                </p>
                                <p><a href="javascript:;">找相似</a></p>
                            </td>
                        </tr>
                    </tbody>
                    <!-- 无效商品 -->
                    <tbody v-if="$store.getters['cart/invalidList'].length > 0">
                        <tr>
                            <td colspan="6"><h3 class="tit">失效商品</h3></td>
                        </tr>
                        <tr
                            v-for="sku in $store.getters['cart/invalidList']"
                            :key="sku.skuId"
                        >
                            <td><XtxCheckBox style="color: #eee" /></td>
                            <td>
                                <div class="goods">
                                    <RouterLink to="`/goods/${sku.id}`"
                                        ><img :src="sku.picture" alt=""
                                    /></RouterLink>
                                    <div>
                                        <p class="name ellipsis">
                                            {{ sku.name }}
                                        </p>
                                        <p class="attr">
                                            {{ sku.attrsText }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="tc">
                                <p>&yen;{{ sku.nowPrice }}</p>
                            </td>
                            <td class="tc">{{ sku.count }}</td>
                            <td class="tc">
                                <p>&yen;{{ sku.price }}</p>
                            </td>
                            <td class="tc">
                                <p>
                                    <a
                                        class="green"
                                        @click="deleteOneInvalidSku(sku.id)"
                                        >删除</a
                                    >
                                </p>
                                <p><a href="javascript:;">找相似</a></p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="none" v-else>
                <img src="../../assets/images/none.png" alt="" />
                <span class="text">购物车是空的</span>
                <XtxButton type="primary" @click="$router.push('/')"
                    >继续逛逛</XtxButton
                >
            </div>
            <!-- 操作栏 -->
            <div class="action" v-if="store.state.cart.list.length !== 0">
                <div class="batch">
                    <XtxCheckBox
                        :modelValue="$store.getters['cart/isAllChecked']"
                        @change="
                            $store.dispatch('cart/updateAllChecked', $event)
                        "
                        >全选</XtxCheckBox
                    >
                    <a @click="deleteSelectedSku">删除商品</a>
                    <a href="javascript:;">移入收藏夹</a>
                    <a @click="deleteInvalidSku">清空失效商品</a>
                </div>
                <div class="total">
                    共 {{ $store.getters['cart/totalSkuCount'] }} 件商品，已选择
                    {{ $store.getters['cart/selectedSkuCount'] }} 件，商品合计：
                    <span class="red"
                        >¥
                        {{ $store.getters['cart/selectedSkuPrice'].toFixed(2) }}
                    </span>
                    <XtxButton type="primary" @click="goCheckout"
                        >下单结算</XtxButton
                    >
                </div>
            </div>
            <!-- 猜你喜欢 -->
            <GoodsRelevant />
        </div>
    </div>
</template>
<script setup>
import GoodsRelevant from '@/views/goods/components/GoodsRelevant.vue'
import CartSku from '@/views/cart/components/CartSku.vue'
import Message from '@/components/library/XtxMessage.js'
import Confirm from '@/components/library/XtxConfirm.js'
import { getGoodsAPI } from '@/api/goods.js'

import { useStore } from 'vuex'
import router from '@/router'
import { ref } from 'vue'

function layerClose() {
    goods.value = null
}
const store = useStore()
const goods = ref(null)
async function getSpecsAndSku(skuId) {
    // const res = await getSpecsAndSkuAPI(skuId)
    // console.log(res)
}
async function getGoods(goodsId) {
    const res = await getGoodsAPI(goodsId)

    goods.value = res.result
}
// 单个sku选择/取消选择
async function updateSkuChecked({ skuId, isCheck }) {
    store.dispatch('cart/updateSkuChecked', { skuId, isCheck })
    Message({
        type: 'success',
        text: '操作成功'
    })
}

// 删除商品

// 对于confirm函数的要求
// 1.调用这个函数的时候,会出现一个对话框,提示确认或者取消
// 2.无论确认或者取消都会关闭这个对话框
// 3.点击确认后,可以在函数中拿到用户点击确认后的结果
// 4.点击取消后,会报错

async function deleteCart(skuId) {
    try {
        await Confirm({
            title: '删除商品',
            message: '您确定要删除该商品吗？'
        })
        await store.dispatch('cart/deleteCart', skuId)
        Message({
            type: 'success',
            text: '删除成功'
        })
    } catch (e) {
        console.log(e)
    }
}
// 删除选中的商品
async function deleteSelectedSku() {
    if (store.getters['cart/selectedList'].length === 0) {
        return Message({
            type: 'error',
            text: '请选择要删除的商品'
        })
    }
    try {
        await Confirm({
            title: '删除选中的商品',
            message: '您确定要删除所有选中的商品吗？'
        })
        await store.dispatch('cart/deleteSelectedSku')
        Message({
            type: 'success',
            text: '删除成功'
        })
    } catch (e) {
        console.log(e)
    }
}
// 清空无效商品
async function deleteInvalidSku() {
    if (store.getters['cart/invalidList'].length === 0) {
        return Message({
            type: 'error',
            text: '没有无效商品'
        })
    }
    try {
        await Confirm({
            title: '清空无效商品',
            message: '您确定要清空所有无效商品吗？'
        })
        await store.dispatch('cart/deleteInvalidSku')
        Message({
            type: 'success',
            text: '已清空'
        })
    } catch (e) {
        console.log(e)
    }
}
// 下单结算
async function goCheckout() {
    // 没选择商品
    if (store.getters['cart/selectedList'].length === 0) {
        return Message({
            type: 'error',
            text: '您还没有选择商品'
        })
    }
    // 没登录
    if (!store.state.user.profile.token) {
        try {
            await Confirm({
                title: '温馨提示',
                message: '您还没有登录，请先登录'
            })
        } catch (e) {
            return
        }
    }
    router.push('/member/checkout')
}
// 删除某一个无效商品,是某一个,不是全部
async function deleteOneInvalidSku(skuId) {
    console.log(skuId)
    await store.dispatch('cart/deleteCart', skuId)
}
</script>
<style scoped lang="less">
.tc {
    text-align: center;
    .xtx-numbox {
        margin: 0 auto;
        width: 120px;
    }
}
.red {
    color: @priceColor;
}
.green {
    color: @xtxColor;
}
.f16 {
    font-size: 16px;
}
.goods {
    display: flex;
    align-items: center;
    img {
        width: 100px;
        height: 100px;
    }
    > div {
        width: 280px;
        font-size: 16px;
        padding-left: 10px;
        .attr {
            font-size: 14px;
            color: #999;
        }
    }
}
.action {
    display: flex;
    background: #fff;
    margin-top: 20px;
    height: 80px;
    align-items: center;
    font-size: 16px;
    justify-content: space-between;
    padding: 0 30px;
    .xtx-checkbox {
        color: #999;
    }
    .batch {
        a {
            margin-left: 20px;
        }
    }
    .red {
        font-size: 18px;
        margin-right: 20px;
        font-weight: bold;
    }
}
.tit {
    color: #666;
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
}
.xtx-cart-page {
    .cart {
        background: #fff;
        color: #666;
        table {
            border-spacing: 0;
            border-collapse: collapse;
            line-height: 24px;
            th,
            td {
                padding: 10px;
                border-bottom: 1px solid #f5f5f5;
                &:first-child {
                    text-align: left;
                    padding-left: 30px;
                    color: #999;
                }
            }
            th {
                font-size: 16px;
                font-weight: normal;
                line-height: 50px;
            }
        }
    }
    .none {
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 500px;
        img {
            height: 40%;
            width: 30%;
        }
        .text {
            color: #bbb;
            margin: 20px 0;
        }
    }
}
</style>
