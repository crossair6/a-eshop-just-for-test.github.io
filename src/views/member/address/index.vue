<template>
    <div class="address-container">
        <XtxButton type="primary" @click="addAddress">添加地址</XtxButton>
        <div class="address-item" v-for="item in addressList" :key="item.id">
            <div class="left">
                <div class="address-tags">
                    {{
                        item.addressTags ||
                        `${item.receiver}  ${item.fullLocation}`
                    }}
                </div>
                <div class="detail">
                    <div class="line">
                        <span class="title">
                            <span class="word">收件人</span>
                            <span class="colon">:</span>
                        </span>
                        <span class="content">{{ item.receiver }}</span>
                        <span class="default" v-if="item.isDefault === 0"
                            >(默认)</span
                        >
                    </div>
                    <div class="line">
                        <span class="title">
                            <span class="word">联系方式</span>
                            <span class="colon">:</span>
                        </span>
                        <span class="content">{{ item.contactMasked }}</span>
                    </div>
                    <div class="line">
                        <span class="title">
                            <span class="word">详细住址</span>
                            <span class="colon">:</span>
                        </span>
                        <span class="content"
                            >{{ item.fullLocation }} {{ item.address }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="delete" @click="deleteAddress(item)">
                    <img
                        src="https://misc.360buyimg.com/user/myjd-2015/css/i/close.png"
                        alt=""
                    />
                </div>
                <div class="operations">
                    <span
                        class="button"
                        v-if="item.isDefault === 1"
                        @click="setAsDefaultAddress(item)"
                        >设为默认地址</span
                    >
                    <span class="button" @click="editAddress(item)"
                        >编辑地址</span
                    >
                </div>
            </div>
        </div>
    </div>

    <!-- 修改地址 -->
    <EditAddress ref="editAddressRef" @submit="getMemberAddress"></EditAddress>
    <!-- 修改地址 -->
    <AddAddress ref="addAddressRef" @submit="getMemberAddress"></AddAddress>
</template>

<script setup>
import { getMemberAddressAPI, deleteMemberAddressAPI } from '@/api/member'
import { ref } from 'vue'
import EditAddress from '@/views/member/pay/components/EditAddress.vue'
import AddAddress from '@/views/member/pay/components/AddAddress.vue'
import { editAddressAPI } from '@/api/order'
import Message from '@/components/library/XtxMessage'
import Confirm from '@/components/library/XtxConfirm'
import { useEditAddress, useAddAddress } from '@/hooks'
const addressList = ref(null)
// 获取地址列表
async function getMemberAddress(e) {
    const res = await getMemberAddressAPI()
    res.result.forEach((item) => {
        item.contactMasked =
            item.contact.slice(0, 3) + '****' + item.contact.slice(7, 11)
    })
    addressList.value = res.result
}
getMemberAddress()

// 编辑地址
const { editAddressRef, editAddress } = useEditAddress()
// 添加地址
const { addAddressRef, addAddress } = useAddAddress()

// 设置为默认地址
async function setAsDefaultAddress(address) {
    try {
        const form = {}
        for (const key in address) {
            if (!form[key]) {
                form[key] = address[key]
            }
        }
        form.isDefault = 0
        await editAddressAPI(form)
        // 前端显示
        addressList.value.forEach((item) => {
            item.isDefault = 1
        })
        address.isDefault = 0
        console.log(address)
        // getMemberAddress()
        Message({
            type: 'success',
            text: '设置成功!'
        })
    } catch (e) {
        Message({
            type: 'error',
            text: e.response.data.msg
        })
    }
}
// 删除地址
async function deleteAddress(item) {
    try {
        await Confirm({ title: '删除地址' })
        await deleteMemberAddressAPI(item.id)
        getMemberAddress()
        Message({
            type: 'success',
            text: '删除地址成功'
        })
    } catch (e) {
        console.log(e)
    }
}
</script>

<style lang="less" scoped>
.address-container {
    background-color: #fff;
    padding: 20px;
    height: 100%;
    .address-item {
        position: relative;
        border: 1px solid @xtxColor;

        margin-top: 20px;
        height: 160px;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        .left {
            padding: 20px;
            .address-tags {
                font-size: 20px;
                font-weight: 700;
                color: @xtxColor;
            }
            .detail {
                margin-top: 10px;
                .line {
                    .title {
                        font-weight: 700;

                        // width: 100px;
                        .word {
                            display: inline-block;
                            width: 60px;
                            // text-align: justify;
                            text-align-last: justify;
                        }

                        .colon {
                            margin: 0 5px;
                        }
                    }
                    .default {
                        color: red;
                    }
                }
            }
        }
        .right {
            position: relative;
            width: 200px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            .delete {
                cursor: pointer;
                width: 20px;
                height: 20px;
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .operations {
                position: absolute;
                top: 50%;
                color: @linkColor;
                .button {
                    margin-right: 20px;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
