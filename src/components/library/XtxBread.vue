<script>
import { h } from 'vue'
export default {
    render() {
        // 用法
        // 1.替代template标签,有render函数的sfc不需要template标签
        // 2.需要动态创建html标签,比如根据数字生成标题标签h1 h2
        // 3.返回值就是组件的内容
        // 4.h函数第一个参数,标签名字;第二个参数;标签的所有属性对象;第三个参数;子节点
        // 需求
        // 1.创建xtx-bread父容器
        // 2.获取默认插槽内容
        // 3.去除xtx-bread-item组件的<i>标签,由render函数创建
        // 4.遍历插槽中的item,得到一个动态创建的节点,最后一个item不加i标签
        // 5.把动态创建的节点渲染在xtx-bread标签中

        // 只要是选项式API,就可以使用this获取当前组件的实例
        // 通过this.$slots.default()获取的是VNode
        const items = this.$slots.default()
        const dynamicItems = []
        items.forEach((item, index) => {
            dynamicItems.push(item)
            if (index < items.length - 1) {
                dynamicItems.push(
                    h('i', { class: 'iconfont icon-angle-right' })
                )
            }
        })
        // console.log(dynamicItems)
        return h('div', { class: 'xtx-bread' }, dynamicItems)
    }
}
</script>

<style lang="less">
// 去除scoped属性,让样式作用于XtxBreadItem组件
.xtx-bread {
    display: flex;
    padding: 25px 10px;
    &-item {
        a {
            color: #666;
            transition: all 0.4s;
            &:hover {
                color: @xtxColor;
            }
        }
    }
    i {
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
        line-height: 22px;
    }
}
</style>
