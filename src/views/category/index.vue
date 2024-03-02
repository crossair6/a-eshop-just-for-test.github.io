<template>
    <div class="top-category">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <Transition name="fade-right" mode="out-in" appear>
                    <XtxBreadItem :key="category.id" v-if="category">{{
                        category.name
                    }}</XtxBreadItem>
                </Transition>
            </XtxBread>
            <!-- 轮播图 -->
            <XtxCarousel :sliders="sliders" style="height: 500px" />
            <!-- 所有二级分类 -->
            <div class="sub-list">
                <h3>全部分类</h3>
                <ul v-if="category && category.children">
                    <li v-for="item in category.children" :key="item.id">
                        <a href="javascript:;">
                            <img :src="item.picture" />
                            <p>{{ item.name }}</p>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 分类关联商品 -->
            <div
                class="ref-goods"
                v-for="subCategory in categoryInfo"
                :key="subCategory.id"
            >
                <div class="head">
                    <h3>- {{ subCategory.name }} -</h3>
                    <p class="tag">温暖柔软，品质之选</p>
                    <XtxMore />
                </div>
                <div class="body">
                    <GoodsItem
                        v-for="goods in subCategory.goods"
                        :key="goods.id"
                        :goods="goods"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { getBannerAPI } from '@/api/home.js'
import { getCategoryAPI } from '@/api/category.js'
import GoodsItem from './components/GoodsItem.vue'
// 轮播图
const sliders = ref([])
getBannerAPI().then((data) => {
    sliders.value = data.result
})
// 面包屑+所有子分类 vuex 顶级分类category
const store = useStore()
const route = useRoute()
const category = computed(() => {
    return store.state.category.category.find(
        (item) => item.id === route.params.id
    )
})
// 顶级分类下的所有商品信息
const categoryInfo = ref(null)
async function getCategory() {
    const res = await getCategoryAPI(route.params.id)
    console.log(res)
    categoryInfo.value = res.result.children
}

watch(
    () => route.params.id,
    // 执行顺序1
    (newVal) => {
        console.log(newVal + '发送请求')
        // 路由变化了&&路由id是顶级分类
        if (newVal && `/category/${newVal}` === route.path) {
            getCategory()
        }
    },
    {
        immediate: true
    }
)
</script>
<style scoped lang="less">
.top-category {
    h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
    }
    .sub-list {
        margin-top: 20px;
        background-color: #fff;
        ul {
            display: flex;
            padding: 0 32px;
            flex-wrap: wrap;
            li {
                width: 168px;
                height: 160px;
                a {
                    text-align: center;
                    display: block;
                    font-size: 16px;
                    img {
                        width: 100px;
                        height: 100px;
                    }
                    p {
                        line-height: 40px;
                    }
                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
}

// 不同分类商品
.ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
        .xtx-more {
            position: absolute;
            top: 20px;
            right: 20px;
        }
        .tag {
            text-align: center;
            color: #999;
            font-size: 20px;
            position: relative;
            top: -20px;
        }
    }
    .body {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 65px 30px;
    }
}
</style>
