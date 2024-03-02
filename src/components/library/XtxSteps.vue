<!-- <template>
    <div class="xtx-steps">
        <div class="xtx-steps-item active" v-for="i in 5" :key="i">
            <div class="step">
                <span>{{ i }}</span>
            </div>
            <div class="title">提交订单</div>
            <div class="desc">2021-03-18 02:11:47</div>
        </div>
    </div>
</template> -->
<script lang="jsx">
export default {
    name: 'XtxSteps',
    props: {
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    render() {
        const steps = this.$slots.default()
        const dynamicSteps = []
        steps.forEach((step) => {
            if (Array.isArray(step.children)) {
                dynamicSteps.push(...step.children)
            } else {
                dynamicSteps.push(step)
            }
        })
        const dynamicStepsJSX = dynamicSteps.map((step, index) => {
            return (
                <div
                    class={`xtx-steps-item ${
                        index <= this.activeIndex ? 'active' : ''
                    }`}
                >
                    <div class="step">
                        <span>{index + 1}</span>
                    </div>
                    <div class="title">{step.props.title}</div>
                    <div class="desc">{step.props.desc}</div>
                </div>
            )
        })
        return <div class="xtx-steps">{dynamicStepsJSX}</div>
    }
}
</script>
<style lang="less">
.xtx-steps {
    display: flex;
    text-align: center;
    &-item {
        flex: 1;
        &:first-child {
            .step {
                &::before {
                    display: none;
                }
            }
        }
        &:last-child {
            .step {
                &::after {
                    display: none;
                }
            }
        }
        &.active {
            .step {
                > span {
                    border-color: @xtxColor;
                    background: @xtxColor;
                    color: #fff;
                }
                &::before,
                &::after {
                    background: @xtxColor;
                }
            }
            .title {
                color: @xtxColor;
            }
        }
        .step {
            position: relative;
            > span {
                width: 48px;
                height: 48px;
                font-size: 28px;
                border: 2px solid #e4e4e4;
                background: #fff;
                border-radius: 50%;
                line-height: 44px;
                color: #ccc;
                display: inline-block;
                position: relative;
                z-index: 1;
            }
            &::after,
            &::before {
                content: '';
                position: absolute;
                top: 23px;
                width: 50%;
                height: 2px;
                background: #e4e4e4;
            }
            &::before {
                left: 0;
            }
            &::after {
                right: 0;
            }
        }
        .title {
            color: #999;
            padding-top: 12px;
        }
        .desc {
            font-size: 12px;
            color: #999;
            padding-top: 6px;
        }
    }
}
</style>
