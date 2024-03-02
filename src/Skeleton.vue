<template>
    <div class="skeleton shan">
        <div class="block"></div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.skeleton {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 200px;
    height: 200px;
    background-color: lightgreen;
    .block {
        width: 100%;
        height: 100%;
        border-radius: 20px;
    }
}
.shan {
    &::after {
        content: '';
        position: absolute;
        top: 0;
        animation: shan 10s ease 0s infinite;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0,
            red 10%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: skewX(-45deg);
    }
}
@keyframes shan {
    0% {
        left: -100%;
    }
    100% {
        left: 140%;
    }
}
</style>
