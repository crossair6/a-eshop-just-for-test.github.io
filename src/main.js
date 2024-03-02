import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入自己写的UI组件库
import UI from '@/components/library/index.js'

// 1.引入重置样式css
import 'normalize.css'
// 2.自己项目的公用样式
import '@/assets/styles/common.less'
// 3.模拟mockjs
import '@/mock/index.js'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(UI)
app.mount('#app')
window.addEventListener('copy', (e) => {
  alert(window.getSelection().toString())
})
