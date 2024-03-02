<template>
    <div class="xtx-bread-item">
        <RouterLink v-if="to" :to="to"><slot></slot></RouterLink>
        <span v-else><slot></slot></span>
    </div>
</template>
<script setup>
defineProps({
    to: {
        type: [String, Object],
        default: ''
    }
})
</script>
<style></style>
