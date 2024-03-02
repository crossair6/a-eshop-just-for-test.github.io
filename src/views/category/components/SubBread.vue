<template>
    <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem
            v-if="category && category.top"
            :to="`/category/${category.top.id}`"
            >{{ category.top.name }}</XtxBreadItem
        >
        <Transition name="fade-right" mode="out-in" appear>
            <XtxBreadItem
                v-if="category && category.sub"
                :to="`/category/sub/${category.sub.id}`"
                :key="category.sub.id"
                >{{ category.sub.name }}</XtxBreadItem
            >
        </Transition>
    </XtxBread>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
// category为一级分类和二级分类的联合数据,给面包屑用
const category = computed(() => {
    // const cate = {}
    // console.log(store.state.category.category, route)
    // store.state.category.category.forEach((topCategory) => {
    //     // 根据二级分类id和route id相等找到
    //     if (topCategory.children) {
    //         console.log(topCategory.children)
    //         const subCategory = topCategory.children.find((subCategory) => {
    //             return subCategory.id === route.params.id
    //         })
    //         // console.log(subCategory)
    //         if (subCategory) {
    //             cate.topCategory = {
    //                 id: topCategory.id,
    //                 name: topCategory.name
    //             }
    //             cate.subCategory = {
    //                 id: subCategory.id,
    //                 name: subCategory.name
    //             }
    //         }
    //     }
    // })
    const cate = {}
    store.state.category.category.find((topCategory) => {
        let sub = {}
        if (topCategory.children) {
            sub = topCategory.children.find((subCategory) => {
                return subCategory.id === route.params.id
            })
            if (sub) {
                cate.top = topCategory
                cate.sub = sub
            }
        }
        return sub
    })
    console.log(cate)
    return cate
})

</script>

<style lang="less" scoped></style>
