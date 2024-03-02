<template>
    <div class="goods-tabs">
        <nav>
            <a
                :class="{ active: currentComponent === 'GoodsDetail' }"
                href="javascript:;"
                @click="clickTab('GoodsDetail')"
                >商品详情</a
            >
            <a
                :class="{ active: currentComponent === 'GoodsComment' }"
                href="javascript:;"
                @click="clickTab('GoodsComment')"
                >商品评价<span>({{ goods?.salesCount }})</span></a
            >
        </nav>
        <!-- 这个位置显示对应的组件 GoodsDetail 或者 GoodsComment -->
        <component :is="allComponent[currentComponent]" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import GoodsDetail from './GoodsDetail.vue'
import GoodsComment from './GoodsComment.vue'
defineProps({
    goods: {
        type: Object,
        default: () => {}
    }
})
const allComponent = {
    GoodsDetail,
    GoodsComment
}
const currentComponent = ref('GoodsComment')
function clickTab(currentComponentStr) {
    currentComponent.value = currentComponentStr
}
</script>
<style lang="less" scoped>
.goods-tabs {
    min-height: 600px;
    background: #fff;
    nav {
        height: 70px;
        line-height: 70px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        a {
            padding: 0 40px;
            font-size: 18px;
            position: relative;
            > span {
                color: @priceColor;
                font-size: 16px;
                margin-left: 10px;
            }
            &:first-child {
                border-right: 1px solid #f5f5f5;
            }
            &.active {
                &::before {
                    content: '';
                    position: absolute;
                    left: 40px;
                    bottom: -1px;
                    width: 72px;
                    height: 2px;
                    background: @xtxColor;
                }
            }
        }
    }
}
</style>
