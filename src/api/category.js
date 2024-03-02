// 定义分类相关的API接口函数
import request from '@/utils/request.js'

/**
 * 获取所有分类(顶级,耳机,以及对应的商品推荐数据)
 * @returns Promise
 */
export const getAllcategoryAPI = () => {
    return request('/home/category/head', 'get')
}

/**
 * 获取顶级分类下的商品信息
 * @param {*} id 顶级分类id
 * @returns Promise
 */
export const getCategoryAPI = (id) => {
    return request('/category', 'get', { id })
}

export const getSubCategoryFilterAPI = (id) => {
    return request('/category/sub/filter', 'get', { id })
}

/**
 * 获取分类下的商品（带筛选条件）
 * @param {Object} reqParams,只有page和pageSize,没有其他如sortField之类的属性
 * @returns Promise
 */
export const getGoodsListAPI = (reqParams) => {
    return request('/category/goods/temporary', 'post', reqParams)
}
