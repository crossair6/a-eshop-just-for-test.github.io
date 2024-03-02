<template>
    <div class="xtx-city" ref="target">
        <div class="select" @click="clickAddress" :class="{ active: isShow }">
            <span class="placeholder" v-if="!selectedAddress.fullAddress"
                >请选择地址</span
            >
            <span class="value">{{ selectedAddress.fullAddress }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="option" v-if="isShow">
            <span
                class="ellipsis"
                v-for="item in cityData"
                :key="item.code"
                @click="clickArea(item)"
                >{{ item.name }}</span
            >
            <div v-if="!cityData">loading</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getCityDataAPI } from '@/api/cityData.js'
import { useIsClickOutside } from '@/hooks/index.js'
const emit = defineEmits(['changeAddress'])
const { target, isClickOutside } = useIsClickOutside()
const isShow = ref(false)
const props = defineProps({
    defaultAddress: {
        type: Object,
        default: null
    }
})

const selectedAddress = ref({
    provinceName: '',
    provinceCode: '',
    cityName: '',
    cityCode: '',
    countyName: '',
    countyCode: '',
    fullAddress: ''
})
watch(isClickOutside, (newVal) => {
    if (newVal) {
        isShow.value = false
    }
})
watch(
    () => props.defaultAddress,
    () => {
        getDefaultAddress()
    },
    { deep: true }
)
// 以第一个省第一个市第一个区为默认地址
function getDefaultAddress() {
    if (props.defaultAddress?.id) {
        for (const key in selectedAddress.value) {
            selectedAddress.value[key] = props.defaultAddress[key]
        }
        setSelected()
    }
    for (const key in props.defaultAddress) {
        console.log(props.defaultAddress[key])
        if (!props.defaultAddress[key]) {
            return
        }
        for (const key in selectedAddress.value) {
            selectedAddress.value[key] = props.defaultAddress[key]
        }
        setSelected()
    }
}
function setSelected() {
    console.log(4444)
    const province = cityData.value.find(
        (item) => item.code === selectedAddress.value.provinceCode
    )
    selectedAddress.value.provinceName = province.name
    const city = province.areaList.find(
        (item) => item.code === selectedAddress.value.cityCode
    )
    selectedAddress.value.cityName = city.name
    const county = city.areaList.find(
        (item) => item.code === selectedAddress.value.countyCode
    )
    selectedAddress.value.countyName = county.name

    selectedAddress.value.fullAddress = `${province.name} ${city.name} ${county.name}`
}

// 当点击地址区域时,
function clickAddress() {
    isShow.value = !isShow.value
}

const cityData = ref(null)
// 是否缓存过cityData,如果没有缓存过,则请求数据
if (window.cityData) {
    cityData.value = window.cityData
    getDefaultAddress()
} else {
    getCityDataAPI().then((data) => {
        window.cityData = data
        cityData.value = data
        getDefaultAddress()
    })
}

// 点击每一个具体的省市区item
function clickArea(item) {
    if (item.level === 0) {
        selectedAddress.value.provinceName = item.name
        selectedAddress.value.provinceCode = item.code
        // 切换到城市列表
        cityData.value = item.areaList
    } else if (item.level === 1) {
        selectedAddress.value.cityName = item.name
        selectedAddress.value.cityCode = item.code
        // 切换到区县列表
        cityData.value = item.areaList
    } else {
        selectedAddress.value.countyName = item.name
        selectedAddress.value.countyCode = item.code
        // 只在点击到三级地址(区县)时,才更新完整省市区fullAddress
        selectedAddress.value.fullAddress =
            selectedAddress.value.provinceName +
            ' ' +
            selectedAddress.value.cityName +
            ' ' +
            selectedAddress.value.countyName
        // 切换到省列表
        cityData.value = window.cityData
        isShow.value = false
        // 通知父组件已经更新地址
        emit('changeAddress', selectedAddress.value)
    }
}
</script>

<style scoped lang="less">
.xtx-city {
    display: inline-block;
    position: relative;
    z-index: 400;
    .select {
        border: 1px solid #e4e4e4;
        height: 30px;
        padding: 0 5px;
        line-height: 28px;
        cursor: pointer;
        &.active {
            background: #fff;
        }
        .placeholder {
            color: #999;
        }
        .value {
            color: #666;
            font-size: 12px;
        }
        i {
            font-size: 12px;
            margin-left: 5px;
        }
    }
    .option {
        width: 542px;
        border: 1px solid #e4e4e4;
        position: absolute;
        left: 0;
        top: 29px;
        background: #fff;
        min-height: 30px;
        line-height: 30px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        > span {
            width: 130px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            padding: 0 3px;
            &:hover {
                background: #e6f6e6;
            }
        }
    }
}
</style>
