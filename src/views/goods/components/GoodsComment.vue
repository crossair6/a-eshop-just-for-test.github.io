<template>
    <div class="goods-comment" v-if="comment && commentList">
        <div class="head">
            <div class="data">
                <p>
                    <span>{{ comment.salesCount }}</span
                    ><span>人购买</span>
                </p>
                <p>
                    <span>{{ comment.praisePercent }}</span
                    ><span>好评率</span>
                </p>
            </div>
            <div class="tags">
                <div class="dt">大家都在说：</div>
                <div class="dd">
                    <a
                        @click="clickTag('')"
                        :class="{ active: activeTag === '' }"
                        >全部评价（{{ comment.evaluateCount }}）</a
                    >
                    <a
                        @click="clickTag('img')"
                        :class="{ active: activeTag === 'img' }"
                        >有图{{ comment.hasPictureCount }}）</a
                    >
                    <a
                        @click="clickTag(tag.title)"
                        v-for="(tag, index) in comment.tags"
                        :key="index"
                        :class="{ active: activeTag === tag.title }"
                        >{{ tag.title }}({{ tag.tagCount }})</a
                    >
                </div>
            </div>
        </div>
        <div class="sort">
            <span>排序：</span>
            <a
                @click="clickSort(null)"
                :class="{ active: reqParams.sortField === null }"
                >默认</a
            >
            <a
                @click="clickSort('createTime')"
                :class="{ active: reqParams.sortField === 'createTime' }"
                >最新</a
            >
            <a
                @click="clickSort('praiseCount')"
                :class="{ active: reqParams.sortField === 'praiseCount' }"
                >最热</a
            >
        </div>
        <!-- 列表 -->
        <div class="list" v-if="commentList">
            <div
                class="item"
                v-for="(item, index) in commentList.items"
                :key="index"
            >
                <div class="user">
                    <img :src="item.member.avatar" alt="" />
                    <span>{{ item.maskedName }}</span>
                </div>
                <div class="body">
                    <div class="score">
                        <i
                            class="iconfont icon-wjx01"
                            v-for="star in item.score"
                            :key="star"
                        ></i>

                        <i
                            class="iconfont icon-wjx02"
                            v-for="unStar in 5 - item.score"
                            :key="unStar"
                        ></i>
                        <span class="attr">{{ item.orderInfoSpecStr }}</span>
                    </div>
                    <!-- 文字评论 -->
                    <div class="text">
                        {{ item.content }}
                    </div>
                    <!-- 图片预览 -->
                    <GoodsCommentImage
                        v-if="item.pictures.length > 0"
                        :pictures="item.pictures"
                    ></GoodsCommentImage>
                    <div class="time">
                        <span>{{ item.createTime }}</span>
                        <span class="zan"
                            ><i class="iconfont icon-dianzan"></i
                            >{{ item.praiseCount }}</span
                        >
                    </div>
                </div>
            </div>
        </div>
        <!-- 分页组件 -->
        <XtxPagination
            @changePage="changePage"
            :page="reqParams.page"
            :pageSize="reqParams.pageSize"
            :total="commentList.counts"
        ></XtxPagination>
    </div>
</template>
<script setup>
import { inject, ref, watch } from 'vue'
import { getGoodsCommentAPI, getGoodsCommentListAPI } from '@/api/goods.js'
import GoodsCommentImage from './GoodsCommentImage.vue'
const goods = inject('goods')
const comment = ref(null)
// 获取商品评价基本信息
async function getGoodsComment(goodsId) {
    const res = await getGoodsCommentAPI(goodsId)
    // console.log(res)
    comment.value = res.result
}
getGoodsComment(goods.id)
const activeTag = ref('')
function clickTag(tag) {
    activeTag.value = tag
    // 1.tag为全部评价
    if (tag === '') {
        reqParams.value.hasPicture = null
        reqParams.value.tag = null
        // 2.tag为有图片评价
    } else if (tag === 'img') {
        reqParams.value.tag = null
        reqParams.value.hasPicture = true
        // 3.tag为除了"全部"和"有图"的其他评价
    } else {
        reqParams.value.hasPicture = null
        reqParams.value.tag = tag
    }
    reqParams.value.page = 1
}

// 筛选条件准备
const reqParams = ref({
    page: 1,
    pageSize: 10,
    hasPicture: null,
    tag: null,
    sortField: null,
    sortMethod: 'desc'
})
watch(
    reqParams,
    (newVal) => {
        getGoodsCommentList(goods.id, newVal)
    },
    { deep: true, immediate: true }
)
// 获取商品评价列表
const commentList = ref(null)
async function getGoodsCommentList(goodsId, reqParams) {
    const res = await getGoodsCommentListAPI(goodsId, reqParams)
    // console.log(res)
    res.result.items.forEach((item) => {
        // 用户名加密处理 TomCat--> T****t
        item.maskedName =
            item.member.nickname[0] +
            '****' +
            item.member.nickname[item.member.nickname.length - 1]
        // 商品规格字符串拼接,例如 颜色：红色 尺码：34
        item.orderInfoSpecStr = ''
        item.orderInfo.specs.forEach((spec) => {
            item.orderInfoSpecStr += spec.name + ':' + spec.nameValue + ' '
        })
        // console.log(item.orderInfoSpecStr)
    })
    commentList.value = res.result
    // console.log(res)
}
// 点击排序,即默认 最新 最热
function clickSort(sortField) {
    reqParams.value.sortField = sortField
    reqParams.value.page = 1
}
// 当页码改变时
function changePage(newPageNumber) {
    reqParams.value.page = newPageNumber
}
</script>
<style scoped lang="less">
.goods-comment {
    .head {
        display: flex;
        padding: 30px 0;
        .data {
            width: 340px;
            display: flex;
            padding: 20px;
            p {
                flex: 1;
                text-align: center;
                span {
                    display: block;
                    &:first-child {
                        font-size: 32px;
                        color: @priceColor;
                    }
                    &:last-child {
                        color: #999;
                    }
                }
            }
        }
        .tags {
            flex: 1;
            display: flex;
            border-left: 1px solid #f5f5f5;
            .dt {
                font-weight: bold;
                width: 100px;
                text-align: right;
                line-height: 42px;
            }
            .dd {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                cursor: pointer;
                > a {
                    width: 132px;
                    height: 42px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    border: 1px solid #e4e4e4;
                    background: #f5f5f5;
                    color: #999;
                    text-align: center;
                    line-height: 40px;
                    &:hover {
                        border-color: @xtxColor;
                        background: lighten(@xtxColor, 50%);
                        color: @xtxColor;
                    }
                    &.active {
                        border-color: @xtxColor;
                        background: @xtxColor;
                        color: #fff;
                    }
                }
            }
        }
    }
    .sort {
        height: 60px;
        line-height: 60px;
        border-top: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        margin: 0 20px;
        color: #666;
        > span {
            margin-left: 20px;
        }
        > a {
            margin-left: 30px;
            &.active,
            &:hover {
                color: @xtxColor;
            }
        }
    }
    .list {
        padding: 0 20px;
        .item {
            display: flex;
            padding: 25px 10px;
            border-bottom: 1px solid #f5f5f5;
            .user {
                width: 160px;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                }
                span {
                    padding-left: 10px;
                    color: #666;
                }
            }
            .body {
                flex: 1;
                .score {
                    line-height: 40px;
                    .iconfont {
                        color: #ff9240;
                        padding-right: 3px;
                    }
                    .attr {
                        padding-left: 10px;
                        color: #666;
                    }
                }
            }
            .text {
                color: #666;
                line-height: 24px;
            }
            .time {
                color: #999;
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
            }
        }
    }
}
</style>
