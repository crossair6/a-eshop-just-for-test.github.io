<template>
    <div class="xtx-pagination">
        <a :class="{ disabled: !prevPage }" @click="goPrev">上一页</a>
        <a
            v-if="firstPage"
            :class="{ active: 1 === pageNumber }"
            @click="changePage(1)"
            >1</a
        >

        <span v-if="leftEllipsis">...</span>
        <a
            :class="{ active: item === pageNumber }"
            v-for="item in middlePages"
            :key="item"
            @click="changePage(item)"
            >{{ item }}</a
        >

        <span v-if="rightEllipsis">...</span>
        <a
            v-if="lastPage"
            @click="changePage(pages)"
            :class="{ active: pages === pageNumber }"
            >{{ pages }}</a
        >
        <a :class="{ disabled: !nextPage }" @click="goNext">下一页</a>
    </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
    page: {
        type: [Number, String],
        default: 1
    },
    pageSize: {
        type: [Number, String],
        default: 10
    },
    total: {
        type: [Number, String],
        default: 11
    },
    size: {
        type: String,
        default: 'normal'
    }
})
const emit = defineEmits(['changePage'])
// const sizeCount = {
//     normal: 7,
//     large: 9
// }
const pageNumber = computed(() => {
    // console.log(Number(props.page))
    return Number(props.page)
})
const pageSize = computed(() => {
    return Number(props.pageSize)
})
const total = computed(() => {
    return Number(props.total)
})

// 1.prevPage上一页
const prevPage = computed(() => {
    return pageNumber.value > 1
})
// 2.nextPage下一页
const nextPage = computed(() => {
    return pageNumber.value < pages.value
})
// 3.leftEllipsis左省略号
const leftEllipsis = computed(() => {
    return middlePages.value[0] >= 3
})
// 4.rightEllipsis右省略号
const rightEllipsis = computed(() => {
    return middlePages.value[middlePages.value.length - 1] <= pages.value - 2
})
// 5.firstPage第一页
const firstPage = true
// 6.lastPage最后一页
const lastPage = computed(() => {
    return pages.value >= 2
})
// 7.middlePages中间页码

// 以pageNumber为中点,start为中点-2,end为中点+2
// 如果start<=1,那么start=2,
// 如果end>=pages,那么end=pages-1
// 如果end-start+1<5的情况下,如果start=2,那么end=pages-1;如果end=pages-1,那么start=2
const middlePages = computed(() => {
    // const size = sizeCount[props.size]
    let start = pageNumber.value - 2
    let end = pageNumber.value + 2
    const res = []
    if (start <= 1) {
        start = 2
    }
    if (end >= pages.value) {
        end = pages.value - 1
    }
    if (end - start + 1 < 5) {
        if (start === 2) {
            end = Math.min(pages.value - 1, start + 4)
        }
        if (end === pages.value - 1) {
            start = Math.max(2, end - 4)
        }
    }
    for (let i = start; i <= end; i++) {
        res.push(i)
    }
    // console.log(res)
    return res
})

const pages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
})
function changePage(newPageNumber) {
    emit('changePage', newPageNumber)
}
function goPrev() {
    if (pageNumber.value <= 1) {
        return
    }
    changePage(pageNumber.value - 1)
}
function goNext() {
    if (pageNumber.value >= pages.value) {
        return
    }
    changePage(pageNumber.value + 1)
}
</script>
<style scoped lang="less">
.xtx-pagination {
    display: flex;
    justify-content: center;
    padding: 30px;
    > a {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        margin-right: 10px;
        &:hover {
            color: @xtxColor;
            cursor: pointer;
        }
        &.active {
            background: @xtxColor;
            color: #fff;
            border-color: @xtxColor;
        }
        &.disabled {
            cursor: not-allowed;
            opacity: 0.4;
            &:hover {
                color: #333;
            }
        }
    }
    > span {
        margin-right: 10px;
    }
}
</style>
