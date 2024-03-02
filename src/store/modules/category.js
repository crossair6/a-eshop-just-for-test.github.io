// 商品分类模块
import { getAllcategoryAPI } from '@/api/category'
import { topCategory } from '@/api/constants.js'
export default {
    namespaced: true,
    state() {
        return {
            // 分类数据集合,依赖topCategory重新设置,保证初始化就有数据,不白屏
            category: topCategory.map(item => { return { name: item } })
        }
    },
    mutations: {
        // 修改分类的函数
        setCategory(state, payload) {
            state.category = payload
        },
        // 控制二级分类弹出层的显示和隐藏
        closeLayer(state, id) {
            const targetCategory = state.category.find(item => item.id === id)
            targetCategory.open = false
        },
        openLayer(state, id) {
            const targetCategory = state.category.find(item => item.id === id)
            targetCategory.open = true
        }

    },
    actions: {
        // 修改分类的函数
        async getCategory(store) {
            const res = await getAllcategoryAPI()
            res.result.forEach(item => {
                item.open = false
            })
            store.commit('setCategory', res.result)
        }
    }
}
