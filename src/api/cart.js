import request from '@/utils/request.js'

/**
 * 合并本地购物车到服务器
 * @param {Array<object>} localCart 本地购物车列表
 * @param {String} object.skuId - SKU ID
 * @param {selected} object.selected - 是否选中
 * @param {count} object.count - sku数量
 * @returns Promise
 */
export function mergeLocalCartAPI(localCart) {
    return request('/member/cart/merge', 'post', localCart)
}
/**
 * 获取服务器购物车
 * @returns Promise
 */
export function getCartAPI() {
    return request('/member/cart', 'get')
}
/**
 * 加入购物车
 * @param {string} skuId
 * @param {integer} count
 * @returns Promise
 */
export function addToCartAPI({ skuId, count }) {
    return request('/member/cart', 'post', { skuId, count })
}

export function deleteCartAPI({ ids, clearAll, clearInvalid }) {
    console.log({ ids, clearAll, clearInvalid })
    return request('/member/cart', 'delete', { ids, clearAll, clearInvalid })
}

export function updateSkuCheckAndCountAPI({ skuId, selected, count }) {
    return request(`/member/cart/${skuId}`, 'put', { selected, count })
}

export function updateAllCheckedAPI({ selected, ids }) {
    return request('/member/cart/selected', 'put', { selected, ids })
}
