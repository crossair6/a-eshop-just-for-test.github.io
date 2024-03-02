import { mergeLocalCartAPI, getCartAPI, addToCartAPI, deleteCartAPI, updateSkuCheckAndCountAPI, updateAllCheckedAPI } from '@/api/cart.js'
// 购物车模块
export default {
  namespaced: true,
  state() {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表(有些商品会下架或没库存)
    validList(state) {
      return state.list.filter(sku => sku.stock > 0 && sku.isEffective === true)
    },
    // 商品总件数
    totalSkuCount(state, getters) {
      return getters.validList.reduce((accumulator, current) => {
        return accumulator + current.count
      }, 0)
    },
    // 已选择的商品总数
    selectedSkuCount(state, getter) {
      return getter.validList.reduce((accumulator, current) => {
        return accumulator + (current.selected ? current.count : 0)
      }, 0)
    },
    // 商品总金额
    totalSkuPrice(state, getters) {
      return getters.validList.reduce((accumulator, current) => {
        return accumulator + current.count * current.price
      }, 0)
    },
    // 已选择商品的总价
    selectedSkuPrice(state, getter) {
      return getter.selectedList.reduce((accumulator, current) => {
        return accumulator + current.count * current.price
      }, 0)
    },
    // 已被选择的商品列表
    selectedList(state, getters) {
      return getters.validList.filter(sku => sku.selected === true)
    },
    // 是否全选
    isAllChecked(state, getters) {
      return getters.validList.length === getters.selectedList.length
    },
    // 无效商品列表
    invalidList(state) {
      return state.list.filter(sku => sku.stock <= 0 || !sku.isEffective)
    }

  },
  mutations: {
    addToCart(state, payload) {
      // 加入购物车需要的字段必须和后端保持一致,即payload对象 的字段
      // 分别是:skuId name attrsText picture price
      // nowPrice selected stock count isEffective
      // 插入数据规则
      // 1.先找一下有没有相同商品
      // 2.有的话,查询原商品数量,把它累加到payload上,删除原商品,并保存到最新位置,
      // 3.没有的话,直接保存到最新位置
      // console.log(payload)
      const sameSkuIndex = state.list.findIndex(sku => sku.skuId === payload.skuId)
      // 说明有相同商品
      if (sameSkuIndex > -1) {
        // 累加数量
        payload.count += state.list[sameSkuIndex].count
        // 删除原商品
        state.list.splice(sameSkuIndex, 1)
      }
      // 保存到最新位置
      state.list.unshift(payload)
    },
    // 根据skuId删除购物车内对应sku
    deleteCart(state, skuId) {
      const deleteSkuIndex = state.list.findIndex(sku => sku.skuId === skuId)
      state.list.splice(deleteSkuIndex, 1)
    },
    // 全选/取消全选
    updateAllChecked(state, newCheck) {
      if (newCheck) {
        state.list.forEach(sku => {
          sku.selected = true
        })
      } else {
        state.list.forEach(sku => {
          sku.selected = false
        })
      }
    },
    // 更新单个商品的选中状态
    updateSkuChecked(state, { skuId, isCheck }) {
      const sku = state.list.find(sku => sku.skuId === skuId)
      sku.selected = isCheck
    },
    // 更新商品数量
    updateSkuCount(state, { skuId, number }) {
      const sku = state.list.find(sku => sku.skuId === skuId)
      sku.count = number
    },
    // 在购物车更换商品的规格
    replaceSku(state, payload) {
      // 更换新规格后,如果新规格和老规格相同,不做任何操作
      // 如果新规格和老规格不同,那么用新规格替换老规格
      // 如果新规格和购物车内已有规格相同,那么把已有规格的数量添加给新规格,并删除已有规格
      const oldSkuIndex = state.list.findIndex(sku => sku.skuId === payload.oldSkuId)
      if (oldSkuIndex <= -1) {
        return
      }
      state.list.splice(oldSkuIndex, 1, payload.newSku)
      const alreadyHasThisSkuIndex = state.list.findIndex(sku => sku.skuId === payload.newSku.skuId)
      if (alreadyHasThisSkuIndex <= -1) {
        return
      }
      state.list[oldSkuIndex].count += state.list[alreadyHasThisSkuIndex].count
      console.log(state.list)
      state.list.splice(alreadyHasThisSkuIndex, 1)
    },
    // 设置购物车,当payload=[]时为清空购物车
    setCart(state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 加入购物车
    async addToCart(store, payload) {
      // console.log(payload)
      if (store.rootState.user.profile.token) {
        // 登录状态
        const res = await addToCartAPI(payload)
        console.log(res)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.commit('addToCart', payload)
      }
    },
    // 删除购物车指定商品
    async deleteCart(store, skuId) {
      console.log(11111)
      if (store.rootState.user.profile.token) {
        // 登录状态
        const deleteParams = {
          ids: [skuId],
          clearAll: false,
          clearInvalid: false
        }
        const res = await deleteCartAPI(deleteParams)
        console.log(res)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.commit('deleteCart', skuId)
      }
    },
    // 全选/取消全选
    async updateAllChecked(store) {
      const newCheck = !store.getters.isAllChecked
      if (store.rootState.user.profile.token) {
        // 登录状态
        const allCheckedParams = {
          selected: newCheck,
          ids: store.state.list.map(sku => sku.skuId)
        }
        console.log(allCheckedParams)
        await updateAllCheckedAPI(allCheckedParams)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.commit('updateAllChecked', newCheck)
      }
    },
    // 更新单个商品的选中状态
    async updateSkuChecked(store, payload) {
      if (store.rootState.user.profile.token) {
        // 登录状态
        const updateSkuCheckAndCountParams = {
          skuId: payload.skuId,
          count: store.state.list.find(sku => sku.skuId === payload.skuId).count,
          selected: payload.isCheck
        }
        await updateSkuCheckAndCountAPI(updateSkuCheckAndCountParams)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.commit('updateSkuChecked', payload)
      }
    },
    // 更新商品数量
    async updateSkuCount(store, payload) {
      if (store.rootState.user.profile.token) {
        // 登录状态

        const updateSkuCheckAndCountParams = {
          skuId: payload.skuId,
          count: payload.number,
          selected: store.state.list.find(sku => sku.skuId === payload.skuId).selected
        }

        await updateSkuCheckAndCountAPI(updateSkuCheckAndCountParams)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.commit('updateSkuCount', payload)
      }
    },
    // 删除所有选中的商品
    async deleteSelectedSku(store) {
      if (store.rootState.user.profile.token) {
        // 登录状态
        const ids = store.getters.selectedList.map(sku => sku.skuId)
        const deleteParams = {
          ids,
          clearAll: false,
          clearInvalid: false
        }
        await deleteCartAPI(deleteParams)
        store.dispatch('getCart')
      } else {
        // 未登录
        store.getters.selectedList.forEach(sku => {
          store.commit('deleteCart', sku.skuId)
        })
      }
    },
    // 清空无效商品
    async deleteInvalidSku(store) {
      if (store.rootState.user.profile.token) {
        // 登录状态
      } else {
        // 未登录
        store.getters.inValidList.forEach(sku => {
          store.commit('deleteCart', sku.skuId)
        })
      }
    },
    // 在购物车更换商品的规格
    async replaceSku(store, payload) {
      if (store.rootState.user.profile.token) {
        // 登录状态
        // 1.删除旧规格
        await store.dispatch('deleteCart', payload.oldSkuId)
        // 2.增加新规格
        await store.dispatch('addToCart', payload.newSku)
        // store.dispatch('replaceSku', payload)
        // const res = await addToCartAPI(payload.newSku)
        // console.log(res)
        // store.commit('replaceSkuOnline', { newSku: res.result, oldSkuId: payload.oldSkuId })
        // 3.更新商品
        store.dispatch('getCart')
      } else {
        // 未登录

        store.commit('replaceSku', payload)
      }
    },
    // 合并本地购物车
    async mergeLocalCart(store) {
      if (store.rootState.user.profile.token) {
        const localCart = store.state.list.map((sku) => {
          return {
            skuId: sku.skuId,
            selected: sku.selected,
            count: sku.count
          }
        })
        // 合并购物车的API
        await mergeLocalCartAPI(localCart)
        // 清空本地购物车
        store.commit('setCart', [])
      }
    },
    // 获取服务器购物车数据
    async getCart(store) {
      if (store.rootState.user.profile.token) {
        const res = await getCartAPI()
        store.commit('setCart', res.result)
      }
    }
  }
}
