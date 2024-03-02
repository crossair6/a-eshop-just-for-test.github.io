<template>
    <XtxDialog
        :title="formData.id ? '修改' : '添加'"
        v-model="dialogVisible"
        @close="close"
    >
        <div class="address-edit">
            <div class="xtx-form">
                <div class="xtx-form-item">
                    <div class="label">收货人：</div>
                    <div class="field">
                        <input
                            v-model="formData.receiver"
                            class="input"
                            placeholder="请输入收货人"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">手机号：</div>
                    <div class="field">
                        <input
                            v-model="formData.contact"
                            class="input"
                            placeholder="请输入手机号"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地区：</div>
                    <div class="field">
                        <XtxCity
                            @changeAddress="selectedDistrict"
                            placeholder="请选择所在地区"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">详细地址：</div>
                    <div class="field">
                        <input
                            v-model="formData.address"
                            class="input"
                            placeholder="请输入详细地址"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">邮政编码：</div>
                    <div class="field">
                        <input
                            v-model="formData.postalCode"
                            class="input"
                            placeholder="请输入邮政编码"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地址标签：</div>
                    <div class="field">
                        <input
                            v-model="formData.addressTags"
                            class="input"
                            placeholder="请输入地址标签，逗号分隔"
                        />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <XtxButton type="plain" style="margin-right: 20px" @click="close"
                >取消</XtxButton
            >
            <XtxButton
                type="primary"
                style="margin-right: 20px"
                @click="confirmAddAddress"
                >确认23123</XtxButton
            >
            <XtxButton
                type="danger"
                @click="setDefaultAddress"
                v-if="formData.isDefault === 1"
                >设为默认地址</XtxButton
            >
        </template>
    </XtxDialog>
</template>
<script setup>
import { ref } from 'vue'
import { addAddressAPI, editAddressAPI } from '@/api/order.js'
import { useRouter } from 'vue-router'
import Message from '@/components/library/XtxMessage.js'
const router = useRouter()

const dialogVisible = ref(false)
// 打开函数
const open = (address) => {
    console.log(address)
    // 如果有地址id,则为修改
    if (address.id) {
        for (const key in address) {
            formData.value[key] = address[key]
        }
    }
    console.log(formData.value)

    dialogVisible.value = true
}
// 关闭函数
const close = () => {
    // 关闭弹窗
    dialogVisible.value = false
    // 初始化表单
    resetForm()
}
// 定义表单数据对象
const formData = ref({
    receiver: null,
    contact: null,
    provinceCode: null,
    cityCode: null,
    countyCode: null,
    address: null,
    postalCode: null,
    addressTags: null,
    isDefault: 1
})
// 初始化表单
function resetForm() {
    Object.keys(formData.value).forEach((key) => {
        if (key === 'isDefault') {
            formData.value[key] = 1
        } else {
            formData.value[key] = null
        }
    })
}

// 当城市组件选择好省市区后
function selectedDistrict(districtCodeAndName) {
    Object.keys(formData.value).forEach((key) => {
        if (districtCodeAndName[key]) {
            formData.value[key] = districtCodeAndName[key]
        }
    })
}
// 确认修改/添加地址按钮
async function confirmAddAddress() {
    // 修改
    if (formData.value.id) {
        try {
            await editAddressAPI(formData.value)
            router.go(0)
        } catch (e) {
            Message({
                type: 'error',
                text: e.message
            })
        }
    } else {
        try {
            console.log(formData.value)
            await addAddressAPI(formData.value)
            router.go(0)
        } catch (e) {
            Message({
                type: 'error',
                text: e.message
            })
        }
    }
}
// 设置默认地址
async function setDefaultAddress() {
    formData.value.isDefault = 0
    confirmAddAddress()
}

defineExpose({
    open,
    close
})
</script>
<style scoped lang="less">
.xtx-dialog {
    :deep(.wrapper) {
        width: 780px;
        .body {
            font-size: 14px;
        }
    }
}
.xtx-form {
    padding: 0;

    input {
        outline: none;
        &::placeholder {
            color: #ccc;
        }
    }
}
.xtx-city {
    width: 320px;
    :deep(.select) {
        height: 50px;
        line-height: 48px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;
        .placeholder {
            color: #ccc;
        }
        i {
            color: #ccc;
            font-size: 18px;
        }
        .value {
            font-size: 14px;
        }
    }
    :deep(.option) {
        top: 49px;
    }
}
</style>
