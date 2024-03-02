<template>
    <div class="home-banner">
        <XtxCarousel :sliders="sliders"></XtxCarousel>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getBannerAPI } from '@/api/home.js'
// import request from '@/utils/request'
const sliders = ref([])
// 获取首页轮播图
async function getBanner() {
    const res = await getBannerAPI()
    console.log(res)
    sliders.value = res.result
    // res.result.forEach((item, index) => {
    //     item.imgUrl =
    //         'https://static.qiantucdn.com/static/images/detail/download-1.png'
    // })
    console.log(res.result)
}
getBanner()
</script>

<style lang="less" scoped>
.text-stroke {
    font-size: 200px;
    -webkit-text-stroke: 5px red;
    -webkit-text-fill-color: green;
}
.home-banner {
    width: 1240px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 98;
}
.xtx-carousel {
    ::v-deep .carousel-btn {
        background-color: @xtxColor;
    }
    ::v-deep .carousel-btn.prev {
        left: @homeCategoryWidth+20px;
    }
    ::v-deep .carousel-indicator {
        padding-left: @homeCategoryWidth;
    }
}
</style>
