<template>
    <div class="monitor-view--mini">
        <div class="monitor-view--mini__header">
            <app-tabs
                :items="tabItems"
                direction="horizontal"
                v-model="query.Type"
                @change="refresh"
            ></app-tabs>
            <div class="header-search">
                <el-input
                    size="small"
                    placeholder="请输入监控名称"
                    class="input--theme-dark"
                    v-model="query.Key"
                ></el-input>
                <el-button size="mini" type="primary" @click="refresh" :loading="listLoading">搜索</el-button>
            </div>
            <div class="header-tools">
                <yw-icon name="yw-icon-max" @click="handleMax"></yw-icon>
                <yw-icon name="yw-icon-close" @click="handleClose"></yw-icon>
            </div>
        </div>
        <div class="monitor-view--mini__body">
            <div class="btns">
                <yw-icon
                    :class="['btn-prev', { 'is--disabled': prevBtnDisabled }]"
                    name="yw-icon-arrow-down"
                    @click="() => { if (!prevBtnDisabled) { navigator.pageIndex-- } }"
                ></yw-icon>
                <yw-icon
                    :class="['btn-next', { 'is--disabled': nextBtnDisabled }]"
                    name="yw-icon-arrow-down"
                    @click="() => { if (!nextBtnDisabled) { navigator.pageIndex++ } }"
                ></yw-icon>
            </div>
            <div class="video-list" v-loading="listLoading">
                <div class="video-item" v-for="i in displayChunk" :key="i.CameraId">
                    <video-box :name="i.Name" :src="i.Bitstream"></video-box>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, ComputedRef, watch, onMounted } from "vue";
import AppTabs from '@/components/AppTabs/index.vue';
import useMonitor from "./useMonitor";
import VideoBox from './video-box.vue';
import { chunkArr } from "./util";

export default defineComponent({
    components: {
        AppTabs,
        VideoBox
    },
    setup() {
        const tabItems = reactive([
            {
                label: "全部",
                value: "0"
            },
            {
                label: "船坞",
                value: "1"
            },
            {
                label: "码头",
                value: "2"
            },
            {
                label: "厂区外围",
                value: "3"
            },
            {
                label: "厂房",
                value: "4"
            },
            {
                label: "道路",
                value: "5"
            },
        ]);

        const { query, refresh, loading: listLoading, handleClose, changeSize, monitorList } = useMonitor();

        const handleMax = () => {
            changeSize('max');
        }

        const monitorChunksList = computed(() => chunkArr(monitorList.value, navigator.pageSize));

        const displayChunk = computed(() => {
            if (monitorChunksList.value.length) {
                return monitorChunksList.value[navigator.pageIndex];
            }
            else {
                return [];
            }
        });

        const navigator = reactive({
            pageIndex: 0,
            pageSize: 9
        });

        const prevBtnDisabled = computed(() => navigator.pageIndex === 0);
        const nextBtnDisabled = computed(() => {
            return monitorChunksList.value.length === 0 || navigator.pageIndex === monitorChunksList.value.length - 1;
        });

        watch(monitorList, () => {
            navigator.pageIndex = 0;
        });

        onMounted(() => {
            refresh();
        });

        return {
            query,
            tabItems,
            refresh,
            handleClose,
            handleMax,
            displayChunk,
            navigator,
            prevBtnDisabled,
            nextBtnDisabled,
            listLoading,
        }
    }
});
</script>

<style lang="scss">
$videoBoxWidth: 2.1rem;
$videoBoxHeight: 1.2rem;

$height: 2.5rem;
$headerHeight: 0.5rem;
$bottomGutter: 0.8rem;
$bodyHeight: $height - $headerHeight - $bottomGutter;

.monitor-view--mini {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: $height;
    background: rgba(2, 20, 43, 0.6);
    border-top: 2px solid rgba(255, 255, 255, 0.1);

    &:after {
        content: "";
        position: absolute;
        bottom: 0.4rem;
        width: 100%;
        border-bottom: 0.01rem solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 0.06rem 0 0 rgba(255, 255, 255, 0.7);
        filter: blur(0.0075rem);
    }

    &__header {
        padding: 0 1.5rem;
        height: $headerHeight;

        .app-tabs {
            align-items: flex-start;
            &::after {
                display: none !important;
            }
            .app-tab-item {
                border-radius: 0;
                border-bottom-left-radius: 0.06rem;
                border-bottom-right-radius: 0.06rem;
                border-top: none;
            }
        }

        .header-search {
            float: right;
            display: flex;
            transform: translateY(-0.2rem);

            .el-button {
                margin-left: 0.1rem;
            }
        }
        .header-tools {
            position: absolute;
            right: 0.1rem;
            top: 0.1rem;

            .yw-icon {
                width: 0.36rem;
                height: 0.28rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.03rem;
                transition: background-color 0.1s ease;
                font-size: 0.18rem;
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                &:active {
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        }
    }

    &__body {
        display: flex;
        width: 100%;
        justify-content: center;
        height: $bodyHeight;
        .video-list {
            display: flex;
            width: calc(100% - 1.5rem);
            overflow-x: hidden;
            .video-item {
                margin-right: 0.2rem;
                width: $videoBoxWidth;
                height: $videoBoxHeight;
                flex: none;
                .video-box {
                    height: 100%;
                }
            }
        }
        .btns {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            .yw-icon {
                position: absolute;
                top: 1.1rem;
                font-size: 0.3rem;
                color: rgba(193, 198, 211, 0.8);
                cursor: pointer;
                &:hover {
                    color: rgba(193, 198, 211, 1);
                }
                &.is--disabled {
                    color: rgba(193, 198, 211, 0.3);
                    cursor: not-allowed;
                }
            }
            .btn-prev {
                transform: rotate(90deg);
                left: 0.1rem;
            }
            .btn-next {
                transform: rotate(-90deg);
                right: 0.1rem;
            }
        }
    }
}
</style>