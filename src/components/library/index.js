// 扩展vue原有的功能:全局组件,自定义指令,挂载原型方法,过滤器(vue3已经没有全局过滤器)
// 这就是插件
// vue2.0插件写法要素:1.导出一个对象 2. 对象里有install函数,默认传入Vue构造函数
// vue3.0插件写法要素:1.导出一个对象 2. 对象里有install函数,默认传入App

// 导入默认图片
import defaultImg from '@/assets/images/R-C.gif'
// console.log(defaultImg) // base64图片
// 导入message方法
import message from './XtxMessage.js'

export default {
  install(app) {
    // 在app上进行拓展,app提供component方法, directive方法
    // 如果要挂载原型,需要使用app.config.globalProperties

    // 1. 这是原始方法
    // import XtxSkeleton from './XtxSkeleton.vue'
    // app.component('XtxSkeleton', XtxSkeleton)

    // 2.这是运用Webpack提供的require.context的先进方法

    // 这段代码的作用是在指定目录及其子目录中搜索以.vue为后缀的文件，
    // 然后将这些文件中导出的组件动态注册到Vue应用中。
    // 这使得你可以在项目中添加新的Vue组件而无需手动在代码中注册它们。

    // 这一行通过Webpack的require.context方法创建了一个上下文(context)。
    // 它允许你在指定的目录中动态地获取模块文件。
    // 第一个参数是要搜索的目录，'./' 表示当前目录。
    // 第二个参数是是否搜索子目录，true表示搜索子目录。
    // 第三个参数是匹配文件的正则表达式，
    // /\.vue$ / 表示匹配以.vue为后缀的文件。
    const requireComponent = require.context('./', true, /\.vue$/)
    // console.log(requireComponent instanceof Function)
    // 函数是可以有属性的,requireComponent.keys()
    requireComponent.keys().forEach(fileName => {
      const componentConfig = requireComponent(fileName)
      // 这一行用于获取组件对象。如果模块导出了一个默认对象（default属性），就使用它，否则直接使用导出的对象。
      const component = componentConfig.default || componentConfig
      // 这一行用于获取组件的名字,如果模块导出了一个默认对象(default属性),就使用它，否则直接使用导出的对象。
      // fileName示例 ./XtxCarousel.vue
      const componentName = componentConfig.default.__name || fileName.split('/')[1].split('.')[0]

      // componentConfig.default.__name 这是使用script setup后默认导出的对象
      app.component(componentName, component)
    })

    // 定义指令的方法
    defineDirective(app)

    // 定义全局方法
    app.config.globalProperties.$message = message
  }
}

// 定义指令的方法
function defineDirective(app) {
  // 1.图片懒加载指令 v-lazy
  // 原理:先存储图片地址,不在src上,当图片进入可视区,再将src的地址换成所存储的地址
  app.directive('lazy', {
    // el是v-lazy绑定的元素
    // v- lazy="item.picture" binding就是item.picture
    // vue2.0监听使用指令的DOM是否创建好,钩子函数是inserted
    // vue3.0的指令钩子和组件一样,也就是mounted

    mounted(el, binding) {
      console.log(111111)
      // 2. 创建一个观察对象,来观察当前使用指令的元素
      el.src = defaultImg
      console.log(el.src)
      // const observe = new IntersectionObserver(([{ isIntersecting }]) => {
      //   if (isIntersecting) {
      //     // 停止观察
      //     observe.unobserve(el)
      //     // 加载失败,给默认图
      //     el.onerror = () => {
      //       el.src = defaultImg
      //       console.log(el.src)
      //     }
      //     el.src = binding.value
      //   }
      // }, {
      //   // 交叉的比例
      //   threshold: 0
      // })
      // observe.observe(el)
    }
  })
}
