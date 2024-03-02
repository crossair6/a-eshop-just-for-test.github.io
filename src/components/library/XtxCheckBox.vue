<template>
    <div class="xtx-checkbox" @click="changeChecked">
        <i v-if="modelValue" class="iconfont icon-checked"></i>
        <i v-else class="iconfont icon-unchecked"></i>
        <span v-if="$slots.default"><slot /></span>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
// 外界传过来默认的选中与否
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})
// 向外界传递最新的值
const emit = defineEmits(['update:modelValue', 'change'])
// vue3的ref可以直接绑定props,所以不用watch props,直接ref(props)
const checked = ref(props.modelValue)

// 监听prop的变化，如果变化了，就更新checked的值
watch(
    () => props.modelValue,
    () => {
        // console.log(checked.value)
    },
    {
        immediate: true
    }
)
// 改变checked的值,同时向外界传递最新的值
function changeChecked() {
    checked.value = !checked.value
    emit('update:modelValue', checked.value)
    emit('change', checked.value)
}
</script>
<style scoped lang="less">
.xtx-checkbox {
    display: inline-block;
    margin-right: 2px;
    .icon-checked {
        color: @xtxColor;
        ~ span {
            color: @xtxColor;
        }
    }
    i {
        position: relative;
        top: 1px;
    }
    span {
        margin-left: 2px;
    }
}
</style>
