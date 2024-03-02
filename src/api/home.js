import request from '@/utils/request.js'

/**
 * 获取品牌分类数据
 * @param {number} limit
 * @returns Promise
 */
export const getBrandAPI = (limit) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取首页轮播图
 * @returns Promise
 */
export const getBannerAPI = () => {
  return request('/home/banner', 'get')
}

/**
 * 获取新鲜好物
 * @param {number} limit
 * @returns Promise
 */

export const getNewAPI = (limit) => {
  return request('/home/new', 'get', { limit })
}

/**
 * 获取人气推荐
 * @param {number} limit
 * @returns Promise
 */
export const getHotAPI = (limit) => {
  return request('/home/hot', 'get', { limit })
}

/**
 * 获取最新专题
 * @param {number} limit
 * @returns Promise
 */
export const getSpecialAPI = (limit) => {
  return request('/home/special', 'get', { limit })
}
