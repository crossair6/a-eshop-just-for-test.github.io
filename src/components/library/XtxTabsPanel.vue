<template>
    <div class="xtx-tabs-panel">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'XtxTabsPanel',
    // label选项卡文字,name选项卡唯一标识 $slot.default()默认插槽内容
    props: {
        label: {
            type: [String, Number],
            default: ''
        },
        name: {
            type: [String, Number],
            default: ''
        }
    },
    setup() {}
}
</script>
<style scoped lang="less"></style>
