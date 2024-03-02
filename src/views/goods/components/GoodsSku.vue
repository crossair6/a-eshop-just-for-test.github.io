<template>
    <div class="goods-sku">
        <dl v-for="(item, index) in goods.specs" :key="item.name">
            <dt>{{ item.name }}</dt>
            <dd>
                <template v-for="subItem in item.values" :key="subItem.name">
                    <img
                        :class="[
                            { selected: subItem.selected },
                            { disabled: subItem.disabled }
                        ]"
                        :src="subItem.picture"
                        :title="subItem.name"
                        v-if="subItem.picture"
                        @click="clickTag(item, index, subItem)"
                    />

                    <span
                        v-else
                        :class="[
                            { selected: subItem.selected },
                            { disabled: subItem.disabled }
                        ]"
                        @click="clickTag(item, index, subItem)"
                        >{{ subItem.name }}</span
                    >
                </template>
            </dd>
        </dl>
    </div>
</template>
<script setup>
/**
 * 1.渲染所有的tag,给每个tag都设置selected属性false,disabled属性为false
 * 2.根据sku列表算出路径字典
 * 3.声明一个selectedValues,用于存放已经选中的tag
 * 4.声明一个方法checkTagAvailable,页面加载时使用此方法检测tag是否可用,每次selectedValues变化时也要使用
 * 5.即查看selectedValues+剩余所有tag是否在路径字典内,在的话disabled为false,不在为true
 * 6.点击tag后,设置其selected的值,并将tag的值加入selectedValues,调用checkTagAvailable
 * 7.设置默认选中sku,即将其规格全部加入selectedValues
 */
import { ref, watch } from 'vue'
import { findSubsets } from '@/utils/powerSet.js'
const props = defineProps({
    goods: {
        type: Object,
        default: null
    },
    defaultSkuId: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['selectedFinished'])
const selectedValue = ref(null)
const powerSet = ref(null)
function getUndefinedSelectedValue() {
    selectedValue.value = new Array(props.goods.specs.length).fill(undefined)
}
watch(
    () => props.goods.id,
    (newVal, oldVal) => {
        console.log(newVal, oldVal)
        console.log(
            `goods改变了,goodsId是${props.goods.id},默认skuId是${props.defaultSkuId}`
        )
        getUndefinedSelectedValue()

        initSpecs()
        getPowerSet()
        getDefaultSelectedValues(props.defaultSkuId)
    },
    { immediate: true }
)
function initSpecs() {
    props.goods.specs.forEach((item) => {
        item.values.forEach((subItem) => {
            subItem.selected = false
            subItem.disabled = false
        })
    })
}
// 2
// 2.1将每个sku下面的specs的值拼成一个数组
// 2.2求这个数组的所有子集
const seperator = '☆'
function getPowerSet() {
    const tempPowerSet = {}
    props.goods.skus.forEach((item) => {
        const specsArr = []
        item.specs.forEach((subItem) => {
            specsArr.push(subItem.valueName)
        })
        const res = findSubsets(specsArr)
        res.forEach((valueArr) => {
            const valueStr = valueArr.join(seperator)
            if (!tempPowerSet[valueStr]) {
                tempPowerSet[valueStr] = []
            }
            tempPowerSet[valueStr].push(item.id)
        })
    })
    powerSet.value = tempPowerSet
}

watch(selectedValue, checkTagAvailable)
// 4.
// 5.每一次selectedValue改变后,检查每一个tag是否可用
function checkTagAvailable() {
    // 实现方法:将每一个tag添加到selectedValue对应的位置,生成str,并在powerSet中检车是否有对应的str
    props.goods.specs.forEach((item, index) => {
        item.values.forEach((subItem) => {
            // 拷贝一下selectedValue,防止selectedValue改变时触发watch
            const tempArr = [...selectedValue.value]
            tempArr[index] = subItem.name
            const selectedValueStr = tempArr
                .filter((item) => item)
                .join(seperator)

            if (!powerSet.value[selectedValueStr]) {
                subItem.disabled = true
            }
        })
    })
}

/**
 * 6.点击tag更新selected状态,selectedValue的值,如果所有规格选择完毕则传递响应skuId给父组件
 * @param {*} item props.goods.specs的其中一项,比如{name: '颜色', values: [{name: '红色', id: 1}, {name: '蓝色', id: 2}]
 * @param {*} index item在props.goods.specs中的索引
 * @param {*} subItem item的其中一项,比如{name: '红色', id: 1}
 */
// 1.点击tag时,如果是禁用状态,直接return
// 2.如果tag是选中状态,则将其selected设置为false,并将selectedValue对应位置设置为undefined
// 3.如果tag是未选中状态,则先将所有的selected设置为false,再将该tag设置为true,并将selectedValue对应位置设置为tag的name
function clickTag(item, index, subItem) {
    if (subItem.disabled === true) {
        return false
    }
    if (subItem.selected === true) {
        subItem.selected = false
        selectedValue.value[index] = undefined
    } else {
        item.values.forEach((val) => {
            val.selected = false
        })
        subItem.selected = true

        selectedValue.value[index] = subItem.name
    }
    // 如果规格选择完毕(即selectedValue里每一个值都不是undefined),生成skuId传递给父组件

    if (selectedValue.value.every((value) => value)) {
        const selectedValueStr = selectedValue.value.join(seperator)

        const skuId = powerSet.value[selectedValueStr][0]
        emit('selectedFinished', skuId)
    } else {
        const skuId = ''
        emit('selectedFinished', skuId)
    }
}

// 7.外界传一个默认的skuId,这个函数将其设置为默认选中状态
function getDefaultSelectedValues(skuId) {
    console.log(skuId)
    const defaultSku = props.goods.skus.find((sku) => sku.id === skuId)
    // 1.循环sku的specs, 同时循环specs的values(tag), 如果tag的name和某个specs的name相同, 则clickTag(item, index, subItem)
    defaultSku.specs.forEach((skuSpec, skuSpecsIndex) => {
        const targetTag = props.goods.specs[skuSpecsIndex].values.find(
            (tag) => tag.name === defaultSku.specs[skuSpecsIndex].valueName
        )
        clickTag(props.goods.specs[skuSpecsIndex], skuSpecsIndex, targetTag)
    })
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
    border: 2px solid #ccc;
    margin-right: 10px;
    cursor: pointer;
    &.selected {
        border-color: @xtxColor;
    }
    &.disabled {
        opacity: 0.5;
        border-style: dashed;
        cursor: not-allowed;
        border-color: red;
    }
}
.goods-sku {
    padding-left: 10px;
    padding-top: 20px;
    dl {
        display: flex;
        padding-bottom: 20px;
        align-items: center;
        dt {
            width: 50px;
            color: #999;
        }
        dd {
            flex: 1;
            color: #666;
            > img {
                width: 50px;
                height: 50px;
                .sku-state-mixin ();
            }
            > span {
                display: inline-block;
                height: 30px;
                line-height: 28px;
                padding: 0 20px;
                margin-bottom: 10px;
                .sku-state-mixin ();
            }
        }
    }
}
</style>
