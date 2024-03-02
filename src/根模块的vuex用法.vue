<template>
    <h1>
        <!-- 使用state数据 -->
        <p>{{ $store.state.user.profile.nickname }}</p>
        <!-- 使用getters数据 -->
        <p>{{ $store.getters['user/testGetter1'] }}</p>
        <!-- 触发mutation事件 -->
        <button @click="$store.commit('updateName')">
            updateNameMutationTemplate
        </button>
        <!-- 触发异步action事件 -->
        <button @click="$store.dispatch('updateName')">
            updateNameActionTemplate
        </button>
        <!-- 用js定义中的事件 -->
        <button @click="updateNameMutation">updateNameMutation</button>
        <button @click="updateNameAction">updateNameAction</button>
    </h1>
</template>
<script>
// import store from './store'
export default {
    name: 'App',
    setup() {
        // console.log(store)

        // state和getters
        console.log(store.getters['user/testGetter1'])
        // console.log(store.getters['user/profile'])
        // mutations和actions
        const updateNameMutation = () => {
            store.commit('updateName')
        }
        const updateNameAction = () => {
            store.dispatch('updateName')
        }
        return {
            store,
            updateNameMutation,
            updateNameAction
        }
    }
}
</script>
