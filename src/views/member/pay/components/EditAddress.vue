<template>
    <div class="container">
        <ShowAddress ref="showAddressRef" @submit="submit"></ShowAddress>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ShowAddress from './ShowAddress.vue'
import { editAddressAPI } from '@/api/order'
import Message from '@/components/library/XtxMessage'
const emit = defineEmits(['submit'])
const showAddressRef = ref(null)
function open(showAddress) {
    console.log(showAddress)
    showAddressRef.value.open(showAddress)
}
async function submit(address) {
    await editAddressAPI(address)
    emit('submit', address)
    Message({
        type: 'success',
        text: '修改地址成功'
    })
    showAddressRef.value.close()
}
defineExpose({
    open
})
</script>

<style lang="less" scoped></style>
