<template>
    <div
        :class="[
            'item-single',
            `is--state-${realState}`,
            `is--size-${size}`,
            {
                'is--active': active,
                'is--yunwei': isYunwei
            }
        ]"
        :style="{
            width: width
        }"
    >
        <app-panel :width="width" :height="height" class="size-mini" v-if="item">
            <template v-if="size === 'large'">
                <div class="item-large__top">
                    <div class="top__img">
                        <img :src="item.Pic || ship_png" v-if="!isYunwei" />
                        <span class="yunwei-box" v-else>
                            <yw-icon name="yw-icon-yunwei"></yw-icon>
                        </span>
                    </div>
                    <div class="top__info">
                        <div class="info__title">{{ !isYunwei ? item.CnName : '实施运维' }}</div>
                        <div class="info__position">
                            <yw-icon name="yw-icon-point"></yw-icon>
                            <span class="position-from" v-if="!isYunwei">{{ BeforeText }}</span>
                            <yw-icon name="yw-icon-arrow-right-circle" v-if="!isYunwei"></yw-icon>
                            <span class="position-to">{{ AfterText }}</span>
                        </div>
                        <div class="info__offset" v-if="!isYunwei">
                            <span class="offset-from">
                                <b>原偏移：</b>
                                {{ item.BeforeBowOffsetDistance }}米
                            </span>
                            <span class="offset-to">
                                <b>目标偏移：</b>
                                {{ item.AfterBowOffsetDistance }}米
                            </span>
                        </div>
                        <div
                            class="info__yunwei-text"
                            v-else
                        >{{ item.Remarks }}</div>
                    </div>
                </div>
                <div class="item-large__bottom">
                    <b>计划时间：</b>
                    {{ $filters.time(item.EstimateDispatchStartTime) }} -- {{ $filters.time(item.EstimateDispatchEndTime) }}
                </div>
            </template>
            <template v-else>
                <div class="item-single__pic">
                    <img :src="item.Pic || ship_png" v-if="!isYunwei" />
                    <span class="yunwei-box" v-else>
                        <yw-icon name="yw-icon-yunwei"></yw-icon>
                    </span>
                </div>
                <div class="item-single__title">{{ !isYunwei ? item.CnName : '实施运维' }}</div>
                <div class="item-single__from" v-if="!isYunwei">
                    <yw-icon name="yw-icon-point"></yw-icon>
                    <el-tooltip :content="BeforeText">{{ BeforeText }}</el-tooltip>
                </div>
                <div class="item-single__arrow" v-if="!isYunwei">
                    <yw-icon name="yw-icon-arrow-right-circle"></yw-icon>
                </div>
                <div class="item-single__to">
                    <yw-icon name="yw-icon-point"></yw-icon>
                    <el-tooltip :content="AfterText">{{ AfterText }}</el-tooltip>
                </div>
                <div class="item-single__yunwei-text" v-if="isYunwei">{{ item.Remarks }}</div>
            </template>
        </app-panel>
    </div>
</template>

<script lang="ts">
import { DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";
import { computed, defineComponent, PropType } from "vue";
import ship_png from '@/assets/ship.png';
import { BeforeTextFnMap, AfterTextFnMap, STATUS_MAP } from './util';

type ItemState = 'secondary' | 'success' | 'primary' | string;

export default defineComponent({
    props: {
        state: {
            type: String as PropType<ItemState>,
            default: ''
        },
        status: {
            type: [String, Number],
        },
        width: {
            type: [String, Number],
            default: '1.2rem'
        },
        height: {
            type: [String, Number],
            default: '1.5rem'
        },
        item: {
            type: Object as PropType<DispatchSchemeDetailItem>,
            required: true
        },
        size: String,
        active: Boolean
    },
    setup(props, { emit }) {

        const BeforeText = computed(() => {
            const { BeforeBerthPositionCategory } = props.item;
            const fn = BeforeTextFnMap[BeforeBerthPositionCategory];

            if (fn) {
                return fn(props.item);
            }
            else {
                return '';
            }
        });

        const AfterText = computed(() => {
            const { AfterBerthPositionCategory } = props.item;
            const fn = AfterTextFnMap[AfterBerthPositionCategory];

            if (fn) {
                return fn(props.item);
            }
            else {
                return '';
            }
        });

        const realState = computed(() => {
            let { state, status } = props;
            if (state) {
                return state;
            }
            else if (status) {
                return STATUS_MAP[status];
            }
        });

        const isYunwei = computed(() => props.item.Type === '2');

        return {
            ship_png,
            realState,
            BeforeText,
            AfterText,
            isYunwei
        }
    }
});
</script>

<style lang="scss">
.item-single {
    position: relative;
    border-radius: 0.04rem;
    overflow: hidden;
    background: rgb(0, 0, 0, 0.2);
    flex-shrink: 0;
    cursor: pointer;

    &.is--active {
        &::before {
            box-shadow: 0.02rem 0.02rem 0.03rem 0.01rem red;
            border-color: rgb(115, 185, 255);
        }
    }

    &.is--size-large {
        .app-panel__inner {
            padding: 0.15rem 0.15rem;
        }
        .item-large__top {
            height: 80%;
            display: flex;
            .top__img {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 0.06rem;
                overflow: hidden;
                flex: none;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .top__info {
                flex: 1;
                padding: 0 0.1rem;

                .info__title {
                    font-size: 0.15rem;
                    font-weight: bold;
                    @include text-clamp(1);
                }
                .info__position {
                    font-size: 0.13rem;
                    display: flex;
                    align-items: center;
                    height: 0.3rem;
                    .yw-icon-point {
                        margin-right: 0.05rem;
                    }
                    .position-from,
                    .position-to {
                        width: 40%;
                        color: #71b1ff;
                        @include text-clamp(1);
                        .yw-icon {
                            font-size: 0.12rem;
                        }
                    }
                    .position-from {
                    }
                    .position-to {
                        text-align: right;
                    }
                }
                .info__offset {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .offset-to {
                        text-align: right;
                    }
                }
                .info__yunwei-text {
                    color: rgb(219, 219, 219);
                    font-size: 0.13rem;
                    @include text-clamp(2);
                }
            }
        }
        .item-large__bottom {
            height: 20%;
            display: flex;
            align-items: center;
            font-size: 0.13rem;
            // background: red;
            line-height: 0;
            letter-spacing: 0.01rem;
        }
    }

    &.is--yunwei {
        .yunwei-box {
            background: rgb(66, 121, 183);
            height: 0.5rem;
            border-radius: 0.04rem;
            overflow: hidden;
            padding: 0 0.15rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .yw-icon {
                font-size: 0.3rem;
            }
        }
        .position-to{
            text-align: left !important;
        }
    }

    .app-panel__bg {
        border-radius: 0.04rem;
        background: none;
        &::after {
            background: none;
        }
    }
    .app-panel__inner {
        --app-panel-padding: 0;
        overflow-y: hidden;
        padding: 0.15rem 0;
    }

    &::after {
        content: "";
        position: absolute;
        left: 0.06rem;
        right: 0.06rem;
        bottom: 0.06rem;
        top: 60%;
        border-bottom-left-radius: 0.08rem;
        border-bottom-right-radius: 0.08rem;
    }

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgb(0, 0, 0, 0.4);
        border: 0.02rem solid transparent;
        transition: all 0.1s ease;
        // z-index: 9;
    }

    &.is--state-secondary {
        &::before {
            background: rgba(124, 128, 126, 0.404);
        }
    }

    &.is--state-success {
        &::before {
            background: rgba(31, 197, 133, 0.404);
        }
    }

    &.is--state-primary {
        &::before {
            background: rgba(35, 130, 219, 0.445);
        }
    }

    &__pic {
        height: 0.5rem;
        border-radius: 0.04rem;
        overflow: hidden;
        padding: 0 0.15rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    &__title {
        height: 0.24rem;
        line-height: 0.24rem;
        @include text-clamp(1);
        font-size: 0.14rem;
        padding: 0 0.15rem;
        text-align: center;
    }
    &__arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.15rem;
        .yw-icon {
            transform: rotate(90deg);
        }
    }
    &__from,
    &__to {
        height: 0.2rem;
        line-height: 0.2rem;
        font-size: 0.12rem;
        @include text-clamp(1);
        color: rgb(113, 177, 255);
        padding: 0 0.15rem;
        text-align: center;

        .yw-icon {
            color: #fff;
        }
    }

    &__yunwei-text {
        // background: red;
        height: 0.32rem;
        line-height: 0.16rem;
        padding: 0 0.15rem;
        font-size: 0.12rem;
        color: rgb(161, 189, 217);
        @include text-clamp(2);
    }
}
</style>