// 创建axios实例
// 请求拦截器 token
// 响应拦截器 剥离无效数据 处理token失效
// 导出实例

import axios from 'axios'
import store from '../store/index.js'
import router from '../router/index.js'

export let cancel
// 可能会通过非axios的方式发请求,
// 视频里的baseURL 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 5000
})
export {
  instance
}

// 请求拦截器
instance.interceptors.request.use((config) => {
  // 拦截的业务逻辑
  // 进行请求配置的修改
  // 如果本地有token就在头部携带
  const profile = store.state.user.profile
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use((response) => {
  // 剥离外层包装的data
  return response.data
}, (err) => {
  // 401状态码,进入该函数
  if (err.response && err.response.status === 401) {
    // 1.清空无效用户信息
    // 2.跳转到登录页面
    // 3.跳转需要传参(当前路由地址),给登录页码,方便登录后返回
    store.commit('user/setUser', {})
    // 当前路由地址
    // 1.组件里$route.fullpath
    // 2.js里router.currentRoute.value.fullPath
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  // console.log(err)
  return Promise.reject(err)
})

// 请求工具函数
const request = (url, method, submitData) => {
  const methodName = method.toUpperCase()
  const dataType = methodName === 'GET' ? 'params' : 'data'
  return instance({
    url,
    method,
    // 1.如果是get请求,需要使用params来传递submitData
    // 2.如果不是get请求,需要使用data来传递submitData
    [dataType]: submitData
  })
}

export default request
