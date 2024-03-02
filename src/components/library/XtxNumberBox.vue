<template>
    <div class="xtx-numbox">
        <div class="label" v-if="label">数量</div>
        <div class="numbox">
            <a @click="changeNumber(-1)">-</a>
            <input type="text" :value="number" readonly />
            <a @click="changeNumber(1)">+</a>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
    modelValue: {
        type: Number,
        default: 1
    },
    min: {
        type: Number,
        default: 1
    },
    max: {
        type: Number,
        default: 3
    },
    label: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['update:modelValue', 'change'])
const number = ref(props.modelValue)
watch(
    () => props.modelValue,
    (newVal) => {
        number.value = newVal
    }
)
function changeNumber(step) {
    const newValue = number.value + step
    if (newValue < props.min || newValue > props.max) {
        return
    }
    number.value = newValue
    emit('update:modelValue', number.value)
    emit('change', number.value)
}
</script>
<style scoped lang="less">
.xtx-numbox {
    display: flex;
    align-items: center;
    .label {
        width: 60px;
        color: #999;
        padding-left: 10px;
    }
    .numbox {
        width: 120px;
        height: 30px;
        border: 1px solid #e4e4e4;
        display: flex;
        > a {
            width: 29px;
            line-height: 28px;
            text-align: center;
            background: #f8f8f8;
            font-size: 16px;
            color: #666;
            &:first-of-type {
                border-right: 1px solid #e4e4e4;
            }
            &:last-of-type {
                border-left: 1px solid #e4e4e4;
            }
        }
        > input {
            width: 60px;
            padding: 0 5px;
            text-align: center;
            color: #666;
        }
    }
}
</style>
