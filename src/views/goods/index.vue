<template>
    <div class="xtx-goods-page">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <XtxBreadItem
                    :to="`/category/sub/${goods?.categories[0]?.id}`"
                    >{{ goods?.categories[0]?.name }}</XtxBreadItem
                >
                <XtxBreadItem :to="`/category/sub/${goods?.categories[1]?.id}`">
                    {{ goods?.categories[1]?.name }}</XtxBreadItem
                >
                <XtxBreadItem to="/">{{ goods?.name }}</XtxBreadItem>
            </XtxBread>
            <!-- 商品信息 -->

            <!-- <Transition name="fade"> -->
            <div class="goods-info" v-if="!isLoading && goods">
                <div class="media">
                    <GoodsImage :images="images"></GoodsImage>
                    <GoodsSales></GoodsSales>
                </div>
                <div class="spec">
                    <!-- 商品名字和介绍 -->
                    <GoodsName :goods="goods"></GoodsName>
                    <!-- 商品SKU区 -->
                    <GoodsSku
                        :goods="goods"
                        @selected-finished="selectedFinished"
                        :defaultSkuId="goods?.skus[0]?.id"
                    ></GoodsSku>
                    <!-- 数量选择区 -->
                    <!-- <h1>{{ selectedSku }}</h1> -->
                    <XtxNumberBox
                        v-model="number"
                        :max="selectedSku.inventory"
                        :min="1"
                        @change="numberChange"
                    ></XtxNumberBox>
                    <!-- 加入购物车按钮 -->
                    <XtxButton size="middle" type="danger" @click="goCheck"
                        >去购物车结算</XtxButton
                    >
                    <!-- 加入购物车按钮 -->
                    <XtxButton size="middle" type="primary" @click="addToCart"
                        >加入购物车</XtxButton
                    >
                </div>
            </div>
            <div class="loading" v-else>
                <XtxLoading width="100%" height="600px"></XtxLoading>
            </div>
            <!-- </Transition> -->
            <!-- 商品推荐 -->
            <GoodsRelevant :goodsId="goods?.id" />
            <!-- 商品详情 -->
            <div class="goods-footer">
                <div class="goods-article">
                    <!-- 商品+评价 -->
                    <div class="goods-tabs">
                        <GoodsTab :goods="goods"></GoodsTab>
                    </div>
                    <!-- 注意事项 -->
                    <div class="goods-warn">
                        <GoodsWarn></GoodsWarn>
                    </div>
                </div>
                <!-- 24热榜+专题推荐 -->
                <div class="goods-aside">
                    <GoodsHot :type="1" :goodsId="goods?.id"></GoodsHot>
                    <GoodsHot :type="2" :goodsId="goods?.id"></GoodsHot>
                </div>
            </div>
        </div>
    </div>

    <!-- 购物车飞行的图标 -->
    <!-- <div
        class="fly-icon"
        :style="{ transform: `translate(-1000px,-1000px)` }"
    ></div> -->
</template>

<script setup>
import GoodsRelevant from './components/GoodsRelevant.vue'
import GoodsImage from './components/GoodsImage.vue'
import GoodsSales from './components/GoodsSales.vue'
import GoodsName from './components/GoodsName.vue'
import GoodsSku from './components/GoodsSku.vue'
import GoodsTab from './components/GoodsTab.vue'
import GoodsHot from './components/GoodsHot.vue'
import GoodsWarn from './components/GoodsWarn.vue'
import Message from '@/components/library/XtxMessage.js'
// 1.获取商品详情的,进行渲染
import { getGoodsAPI } from '@/api/goods.js'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, provide, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
console.log(store)
const route = useRoute()
const router = useRouter()
const goods = ref(null)
const images = ref(null)
const isLoading = ref(false)
// 获取商品
watch(
    () => route.params.id,
    (newVal) => {
        // 如果商品id存在
        if (newVal) {
            getGoods()
        }
    },
    {
        immediate: true
    }
)

async function getGoods() {
    isLoading.value = true
    try {
        console.log(route.params.id)
        const res = await getGoodsAPI(route.params.id)

        // 面包屑数据,数据index是一级分类为1,二级分类为0,调换一下
        const temp = res.result.categories[0]
        res.result.categories[0] = res.result.categories[1]
        res.result.categories[1] = temp
        console.log(res)
        images.value = res.result.mainPictures
        goods.value = res.result
        // 获取新商品后,将默认skuId设为'',等待GoodsSku组件传递一个默认skuId过来
        selectedSkuId.value = ''
    } catch (e) {
        console.log(e)
        if (e.response.data.code) {
            Message({
                type: 'error',
                text: '没有此商品,已为您跳转到首页'
            })
        }
        router.push('/')
    }
    isLoading.value = false
}
// sku组件规格选择完成后将对应的skuId传递过来
const selectedSkuId = ref('')
const selectedSku = computed(() => {
    if (!selectedSkuId.value) {
        return {}
    } else {
        return goods.value.skus.find((sku) => sku.id === selectedSkuId.value)
    }
})
function selectedFinished(skuId) {
    if (skuId !== '') {
        selectedSkuId.value = skuId
    }
}
// 数量选择组件绑定的数量
const number = ref(1)
console.log(number.value)
function numberChange(e) {
    // console.log(e)
}
// 加入购物车按钮
function addToCart() {
    // console.log(e)
    if (!selectedSku.value.id) {
        return Message({ type: 'error', text: '请先选择规格' })
    }
    // 加入购物车需要的字段必须和后端保持一致
    // 分别是:skuId name attrsText picture price
    // nowPrice selected stock count isEffective
    // console.log(goods.value)
    // console.log(selectedSku.value)
    // console.log(store)
    const payload = {
        id: goods.value.id,
        skuId: selectedSku.value.id,
        name: goods.value.name,
        attrsText: selectedSku.value.specs.reduce(
            (accumulator, current, index, array) => {
                if (index === array.length - 1) {
                    accumulator += `${current.name}:${current.valueName}`
                } else {
                    accumulator += `${current.name}:${current.valueName};`
                }
                return accumulator
            },
            ''
        ),
        picture: selectedSku.value.picture,
        price: goods.value.price,
        nowPrice: goods.value.price,
        stock: selectedSku.value.inventory,
        count: number.value,
        isEffective: true,
        selected: true
    }
    store.dispatch('cart/addToCart', payload)
    Message({
        type: 'success',
        text: '加入购物车成功'
    })
    // beginAnimation(e)
}
// console.log(beginAnimation)
// function beginAnimation(e) {
//     console.log(e.target)
//     const body = document.querySelector('body')
//     const flyIcon = document.createElement('div')
//     flyIcon.classList.add('fly-icon')
//     body.appendChild(flyIcon)
//     const rect = e.target.getBoundingClientRect()
//     console.log(rect)
//     const buttonCenterX = rect.left + 0.5 * rect.width
//     const buttonCenterY = rect.top + 0.5 * rect.height
//     console.log(buttonCenterX, buttonCenterY)
//     flyIcon.style.left = `${buttonCenterX - 10}px`
//     flyIcon.style.top = `${buttonCenterY - 10}px`
//     // flyIcon.style.transform = 'translate(-50%, -50%)'
//     const cart = document.querySelector('.icon-cart')
//     console.log(cart)
//     const cartRect = cart.getBoundingClientRect()
//     const cartCenterX = cartRect.left + 0.5 * cartRect.width
//     const cartCenterY = cartRect.top + 0.5 * cartRect.height
//     console.log(cartCenterX, cartCenterY)
//     // setTimeout(() => {
//     //     flyIcon.style.transform = `translate(${
//     //         cartCenterX - buttonCenterX
//     //     }px, ${cartCenterY - buttonCenterY}px)`
//     //     console.log(flyIcon.style.transform)
//     // }, 1000)

//     const x1 = 0
//     const y1 = 0
//     const x2 = cartCenterX - buttonCenterX
//     const y2 = buttonCenterY - cartCenterY
//     const x3 = x2 - 200
//     const y3 = y2 + 100
//     const y = (x) => {
//         return (
//             (((x - x1) * (x - x2)) / (x3 - x1)) * (x3 - x2) * y3 +
//             (((x - x1) * (x - x3)) / (x2 - x1)) * (x2 - x3) * y2 +
//             (((x - x2) * (x - x3)) / (x1 - x2)) * (x1 - x3) * y1
//         )
//     }
//     console.log(100, y(200))
//     // const distance = x2 - x1
//     // const count = 60
//     // const step = distance / count
//     // let x = x1
//     // const timer = setInterval(() => {
//     //     x += step
//     //     console.log(x > cartCenterX)
//     //     flyIcon.style.transform = `translate(${x}px, ${y(x)}px)`
//     //     console.log(flyIcon.style.transform)
//     //     if (x > cartCenterX) {
//     //         clearInterval(timer)
//     //     }
//     // }, 16)
// }
// 为GoodsDetail和GoodsComment注入goods.width
provide('goods', goods)
// 去购物车结算按钮
function goCheck() {
    console.log(store.getters['cart/validList'])
    if (!store.getters['cart/validList'].length) {
        return Message({
            type: 'error',
            text: '购物车内还没有商品'
        })
    }
    router.push('/cart')
}
</script>

<style lang="less" scoped>
.xtx-button {
    margin-right: 10px;
    margin-top: 20px;
}
.fly-icon {
    // display: none;
    position: absolute;
    width: 20px;
    height: 20px;
    // top: 200px;
    // left: 200px;
    background-color: red;
    border-radius: 20px;
}
.goods-info {
    min-height: 600px;
    background: #fff;
    display: flex;

    .media {
        width: 580px;
        height: 600px;
        padding: 30px 50px;
    }

    .spec {
        flex: 1;
        padding: 30px 30px 30px 0;
    }
}
.loading {
    width: 100%;
    height: 600px;
    background: #fff;
}

.goods-footer {
    display: flex;
    margin-top: 20px;

    .goods-article {
        width: 940px;
        margin-right: 20px;
    }

    .goods-aside {
        width: 280px;
        min-height: 1000px;
    }
}

.goods-tabs {
    min-height: 600px;
    background: #fff;
}

.goods-warn {
    min-height: 600px;
    background: #fff;
    margin-top: 20px;
}

// .xtx-button {
//     margin-top: 20px;
// }
</style>
