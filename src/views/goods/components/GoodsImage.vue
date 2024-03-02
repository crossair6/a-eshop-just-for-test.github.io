<template>
    <div class="goods-image" ref="target">
        <div
            class="large"
            :style="[
                { backgroundImage: `url(${images[currIndex]})` },
                { backgroundPositionX: bigImagePosition.bigImageX + 'px' },
                { backgroundPositionY: bigImagePosition.bigImageY + 'px' }
            ]"
            v-if="isShowMaskAndBigImage"
        ></div>
        <div class="middle">
            <img :src="images[currIndex]" alt="" />
        </div>
        <ul class="small">
            <li
                v-for="(img, i) in images"
                :key="img"
                :class="{ active: i === currIndex }"
            >
                <img @mouseenter="currIndex = i" :src="img" alt="" />
            </li>
        </ul>
        <div
            class="mask"
            :style="{
                left: `${maskPosition.maskX}px`,
                top: `${maskPosition.maskY}px`
            }"
            v-if="isShowMaskAndBigImage"
        ></div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useMouseXY } from '@/hooks/index.js'
defineProps({
    images: {
        type: Array,
        default: () => []
    }
})
// 目前显示的图片索引
const currIndex = ref(0)
// 获取鼠标相对于指定target元素的位置
const { target, x, y } = useMouseXY()

// 遮罩层
const maskPosition = computed(() => {
    let maskX = 0
    let maskY = 0
    // 1.当鼠标位置小于等于100,遮罩层x不动
    if (x.value <= 100) {
        maskX = 0
        // 2.当鼠标位置在100~300之间,遮罩层x为鼠标位置-100
    } else if (x.value > 100 && x.value < 300) {
        maskX = x.value - 100
    } else {
        maskX = 200
    }
    if (y.value <= 100) {
        maskY = 0
    } else if (y.value > 100 && y.value < 300) {
        maskY = y.value - 100
    } else {
        maskY = 200
    }
    return {
        maskX,
        maskY
    }
})
// 预览大图的位置
const bigImagePosition = computed(() => {
    const bigImageX = -maskPosition.value.maskX * 2
    const bigImageY = -maskPosition.value.maskY * 2
    return {
        bigImageX,
        bigImageY
    }
})
// 是否显示遮罩层和大图
const isShowMaskAndBigImage = computed(() => {
    return x.value > 0 && x.value < 400 && y.value > 0 && y.value < 400
})
</script>
<style scoped lang="less">
img {
    width: 100%;
    height: 100%;
}
.goods-image {
    width: 480px;
    height: 400px;
    position: relative;
    display: flex;
    z-index: 500;
    .large {
        position: absolute;
        top: 0;
        left: 412px;
        width: 400px;
        height: 400px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-repeat: no-repeat;
        background-size: 800px 800px;
        background-color: #f8f8f8;
    }
    .middle {
        width: 400px;
        height: 400px;
        background: #f5f5f5;
    }
    .small {
        width: 80px;
        li {
            width: 68px;
            height: 68px;
            margin-left: 12px;
            margin-bottom: 15px;
            cursor: pointer;
            &:hover,
            &.active {
                border: 2px solid @xtxColor;
            }
        }
    }
    .mask {
        position: absolute;
        background-color: rgba(0, 255, 0, 0.2);
        width: 200px;
        height: 200px;
        cursor: grab;
    }
}
</style>
