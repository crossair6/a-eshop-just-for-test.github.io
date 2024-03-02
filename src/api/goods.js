// 提供商品详情相关的API函数
import request from '@/utils/request.js'

/**
 * 获取商品数据
 * @param {String} id 商品id
 * @returns Promise
 */
export const getGoodsAPI = (id) => {
    return request('/goods', 'get', { id })
}
/**
 * 获取同类推荐,如果不传id就是猜你喜欢
 * @param {String} id
 * @param {Number} limit
 * @returns Promise
 */
export const getRelevantGoodsAPI = (id, limit = 16) => {
    return request('/goods/relevant', 'get', { id, limit })
}
/**
 * 获取热销推荐
 * @param {String} id 商品id
 * @param {Number} limit 数量限制
 * @param {Number} type 热销类型，1为24小时，2为周榜，3为总榜，默认为1
 * @returns Promise
 */
export const getHotGoodsAPI = (id, limit = 4, type) => {
    return request('/goods/hot', 'get', { id, limit, type })
}
/**
 * 获取商品的评价信息
 * @param {String} id 商品id，即spu id
 * @returns Promise
 */
export const getGoodsCommentAPI = (id, reqParams) => {
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get', reqParams)
}
/**
 * 获取商品的评价列表
 * @param {String} id 商品id，即spu id
 * @returns Promise
 */
export const getGoodsCommentListAPI = (id, reqParams) => {
    return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', reqParams)
}

export const getSpecsAndSkuAPI = (skuId) => {
    return request(`/goods/sku/${skuId}`, 'get')
}
