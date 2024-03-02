<template>
    <div class="xtx-skeleton" :class="{ shan: true }">
        <div class="block" :style="{ backgroundColor: '#ff0000' }"></div>
        <div class="move"></div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.xtx-skeleton {
    width: 400px;
    height: 400px;
    // background-color: red;
    display: inline-block;
    position: relative;
    overflow: hidden;
    .block {
        width: 100%;
        height: 100%;
    }
}
.shan {
    .move {
        width: 50%;
        height: 100%;
        position: absolute;
        top: 0;
        background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: skew(-45deg);
        animation: shan 1s ease 0s infinite;
    }
}
@keyframes shan {
    0% {
        left: -100%;
    }
    100% {
        left: 110%;
    }
}
</style>
