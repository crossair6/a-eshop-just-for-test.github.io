<template>
    <div class="home-new">
        <HomePanel title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
            <template #right><XtxMore path="/" /></template>
            <!-- 面板内容 -->
            <div style="position: relative; height: 426px" ref="target">
                <Transition name="fade">
                    <ul class="goods-list" v-if="goods">
                        <li v-for="item in goods" :key="item.id">
                            <RouterLink :to="`/goods/${item.id}`">
                                <img :src="item.picture" alt="" />
                                <p class="name ellipsis">{{ item.name }}</p>
                                <p class="price">&yen;{{ item.price }}</p>
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
import HomeSkeleton from './HomeSkeleton.vue'
import { getNewAPI } from '@/api/home.js'
import { useLazyData } from '@/hooks/index.js'

// 1.不用数据懒加载的原始做法
// async function getNew() {
//     const res = await getNewAPI(4)
//     console.log(res)
//     goods.value = res.result
// }
// getNew()

// 2.使用数据懒加载

const { target, data: goods } = useLazyData(getNewAPI, 4)
</script>
<style scoped lang="less">
.goods-list {
    display: flex;
    justify-content: space-between;
    height: 406px;
    li {
        width: 306px;
        height: 406px;
        background: #f0f9f4;
        .hoverShadow();
        img {
            width: 306px;
            height: 306px;
        }
        p {
            font-size: 22px;
            padding: 12px 30px 0 30px;
            text-align: center;
        }
        .price {
            color: @priceColor;
        }
    }
}
</style>
