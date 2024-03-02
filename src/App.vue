<template>
    <div>
        <!-- <XtxSkeleton2></XtxSkeleton2> -->
        <!-- <VUEX></VUEX> -->
        <!-- <Skeleton></Skeleton>
        <div class="test"></div>
        <XtxButton type="primary" size="large" @click="changeColor"
            >點擊換膚</XtxButton
        > -->
        <RouterView />
    </div>
</template>

<script setup>
// import VUEX from './根模块的vuex用法.vue'
import { useStore } from 'vuex'
import { getMemberProfileAPI } from './api/member'
// import { ref } from 'vue'
// import Skeleton from './Skeleton.vue'
const store = useStore()
store.dispatch('cart/getCart')
if (store.state.user.profile.token) {
    getMemberProfileAPI().then((res) => {
        store.commit('user/setUser', res.result)
    })
}
</script>

<style lang="less" scoped>
div {
    width: 100%;
}
// .test {
//     width: 100px;
//     height: 100px;
//     background-color: v-bind(color);
// }
</style>
