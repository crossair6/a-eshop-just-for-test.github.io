<template>
    <ul class="navs">
        <li class="home"><RouterLink to="/">首页</RouterLink></li>
        <li
            v-for="item in $store.state.category.category"
            :key="item.id"
            @mousemove="$store.commit('category/openLayer', item.id)"
            @mouseleave="$store.commit('category/closeLayer', item.id)"
        >
            <RouterLink
                :to="`/category/${item.id}`"
                @click="$store.commit('category/closeLayer', item.id)"
                >{{ item.name }}</RouterLink
            >
            <!-- 二级分类,弹出层 -->
            <div class="layer" :class="{ open: item.open }">
                <ul>
                    <li v-for="subItem in item.children" :key="subItem.id">
                        <RouterLink
                            :to="`/category/sub/${subItem.id}`"
                            @click="
                                $store.commit('category/closeLayer', item.id)
                            "
                        >
                            <img :src="subItem.picture" alt="" />
                            <p>{{ subItem.name }}</p>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script setup></script>

<style lang="less" scoped>
.navs {
    width: 820px;
    display: flex;
    justify-content: space-around;
    padding-left: 40px;
    position: relative;
    z-index: 999;
    > li {
        margin-right: 40px;
        width: 38px;
        text-align: center;
        > a {
            font-size: 16px;
            line-height: 32px;
            height: 32px;
            display: inline-block;
        }
        &:hover {
            > a {
                color: @xtxColor;
                border-bottom: 1px solid @xtxColor;
            }
            // .layer {
            //     height: 132px;
            //     opacity: 1;
            // }
        }
    }
}
// 弹出层样式
.layer {
    &.open {
        height: 132px;
        opacity: 1;
    }
    width: 1240px;
    background-color: #fff;
    position: absolute;
    left: -200px;
    top: 56px;
    height: 0;
    overflow: hidden;
    opacity: 0;
    box-shadow: 0 0 5px #ff0000;
    transition: all 0.2s 0.1s;
    ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 70px;
        align-items: center;
        height: 132px;
        li {
            width: 110px;
            text-align: center;
            img {
                width: 60px;
                height: 60px;
            }
            p {
                padding-top: 10px;
            }
            &:hover {
                p {
                    color: @xtxColor;
                }
            }
        }
    }
}
</style>
