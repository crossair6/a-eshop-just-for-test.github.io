<template>
    <XtxDialog :title="title" v-model="dialogVisible">
        <div class="address-edit">
            <Form
                class="xtx-form"
                :validation-schema="mySchema"
                autocomplete="off"
                v-slot="{ errors }"
                ref="formRef"
            >
                <div class="xtx-form-item">
                    <div class="label">收货人：</div>
                    <div class="field">
                        <Field
                            class="input"
                            name="receiver"
                            placeholder="请输入收货人"
                            v-model.trim="formData.receiver"
                        />
                        <div class="error" v-if="errors.receiver">
                            <i class="iconfont icon-warning" />{{
                                errors.receiver
                            }}
                        </div>
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">手机号：</div>
                    <div class="field">
                        <Field
                            class="input"
                            placeholder="请输入手机号"
                            v-model.trim="formData.contact"
                            name="contact"
                        />
                        <div class="error" v-if="errors.contact">
                            <i class="iconfont icon-warning" />{{
                                errors.contact
                            }}
                        </div>
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地区：</div>
                    <div class="field">
                        <XtxCity
                            placeholder="请选择所在地区"
                            @changeAddress="getCurrentAddress"
                            :defaultAddress="formData"
                        />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">详细地址：</div>
                    <div class="field">
                        <Field
                            class="input"
                            placeholder="请输入详细地址"
                            v-model.trim="formData.address"
                            name="address"
                        />
                        <div class="error" v-if="errors.address">
                            <i class="iconfont icon-warning" />{{
                                errors.address
                            }}
                        </div>
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">邮政编码：</div>
                    <div class="field">
                        <Field
                            class="input"
                            placeholder="请输入邮政编码"
                            v-model.trim="formData.postalCode"
                            name="postalCode"
                        />
                        <div class="error" v-if="errors.postalCode">
                            <i class="iconfont icon-warning" />{{
                                errors.postalCode
                            }}
                        </div>
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地址标签：</div>
                    <div class="field">
                        <Field
                            class="input"
                            placeholder="请输入地址标签(如：家,公司,学校等)"
                            v-model.trim="formData.addressTags"
                            name="addressTags"
                        />
                        <div class="error" v-if="errors.addressTags">
                            <i class="iconfont icon-warning" />{{
                                errors.addressTags
                            }}
                        </div>
                    </div>
                </div>
            </Form>
        </div>
        <template v-slot:footer>
            <XtxButton type="gray" style="margin-right: 20px" @click="close"
                >取消</XtxButton
            >
            <XtxButton type="primary" @click="submit">确认</XtxButton>
        </template>
    </XtxDialog>
</template>
<script setup>
import { Form, Field } from 'vee-validate'
import { ref, computed } from 'vue'
import schema from '@/utils/vee-validate-schema.js'
// 校验规则对象
const mySchema = ref({
    receiver: schema.receiver,
    contact: schema.contact,
    address: schema.address,
    postalCode: schema.postalCode,
    addressTags: schema.addressTags
})
const emit = defineEmits(['submit'])
const dialogVisible = ref(false)
const title = computed(() => {
    return formData.value.id ? '编辑收货地址' : '添加收货地址'
})
// 打开函数
const open = (showAddress) => {
    dialogVisible.value = true
    formData.value = showAddress
}
function close() {
    dialogVisible.value = false
}
// 定义表单数据对象
const formData = ref({
    receiver: '',
    contact: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    address: '',
    postalCode: '1',
    addressTags: '',
    isDefault: 1
})
function submit() {
    emit('submit', formData.value)
}
defineExpose({
    open,
    close
})
function getCurrentAddress(e) {
    formData.value.provinceCode = e.provinceCode
    formData.value.cityCode = e.cityCode
    formData.value.countyCode = e.countyCode
}
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
.xtx-form {
    .xtx-form-item {
        position: relative;
        height: 80px;
        .error {
            display: flex;
            align-items: center;
            justify-content: start;
            font-size: 12px;
        }
    }
}
</style>
