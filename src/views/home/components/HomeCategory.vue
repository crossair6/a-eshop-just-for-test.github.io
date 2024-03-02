<template>
    <div class="home-category" @mouseleave="clearLayerId">
        <ul class="menu">
            <li
                v-for="item in menuList"
                :key="item.id"
                @mouseenter="changeLayerId(item.id)"
                :class="{ active: item.id === layerId }"
            >
                <RouterLink :to="`/category/${item.id}`">{{
                    item.name
                }}</RouterLink>
                <template v-if="item.children">
                    <RouterLink
                        :to="`/category/sub/${subItem.id}`"
                        v-for="subItem in item.children"
                        :key="subItem.id"
                        >{{ subItem.name }}</RouterLink
                    >
                </template>
                <!-- 骨架 -->
                <template v-else>
                    <XtxSkeleton
                        width="60px"
                        height="18px"
                        style="margin-right: 5px"
                        bg="rgba(255,255,255,0.2)"
                    ></XtxSkeleton>
                    <XtxSkeleton
                        width="50px"
                        height="18px"
                        bg="rgba(255,255,255,0.2)"
                    ></XtxSkeleton>
                </template>
            </li>
        </ul>
        <!-- 弹层 -->
        <div class="layer" v-if="layer">
            <h4>
                {{ layer.id === 'brand' ? '品牌推荐' : '分类推荐' }}
                <small>根据您的购买或浏览记录推荐</small>
            </h4>
            <ul v-if="layer.id !== 'brand'">
                <li v-for="item in layer.goods" :key="item.id">
                    <RouterLink :to="`/goods/${item.id}`">
                        <img :src="item.picture" alt="" />
                        <div class="info">
                            <p class="name ellipsis-2">
                                {{ item.name }}
                            </p>
                            <p class="desc ellipsis">{{ item.desc }}</p>
                            <p class="price"><i>¥</i>{{ item.price }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
            <ul v-else>
                <li class="brand" v-for="item in layer.brands" :key="item.id">
                    <RouterLink to="/">
                        <img :src="item.picture" alt="" />
                        <div class="info">
                            <p class="place">
                                <i class="iconfont icon-dingwei"></i
                                >{{ item.place }}
                            </p>
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="desc ellipsis-2">{{ item.desc }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { getBrandAPI } from '@/api/home.js'
const store = useStore()

const brand = ref({
    id: 'brand',
    name: '品牌',
    children: null,
    brands: []
})
const brandChildren = {
    id: '',
    name: '品牌推荐'
}
// 获取品牌
async function getBrand() {
    const res = await getBrandAPI(6)
    console.log(res.result)
    brand.value.brands = res.result
}
getBrand()
// 所有分类的数据
const menuList = computed(() => {
    const list = store.state.category.category.map((item) => ({
        id: item.id,
        name: item.name,
        children: item.children && item.children.slice(0, 2),
        goods: item.goods
    }))
    list.push(brand.value)
    if (list[0].children) {
        list[list.length - 1].children = [brandChildren]
        list[list.length - 1].children[0].id = list[0].children[0].id
    }
    return list
})

// 右侧展示的弹层的数据
const layerId = ref(null)
const layer = computed(() => {
    return menuList.value.find((item) => item.id === layerId.value)
})
// 鼠标经过分类时,更换右侧弹层
const changeLayerId = (categoryId) => {
    layerId.value = categoryId
}
const clearLayerId = () => {
    layerId.value = null
}
</script>

<style scoped lang="less">
.home-category {
    width: @homeCategoryWidth;
    height: 500px;
    background: rgba(0, 0, 0, 0.588);
    position: relative;
    z-index: 99;
    .menu {
        li {
            padding-left: 40px;
            height: 50px;
            line-height: 50px;
            // background: rgba(0, 0, 0, 0.8);
            &:hover,
            &.active {
                background: @xtxColor;
            }
            a {
                margin-right: 4px;
                color: #fff;
                &:first-child {
                    font-size: 16px;
                }
            }
        }
    }
    .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;
        h4 {
            font-size: 20px;
            font-weight: normal;
            line-height: 80px;
            small {
                font-size: 16px;
                color: #666;
            }
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            li {
                width: 310px;
                height: 120px;
                margin-right: 15px;
                margin-bottom: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fff;
                &:nth-child(3n) {
                    margin-right: 0;
                }
                a {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    padding: 10px;
                    &:hover {
                        background: #e3f9f4;
                    }
                    img {
                        width: 95px;
                        height: 95px;
                    }
                    .info {
                        padding-left: 10px;
                        line-height: 24px;
                        width: 190px;
                        .name {
                            font-size: 16px;
                            color: #666;
                        }
                        .desc {
                            color: #999;
                        }
                        .price {
                            font-size: 22px;
                            color: @priceColor;
                            i {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
        }
    }
    &:hover {
        .layer {
            display: block;
            li.brand {
                height: 180px;
                a {
                    align-items: flex-start;
                    img {
                        width: 120px;
                        height: 160px;
                    }
                    .info {
                        p {
                            margin-top: 8px;
                        }
                        .place {
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}
// 骨架动画
.xtx-skeleton {
    animation: fade 1s linear infinite alternate;
}
@keyframes fade {
    from {
        opacity: 0.2;
    }
    to {
        opacity: 1;
    }
}
</style>
