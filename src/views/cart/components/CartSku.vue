<template>
    <div class="cart-sku">
        <div class="attrs">
            <span class="ellipsis" @click="showLayer">{{ sku.attrsText }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="layer" v-if="isLayer">
            <XtxLoading v-if="isLoading"></XtxLoading>
            <GoodsSku
                :goods="goods"
                :defaultSkuId="sku.skuId"
                v-else
                @selectedFinished="selectedFinished"
            ></GoodsSku>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import GoodsSku from '@/views/goods/components/GoodsSku.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/XtxMessage.js'
const store = useStore()
const emit = defineEmits(['getSpecsAndSku', 'getGoods', 'layerClose'])
const props = defineProps({
    goods: {
        type: Object,
        default: null
    },
    sku: {
        type: Object,
        default: null
    }
})
const isLayer = ref(false)
watch(
    () => isLayer.value,
    () => {
        if (!isLayer.value) {
            emit('layerClose')
        }
    },
    {
        deep: true
    }
)
function showLayer() {
    isLayer.value = !isLayer.value
    if (isLayer.value) {
        emit('getSpecsAndSku')
        emit('getGoods')
    }
}
const isLoading = computed(() => {
    return props.goods === null || props.sku === null
})

const selectedSkuId = ref(props.sku.skuId)
function selectedFinished(newSkuId) {
    if (newSkuId && newSkuId !== props.sku.skuId) {
        console.log(1111)
        selectedSkuId.value = newSkuId
        const selectedSku = props.goods.skus.find(
            (sku) => sku.id === selectedSkuId.value
        )
        // 库存不足时不允许选择
        if (selectedSku.inventory <= 0) {
            return Message({
                type: 'error',
                text: '库存不足'
            })
        }
        const newSku = {
            id: props.goods.id,
            name: props.goods.name,
            skuId: selectedSku.id,
            attrsText: selectedSku.specs.reduce(
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
            picture: selectedSku.picture,
            price: props.goods.price,
            nowPrice: props.goods.price,
            stock: selectedSku.inventory,
            count: props.sku.count,
            isEffective: true,
            selected: true
        }
        const payload = {
            newSku,
            oldSkuId: props.sku.skuId
        }
        store.dispatch('cart/replaceSku', payload)
    }
}
</script>
<style scoped lang="less">
.cart-sku {
    height: 28px;
    border: 1px solid #f5f5f5;
    padding: 0 6px;
    position: relative;
    margin-top: 10px;
    display: inline-block;
    .attrs {
        line-height: 24px;
        display: flex;
        span {
            max-width: 230px;
            font-size: 14px;
            color: #999;
        }
        i {
            margin-left: 5px;
            font-size: 14px;
        }
    }
    .layer {
        position: absolute;
        left: -1px;
        top: 40px;
        z-index: 10;
        width: 400px;
        border: 1px solid @xtxColor;
        box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        padding: 20px;
        &::before {
            content: '';
            width: 12px;
            height: 12px;
            border-left: 1px solid @xtxColor;
            border-top: 1px solid @xtxColor;
            position: absolute;
            left: 12px;
            top: -8px;
            background: #fff;
            transform: scale(0.8, 1) rotate(45deg);
        }
        .loading {
            height: 224px;
            background: url(../../../assets/images/loading.gif) no-repeat center;
        }
    }
}
</style>
