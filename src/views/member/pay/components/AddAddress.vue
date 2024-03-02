<template>
    <div class="container">
        <ShowAddress ref="showAddressRef" @submit="submit"></ShowAddress>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ShowAddress from './ShowAddress.vue'
import { addAddressAPI } from '@/api/order'
import Message from '@/components/library/XtxMessage'
const emit = defineEmits(['submit'])
const showAddressRef = ref(null)
function open() {
    showAddressRef.value.open({
        receiver: '',
        contact: '',
        provinceCode: '',
        cityCode: '',
        countyCode: '',
        address: '',
        postalCode: '',
        addressTags: '',
        isDefault: 1
    })
}
// Checkout.vue中的方法
// const getCheckoutInfo = inject('getCheckoutInfo')
async function submit(form) {
    try {
        const res = await addAddressAPI(form)
        console.log(res)
        Message({
            type: 'success',
            text: '新增地址成功'
        })
        showAddressRef.value.close()
        emit('submit')
    } catch (e) {
        Message({
            type: 'error',
            text: e.response.data.msg
        })
    }
}

defineExpose({
    open
})
</script>

<style lang="less" scoped></style>
