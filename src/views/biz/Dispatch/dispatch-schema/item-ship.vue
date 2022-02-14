<template>
    <div :class="[
        'item-ship',
    ]">
        <app-panel :width="panelWidth" :height="cellHeight">
            <div class="item-ship__inner">
                <div class="item-ship__item item--with-img" :style="{ width: cellWidth }">
                    <div class="item__img">
                        <img :src="item.Pic || ship_png" />
                    </div>
                    <div class="item__title">{{ item.CnName }}</div>
                </div>
                <div
                    :class="[
                        'item-ship__item',
                        `is--state-${getRealState(i)}`,
                        {
                            'is--active': activeFn(i)
                        }
                    ]"
                    v-for="i in item.list"
                    :style="{ width: cellWidth }"
                    @click="onItemClick(i)"
                >
                    <div class="item__from">
                        <yw-icon name="yw-icon-point"></yw-icon>
                        {{ getBeforeText(i) }}
                    </div>
                    <div class="item__arrow">
                        <yw-icon name="yw-icon-arrow-right-circle"></yw-icon>
                    </div>
                    <div class="item__to">
                        <yw-icon name="yw-icon-point"></yw-icon>
                        {{ getAfterText(i) }}
                    </div>
                    <div class="item__time">
                        <span>始:</span>
                        {{ $filters.time(i.EstimateDispatchStartTime) }}
                    </div>
                    <div class="item__time">
                        <span>止:</span>
                        {{ $filters.time(i.EstimateDispatchEndTime) }}
                    </div>
                </div>
            </div>
        </app-panel>
    </div>
</template>

<script lang="ts">
import { DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";
import { computed, defineComponent, PropType } from "vue";
import ship_png from '@/assets/ship.png';
import { AfterTextFnMap, BeforeTextFnMap, STATUS_MAP } from "./util";

type ItemState = 'secondary' | 'success' | 'primary' | string;

export default defineComponent({
    props: {
        state: {
            type: String as PropType<ItemState>,
            default: ''
        },
        cellWidth: {
            type: [String, Number],
            default: '1.5rem'
        },
        cellHeight: {
            type: [String, Number],
            default: '1.5rem'
        },
        item: {
            type: Object as PropType<DispatchSchemeDetailItem>,
            required: true
        },
        activeFn: {
            type: Function,
            required: true
        }
    },
    emits: {
        itemClick: (item: DispatchSchemeDetailItem) => true
    },
    setup(props, { emit }) {

        const panelWidth = computed(() => {
            let count = 1;
            let len = props.item?.list?.length;

            if (len) {
                count += len;
            }

            return `calc(${props.cellWidth} * ${count || 1})`;
        });

        const getBeforeText = (item: DispatchSchemeDetailItem) => {
            const { BeforeBerthPositionCategory } = item;
            const fn = BeforeTextFnMap[BeforeBerthPositionCategory];

            if (fn) {
                return fn(item);
            }
            else {
                return '';
            }
        }

        const getAfterText = (item: DispatchSchemeDetailItem) => {
            const { AfterBerthPositionCategory } = item;
            const fn = AfterTextFnMap[AfterBerthPositionCategory];

            if (fn) {
                return fn(item);
            }
            else {
                return '';
            }
        }

        const getRealState = (item: DispatchSchemeDetailItem) => {
            let { SchedulingStatus } = item;
            if (SchedulingStatus) {
                return STATUS_MAP[SchedulingStatus];
            }
        }

        const onItemClick = (item: DispatchSchemeDetailItem) => {
            emit('itemClick', item);
        }

        return {
            ship_png,
            panelWidth,
            getBeforeText,
            getAfterText,
            getRealState,
            onItemClick
        }
    }
});
</script>

<style lang="scss">
.item-ship {
    position: relative;
    border-radius: 0.04rem;
    overflow: hidden;
    background: rgb(0, 0, 0, 0.2);
    flex-shrink: 0;
    cursor: pointer;

    // &.is--active {
    //     &::before {
    //         box-shadow: 0.02rem 0.02rem 0.03rem 0.01rem red;
    //         border-color: rgb(115, 185, 255);
    //     }
    // }

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

    &__inner {
        display: flex;
        padding: 0 0.1rem;
        height: 100%;
    }

    &__item {
        display: flex;
        flex-direction: column;
        padding: 0.1rem 0.1rem;
        // border-right: 1px solid #ddd;
        // align-items: center;
        position: relative;

        @include lineBorder(right, 80%, rgba(255, 255, 255, 0.2));

        &.item--with-img {
            padding: 0.1rem 0.15rem;
        }

        &.is--state-secondary {
            background: rgb(51, 62, 77);
        }
        &.is--state-primary {
            background: rgb(36, 67, 108);
        }
        &.is--state-success {
            background: rgb(44, 83, 85);
        }

        &.is--active {
            &::before {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                border: 0.02rem solid rgb(115, 185, 255);
                content: "";
                border-radius: 0.08rem;
                transform: scaleY(1.1);
                box-shadow: 0 0 0.08rem 0.03rem rgba(115, 185, 255, 0.3),
                    inset 0 0 0.08rem 0.05rem rgba(115, 185, 255, 0.4);
            }
        }

        .item__img {
            width: 100%;
            height: 0.7rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .item__title {
            height: 0.3rem;
            line-height: 0.3rem;
            text-align: center;
            @include text-clamp(1);
            // background: red;
        }

        .item__from,
        .item__to {
            height: 0.2rem;
            line-height: 0.2rem;
            font-size: 0.13rem;
            @include text-clamp(1);
            color: rgb(113, 177, 255);
            // padding: 0 0.15rem;
            .yw-icon {
                font-size: 0.12rem;
                color: rgba(255, 255, 255, 0.8);
            }
        }
        .item__to {
            margin-bottom: 0.1rem;
        }

        .item__time {
            height: 0.2rem;
            line-height: 0.2rem;
            font-size: 0.12rem;
            @include text-clamp(1);
            // color: rgb(113, 177, 255);
            // padding: 0 0.15rem;

            span {
                color: rgb(171, 177, 180);
            }
        }

        .item__arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 0.15rem;
            color: rgba(255, 255, 255, 0.9);
            .yw-icon {
                transform: rotate(90deg);
            }
        }
    }

    // &::after {
    //     content: "";
    //     position: absolute;
    //     left: 0.06rem;
    //     right: 0.06rem;
    //     bottom: 0.06rem;
    //     top: 60%;
    //     border-bottom-left-radius: 0.08rem;
    //     border-bottom-right-radius: 0.08rem;
    // }

    // &::before {
    //     content: "";
    //     position: absolute;
    //     left: 0;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     background: rgb(0, 0, 0, 0.4);
    //     border: 0.02rem solid transparent;
    //     transition: all 0.1s ease;
    //     // z-index: 9;
    // }

    // &.is--state-secondary {
    //     &::before {
    //         background: rgba(124, 128, 126, 0.404);
    //     }
    // }

    // &.is--state-success {
    //     &::before {
    //         background: rgba(31, 197, 133, 0.404);
    //     }
    // }

    // &.is--state-primary {
    //     &::before {
    //         background: rgba(35, 130, 219, 0.445);
    //     }
    // }

    // &__pic {
    //     height: 0.5rem;
    //     border-radius: 0.04rem;
    //     overflow: hidden;
    //     padding: 0 0.15rem;
    //     img {
    //         width: 100%;
    //         height: 100%;
    //     }
    // }
    // &__title {
    //     height: 0.24rem;
    //     line-height: 0.24rem;
    //     @include text-clamp(1);
    //     font-size: 0.14rem;
    //     padding: 0 0.15rem;
    // }
    // &__arrow {
    //     display: flex;
    //     align-items: center;
    //     justify-content: center;
    //     padding: 0 0.15rem;
    //     .yw-icon {
    //         transform: rotate(90deg);
    //     }
    // }
    // &__from,
    // &__to {
    //     height: 0.2rem;
    //     line-height: 0.2rem;
    //     font-size: 0.12rem;
    //     @include text-clamp(1);
    //     color: rgb(113, 177, 255);
    //     padding: 0 0.15rem;
    // }
}
</style>