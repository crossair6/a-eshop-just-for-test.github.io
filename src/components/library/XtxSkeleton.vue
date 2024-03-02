<template>
    <div
        class="xtx-skeleton"
        :style="{ width, height }"
        :class="{ shan: animated }"
    >
        <!-- 1 盒子-->
        <div class="block" :style="{ backgroundColor: bg }"></div>
        <!-- 2 闪效果 xtx-skeleton 伪元素 --->
    </div>
</template>
<script setup>
// 使用的时候需要动态设置 高度，宽度，背景颜色，是否闪下
defineProps({
    bg: {
        type: String,
        default: '#efefef'
    },
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '100px'
    },
    animated: {
        type: Boolean,
        default: false
    }
})
</script>
<style scoped lang="less">
.xtx-skeleton {
    // 将组件显示为内联块元素，使其可以和其他元素在同一行显示。
    display: inline-block;
    // 设置容器相对定位，用于定位后面的闪烁效果元素。
    position: relative;
    // 隐藏容器内容超出部分，避免显示溢出。
    overflow: hidden;
    // 在行内元素中垂直居中对齐。
    vertical-align: middle;
    .block {
        // 设置盒子的宽度占满父容器
        width: 100%;
        // 设置盒子的高度占满父容器。
        height: 100%;
        // 设置盒子的圆角边框为2像素。
        border-radius: 2px;
    }
}
// 是闪烁效果的伪元素类，用来实现闪烁效果。其中包括：
.shan {
    // 使用伪元素::after来实现闪烁效果的展示，表示在.shan类元素"内部"后面插入一个生成的内容。
    &::after {
        // 设置伪元素的内容为空。
        content: '';
        // 将伪元素绝对定位，相对于父容器进行定位。
        position: absolute;
        // 设置闪烁动画的相关属性。shan是一个定义在后续的@keyframes中的动画名称
        // 动画时间为0.5秒，动画的过渡方式为ease，开始时间为0秒，动画无限循环。
        animation: shan 1s ease 0s infinite;
        // 设置伪元素的顶部位置为父容器的顶部。
        top: 0;
        //  设置伪元素的宽度为父容器的一半。
        width: 50%;
        // 设置伪元素的高度为父容器的高度。
        height: 100%;
        // 设置闪烁部分的背景颜色为线性渐变。从左到右渐变的过程中，
        // 颜色由透明度为0的白色变化到透明度为0.3的白色，再变化到透明度为0的白色。
        background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        // background:white;
        // 对伪元素进行X轴方向上的倾斜，角度为-45度。
        transform: skewX(-45deg);
    }
}
// 是定义闪烁动画的关键帧。实现了从左侧逐渐移出到右侧的动态效果。其中包括：
@keyframes shan {
    // 表示动画开始时的状态。
    0% {
        // 设置动画元素的左侧位置为容器的左侧外部。
        left: -100%;
    }
    //  表示动画结束时的状态。
    100% {
        // 设置动画元素的左侧位置为容器的右侧外部。
        left: 120%;
    }
}
</style>
