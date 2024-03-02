<template>
    <button @click="test">测试</button>
    <div class="container" ref="testRef"></div>
</template>

<script setup>
import { ref } from 'vue'
const testRef = ref(null)
function test() {
    testRef.value.style.transform = 'translate(0, 0)'
    setTimeout(() => {
        testRef.value = null
    }, 2000)
}
</script>

<style lang="less" scoped>
.container {
    width: 300px;
    height: 300px;
    background-color: red;
    transform: translate(0, -600px);
    transition: all 0.6s ease;
    z-index: 9999;
    &:hover {
        opacity: 0;
    }
}
</style>
