<template>
    <div class="detail-step">
        <!-- 已取消的订单只显示第一步 -->
        <XtxSteps
            :activeIndex="order.orderState === 6 ? 0 : order.orderState - 1"
            >
            <XtxStepsItem title="提交订单" :desc="order.createTime" />
            <XtxStepsItem title="付款成功" :desc="order.payTime" />
            <XtxStepsItem title="商品发货" :desc="order.consignTime" />
            <XtxStepsItem title="确认收货" :desc="order.evaluationTime" />
            <XtxStepsItem title="订单完成" :desc="order.endTime" />
        </XtxSteps>
    </div>
</template>

<script setup>
defineProps({
    order: {
        type: Object,
        default: () => {}
    }
})
</script>

<style lang="less" scoped></style>
