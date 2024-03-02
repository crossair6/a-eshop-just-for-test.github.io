import request from '@/utils/request.js'

/**
 * 用户名密码登录
 * @param {String} account 用户名
 * @param {String} password 密码
 * @returns Promise
 */
export function accountLoginAPI({ account, password }) {
  return request('/login', 'post', { account, password })
}

/**
 * 用短信验证码登录
 * @param {String} mobile
 * @param {String} code
 * @returns
 */
export function mobileLoginAPI({ mobile, code }) {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * 获取登录短信验证码
 * @param {String} mobile
 * @returns
 */
export function getMobileCodeAPI(mobile) {
  return request('/login/code', 'get', { mobile })
}

/**
 * 从小程序那里扒出来的手机号模拟登录
 * @param {String} mobile 手机号
 * @returns
 */

export function WXSimulateLoginAPI(mobile) {
  return request('/login/wxMin/simple', 'post', { phoneNumber: mobile })
}
