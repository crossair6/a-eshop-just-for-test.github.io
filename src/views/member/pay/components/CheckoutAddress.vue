<template>
    <div class="checkout-address">
        <div class="text">
            <div class="none" v-if="addressList.length === 0">
                您需要先添加收货地址才可提交订单。
            </div>
            <ul v-else>
                <li>
                    <span>收<i />货<i />人：</span>{{ showAddress?.receiver }}
                </li>
                <li><span>联系方式：</span>{{ contact }}</li>
                <li>
                    <span>收货地址：</span
                    >{{ showAddress?.fullLocation + showAddress?.address }}
                </li>
            </ul>
            <!-- <a @click="openAddressForm(showAddress)">修改地址</a> -->
            <a @click="editAddress">修改地址</a>
        </div>
        <div class="action">
            <XtxButton class="btn" @click="switchAddress">切换地址</XtxButton>
            <!-- <XtxButton class="btn" @click="openAddressForm({})"
                >添加地址</XtxButton
            > -->
            <XtxButton class="btn" @click="addAddress">添加地址</XtxButton>
        </div>
    </div>
    <!-- 切换收货地址 -->
    <XtxDialog title="切换收货地址" v-model="showAddressListDialog">
        <template #default
            ><div
                class="text item"
                v-for="item in addressList"
                :key="item?.id"
                :class="{ active: activeAddressId === item?.id }"
                @click="clickAddress(item.id)"
            >
                <ul>
                    <li>
                        <span>收<i />货<i />人：</span>{{ item?.receiver }}
                        <span
                            v-if="item?.isDefault === 0"
                            class="default-address"
                            >(默认地址)</span
                        >
                    </li>
                    <li><span>联系方式：</span>{{ item?.contact }}</li>
                    <li>
                        <span>收货地址：</span
                        >{{ item?.fullLocation + item?.address }}
                    </li>
                </ul>
            </div></template
        >
        <template #footer>
            <XtxButton
                type="plain"
                style="margin-right: 20px"
                @click="cancelSwitchAddress"
                >取消</XtxButton
            >
            <XtxButton type="primary" @click="confirmSwitchAddress"
                >确认</XtxButton
            >
        </template>
    </XtxDialog>
    <!-- 添加收货地址 -->
    <!-- <AddressForm ref="addressFormRef"></AddressForm> -->
    <!-- 修改地址 -->
    <EditAddress ref="editAddressRef" @submit="submit"></EditAddress>
    <!-- 添加地址 -->
    <AddAddress ref="addAddressRef"></AddAddress>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
// import AddressForm from './AddressForm.vue'
import EditAddress from './EditAddress.vue'
import AddAddress from './AddAddress.vue'
import Message from '@/components/library/XtxMessage'
const emit = defineEmits(['changeAddress', 'submit'])
const props = defineProps({
    addressList: {
        type: Array,
        default: () => []
    }
})
function submit(e) {
    console.log(e)
    emit('submit', e)
}

// 在地址列表界面,点击确认后选择的地址id,初始是默认地址的id
console.log(props.addressList)
const selectedAddressId = ref(
    props.addressList.find((address) => address.isDefault === 0)?.id
)
// 展示在界面的address
const showAddress = computed(() => {
    // 1.被选择的address
    // 2.被设为默认的address
    // 3.第一个address
    return (
        props.addressList.find(
            (address) => address.id === selectedAddressId.value
        ) ||
        props.addressList.find((address) => address.isDefault === 0) ||
        props.addressList[0]
    )
})
watch(
    showAddress,
    () => {
        if (showAddress.value?.id) {
            emit('changeAddress', showAddress.value)
        }
    },
    {
        immediate: true
    }
)
// 在地址列表界面,被点击激活的addressId
const activeAddressId = ref(selectedAddressId.value)

// 给展示的电话号码中间加上星号
const contact = computed(() => {
    return (
        showAddress.value.contact.slice(0, 3) +
        '****' +
        showAddress.value.contact.slice(7, 11)
    )
})
// 控制地址列表对话框的显示和隐藏
const showAddressListDialog = ref(false)
// 点击切换地址按钮
function switchAddress() {
    if (!props.addressList.length) {
        return Message({
            type: 'error',
            text: '请先添加地址'
        })
    }
    showAddressListDialog.value = true
}
// 在地址列表里面,点击其中一个地址
function clickAddress(nowAddressId) {
    activeAddressId.value = nowAddressId
}
// 在地址列表界面,点击确认按钮
function confirmSwitchAddress() {
    selectedAddressId.value = activeAddressId.value

    showAddressListDialog.value = false
}
// 在地址列表界面,点击取消按钮
function cancelSwitchAddress() {
    activeAddressId.value = selectedAddressId.value
    showAddressListDialog.value = false
}

// 切换地址,调用组件内的open方法
const editAddressRef = ref(null)
function editAddress() {
    if (!showAddress.value?.id) {
        return Message({
            type: 'error',
            text: '请先添加地址'
        })
    }
    const form = {}
    for (const key in showAddress.value) {
        if (!form[key]) {
            form[key] = showAddress.value[key]
        }
    }
    editAddressRef.value.open(form)
}
// 添加地址,调用组件内的open方法
const addAddressRef = ref(null)
function addAddress() {
    addAddressRef.value.open()
}
</script>
<style scoped lang="less">
.default-address {
    color: red;
}
.xtx-dialog {
    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        &.item {
            border: 1px solid #f5f5f5;
            margin-bottom: 10px;
            cursor: pointer;

            &.active,
            &:hover {
                border-color: @xtxColor;
                background: lighten(@xtxColor, 50%);
            }

            > ul {
                padding: 10px;
                font-size: 14px;
                line-height: 30px;
            }
        }
    }
}

.checkout-address {
    border: 1px solid #f5f5f5;
    display: flex;
    align-items: center;

    .text {
        flex: 1;
        min-height: 90px;
        display: flex;
        align-items: center;

        .none {
            line-height: 90px;
            color: #999;
            text-align: center;
            width: 100%;
        }

        > ul {
            flex: 1;
            padding: 20px;

            li {
                line-height: 30px;

                span {
                    color: #999;
                    margin-right: 5px;

                    > i {
                        width: 0.5em;
                        display: inline-block;
                    }
                }
            }
        }

        > a {
            color: @xtxColor;
            width: 160px;
            text-align: center;
            height: 90px;
            line-height: 90px;
            border-right: 1px solid #f5f5f5;
        }
    }

    .action {
        width: 420px;
        text-align: center;

        .btn {
            width: 140px;
            height: 46px;
            line-height: 44px;
            font-size: 14px;
            background-color: #eee;

            &:first-child {
                margin-right: 10px;
            }
        }
    }
}

h3 {
    margin-bottom: 20px;
}
</style>
