import XtxConfirm from './XtxConfirm.vue'
import { createVNode, render } from 'vue'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

// 返回的是promise对象,点取消和确认都会销毁组件
export default ({ title, message }) => {
    // 1.导入被创建的组件
    // 2.使用createVnode创建虚拟节点
    // 3.准备一个dom容器装载组件
    // 4.使用render函数将虚拟节点渲染到容器

    return new Promise((resolve, reject) => {
        const cancelCallback = () => {
            render(null, div)
            reject(new Error('点击取消'))
        }
        const submitCallback = () => {
            render(null, div)
            resolve('点击确认')
        }
        const vnode = createVNode(XtxConfirm, { title, message, cancelCallback, submitCallback })
        render(vnode, div)
    })
}
