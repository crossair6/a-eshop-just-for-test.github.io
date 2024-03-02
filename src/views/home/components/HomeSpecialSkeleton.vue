<template>
    <div class="home-skeleton">
        <div
            class="item"
            v-for="i in 3"
            :key="i"
            :style="{ backgroundColor: bg }"
        >
            <XtxSkeleton
                bg="#e4e4e4"
                width="404px"
                height="288px"
                animated
                class="top"
            />
            <div class="foot">
                <div class="left">
                    <XtxSkeleton
                        bg="#e4e4e4"
                        width="58px"
                        height="20px"
                        animated
                    />
                    <XtxSkeleton
                        bg="#e4e4e4"
                        width="58px"
                        height="20px"
                        animated
                    />
                </div>
                <div class="right">
                    <XtxSkeleton
                        bg="#e4e4e4"
                        width="58px"
                        height="20px"
                        animated
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeSkeleton',
    props: {
        bg: {
            type: String,
            default: '#fff'
        }
    }
}
</script>

<style scoped lang="less">
.home-skeleton {
    width: 1240px;
    height: 360px;
    display: flex;
    justify-content: space-between;
    .item {
        .foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 72px;
            padding: 0 20px;
            .top {
                height: 288px;
                width: 100%;
            }
            .left {
                .xtx-skeleton {
                    margin-right: 25px;
                }
            }
        }
    }
}
</style>
