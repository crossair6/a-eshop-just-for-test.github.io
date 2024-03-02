// 提供一个能够显示XtxMessage组件的函数
// 这个函数将来可以导入直接使用,也可以挂载在vue实例原型上

import XtxMessage from './XtxMessage.vue'
import { createVNode, render } from 'vue'

// 3.创建容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
// 定时器标识
let timer = null
function message(messageProps) {
  // 如果此次调用之前,上一次调用还未结束,那就销毁上一次调用
  render(null, div)
  // 渲染组件
  // 1.导入消息提示组件
  // 2.将消息提示组件编译成虚拟节点
  // createVNode(component,props)
  const vnode = createVNode(XtxMessage, messageProps)
  // 3.准备一个装载消息提示组件的容器,在函数外面创建,避免每次使用message组件都创建一次

  // 4.将虚拟节点渲染在容器中
  // render(vnode,container)
  render(vnode, div)
  // 5. 3秒后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}

export default message
