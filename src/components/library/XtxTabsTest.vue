<script lang="jsx">
export default {
    name: 'XtxTabsTest',
    render() {
        // 返回的内容会进行渲染
        // return 'tabs'
        // return '<h1>tabs</h1>' 这个会被渲染成字符串
        // 1.在babel的帮助下,可以在vue中写jsx语法
        // 2.数据的使用 {}单花括号

        const name = 'tom'
        const title = 'active'
        // 3.事件如何绑定
        const handleClick = () => {
            console.log('被点击了')
        }
        // 4.定义一个jsx对象
        const sub = <sub>123</sub>
        const h3List = [<h3>h3</h3>, <h3>h3</h3>]
        return (
            <h1 title={title} onclick={handleClick}>
                {name}
                <h2>{title}</h2>
                {sub}
                {h3List}
            </h1>
        )
    }
}
</script>

<style lang="less" scoped></style>
