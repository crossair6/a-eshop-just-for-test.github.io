<template>
    <div class="container" :style="[{ width: width }, { height: height }]">
        <img
            src="https://img.zcool.cn/community/0177aa60ac8ffe11013f47208b2584.gif"
            alt=""
        />
        <!-- <span>正在加载......</span> -->
    </div>
</template>

<script setup>
defineProps({
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '100px'
    }
})
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    img {
        height: 100%;

        aspect-ratio: none;
    }
}
</style>
