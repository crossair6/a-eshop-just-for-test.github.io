<template>
    <div class="home-hot">
        <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
            <template #right>
                <XtxMore path="/"></XtxMore>
            </template>
            <div style="position: relative; height: 426px" ref="target">
                <Transition name="fade">
                    <ul ref="pannel" class="goods-list" v-if="goods">
                        <li v-for="item in goods" :key="item.id">
                            <RouterLink to="/">
                                <img alt="" :src="item.picture" />
                                <p class="name">{{ item.title }}</p>
                                <p class="desc">{{ item.alt }}</p>
                            </RouterLink>
                        </li>
                    </ul>
                    <HomeSkeleton v-else></HomeSkeleton>
                </Transition>
            </div>
        </HomePanel>
    </div>
</template>

<script setup>
import HomePanel from './HomePanel.vue'
import { onMounted } from 'vue'
import HomeSkeleton from './HomeSkeleton.vue'
import { getHotAPI } from '@/api/home.js'
import { useLazyData } from '@/hooks/index.js'
onMounted(() => {
    console.log('onMounted')
})
// 1.获取人气推荐 不用数据懒加载的原始做法
// async function getHot() {
//     const res = await getHotAPI(4)
//     goods.value = res.result
// }
// getHot()

// 2.使用数据懒加载

const { target, data: goods } = useLazyData(getHotAPI, 4)
</script>

<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 426px;
    li {
        width: 306px;
        height: 406px;
        .hoverShadow();
        img {
            width: 306px;
            height: 306px;
        }
        p {
            font-size: 22px;
            padding-top: 12px;
            text-align: center;
        }
        .desc {
            color: #999;
            font-size: 18px;
        }
    }
}
</style>
