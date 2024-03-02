<script lang="jsx">
import { ref, watch } from 'vue'
export default {
    name: 'XtxTabs',
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        }
    },
    emits: ['update:modelValue', 'clickTab'],
    setup(props) {
        const activeName = ref(props.modelValue)
        watch(
            () => props.modelValue,
            (newVal) => {
                activeName.value = newVal
            }
        )
        return { activeName }
    },
    render() {
        // 获取插槽内容
        const panels = this.$slots.default()
        const panelList = []
        // 有些tabsPanel可能是通过v-for渲染的,那么这时候需要遍历它的children
        panels.forEach((panel) => {
            if (Array.isArray(panel.children)) {
                panelList.push(...panel.children)
            } else {
                panelList.push(panel)
            }
        })
        // 只展示name与当前activeName一直的panel
        const showPanel = panelList.find(
            (panel) => panel.props.name === this.activeName
        )
        // 需要在这里组装XtxTabsPanel
        // 1.tabs组件大容器
        // 2.选项卡的导航菜单结构
        // 3.内容容器

        // 点击Tab的事件
        const clickTab = (name, index) => {
            this.activeName = name
            this.$emit('update:modelValue', name, index)
            this.$emit('clickTab', name, index)
        }
        const nav = (
            <nav>
                {panelList.map((panel, index) => {
                    return (
                        <a
                            class={{
                                active: panel.props.name === this.activeName
                            }}
                            onClick={() => {
                                clickTab(panel.props.name, index)
                            }}
                        >
                            {panel.props.label}
                        </a>
                    )
                })}
            </nav>
        )
        return (
            <div class="xtx-tabs">
                {nav}
                {showPanel}
            </div>
        )
        // return ''
    }
}
</script>

<style lang="less">
.xtx-tabs {
    background: #fff;
    // width: 100%;
    > nav {
        height: 60px;
        line-height: 60px;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        width: 100%;
        > a {
            width: 110px;
            border-right: 1px solid #f5f5f5;
            text-align: center;
            font-size: 16px;
            &.active {
                border-top: 2px solid @xtxColor;
                height: 60px;
                background: @xtxColor;
                line-height: 56px;
                color: #fff;
            }
        }
    }
}
</style>
