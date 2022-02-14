<template>
    <div class="Taifeng">
        <app-title-box>台风信息</app-title-box>
        <app-chart-box height="4.3rem">
            <div class="tabs">
                <app-tabs :items="tabItems" v-model="currentTab" direction="horizontal"></app-tabs>

                <div class="path-switch">
                    <span class="path-switch__label">
                        <yw-icon name="yw-icon-taifeng"></yw-icon>路径
                    </span>
                    <el-switch size="mini" v-model="showTyphonPath" active-color="rgb(46,174,101)"></el-switch>
                </div>
            </div>
            <div class="tab-content">
                <div :class="['tf-list', { 'is--has-menu': currentTab === 2 }]">
                    <div class="tf-list-menu" v-show="currentTab === 2">
                        <div
                            :class="['tf-list-menu__item', { 'is--active': i == historyQuery.Year }]"
                            @click="historyQuery.Year = i"
                            v-for="i in historyYearOptions"
                            :key="i"
                        >{{ i }}</div>
                    </div>
                    <ul class="tf-list__inner" v-loading="historyLoading || currentLoading">
                        <li
                            :class="['tf-list__item', { 'is--active': currentTyphon === i }]"
                            v-for="i in typhonList"
                            @click="handleItemClick(i)"
                        >
                            <div class="item-code">{{ i.tfid }}</div>
                            <div class="item-name">{{ i.name }}&nbsp;{{ i.enname?.toUpperCase() }}</div>
                        </li>
                    </ul>
                </div>
                <div class="border"></div>
                <div class="tf-points-list" v-loading="historyLoading || currentLoading">
                    <el-table
                        height="100%"
                        class="table--theme-dark"
                        :data="currentTyphon?.points"
                        size="small"
                    >
                        <el-table-column label="时间" prop="time" minWidth="100px" align="center">
                            <template #="{ row }">{{ new Date(row.time).format("MM-dd HH:mm") }}</template>
                        </el-table-column>
                        <el-table-column label="风速" prop="speed" align="center">
                            <template #="{ row }">{{ row.speed ? `${row.speed}m/s` : '-' }}</template>
                        </el-table-column>
                        <el-table-column label="移向" prop="movedirection" align="center"></el-table-column>
                        <el-table-column label="强度" prop="strong" align="center" minWidth="90px"></el-table-column>
                    </el-table>
                </div>
            </div>
        </app-chart-box>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import AppTabs, { TabItem } from "@/components/AppTabs/index.vue";
import TyphonApi from '@/api/TyphonApi';
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import KanbanApi from "@/api/KanbanApi";

export default defineComponent({
    components: {
        AppTabs
    },
    setup() {
        const store = useStore();

        // TABS
        const tabItems = ref([
            {
                label: computed(() => {
                    return `当前台风 ${typhoneList_Current.value.length}`
                }),
                value: 1
            },
            {
                label: computed(() => {
                    return `历史台风 ${typhoneList_History.value.length}`
                }),
                value: 2
            }
        ]);
        // 当前标签页
        const currentTab = ref(1);
        // 当前台风对象
        const currentTyphon = ref();

        // 同步当前台风对象到vuex
        watch(currentTyphon, (val) => {
            store.commit(ActionType.SET_CURRENT_TYPHON_OBJECT, val);
        });


        // 当前台风列表
        const typhoneList_Current = ref<any[]>([]);
        const currentLoading = ref(false);
        // 获取当前台风数据
        const getCurrentTyphon = async () => {
            currentLoading.value = true;
            try {
                const res = await KanbanApi.getNewestTyphoon() as any;
                typhoneList_Current.value = (res.data.rows || []).map((i: any) => {
                    const item = JSON.parse(i.Info)[0];
                    return item;
                }).filter((item: any) => !!item);

                if (currentTab.value === 1 && typhoneList_Current.value?.length) {
                    currentTyphon.value = typhoneList_Current.value[0];
                }
            } finally {
                currentLoading.value = false;
            }
        }

        // 历史台风列表
        const typhoneList_History = ref<any[]>([]);
        const historyYearOptions = ref<number[]>(
            Array.from("0".repeat(6)).map((i, index) =>
                new Date().getFullYear() + index - 5
            ).reverse()
        );
        const historyQuery = reactive({
            Year: new Date().getFullYear()
        });
        const historyLoading = ref(false);
        // 获取历史台风数据
        const getHistoryTyphon = async () => {
            historyLoading.value = true;
            try {
                const res = await KanbanApi.GetTyphoonHistory(historyQuery) as any;
                typhoneList_History.value = (res.data.rows || []).map((i: any) => {
                    const item = JSON.parse(i.Info)[0];
                    return item;
                }).filter((item: any) => !!item);

                if (currentTab.value === 2 && typhoneList_History.value?.length) {
                    currentTyphon.value = typhoneList_History.value[0];
                }
            } finally {
                historyLoading.value = false;
            }


            // old
            // const res = await TyphonApi.getHistoryTyphonList() as any;
            // typhoneList_History.value = res.data.rows;

            // if (currentTab.value === 2 && typhoneList_History.value?.length) {
            //     currentTyphon.value = typhoneList_History.value[0];
            // }
        }
        watch(() => historyQuery.Year, (val) => {
            getHistoryTyphon();
        });



        // 展示的台风列表
        const typhonList = computed(() => {
            if (currentTab.value === 1) {
                return typhoneList_Current.value;
            } else if (currentTab.value === 2) {
                return typhoneList_History.value;
            }
        });

        // 标签页切换默认选中第一个台风
        // watch(currentTab, (val) => {
        //     currentTyphon.value = val === 1 ? typhoneList_Current.value[0] : typhoneList_History.value[0];
        // })

        // 初始化
        onMounted(() => {
            getHistoryTyphon();
            getCurrentTyphon();
        });

        // 台风列表项点击事件
        const handleItemClick = (i: any) => {
            currentTyphon.value = i;
        }

        // 是否显示台风路径
        const showTyphonPath = computed({
            get() {
                return store.state.WeatherView.typhonMapVisible;
            },
            set(val) {
                store.commit(ActionType.SET_TYPHON_PATH_TOGGLE, val);
            }
        });

        return {
            showTyphonPath,
            typhonList,
            tabItems,
            currentTab,
            currentTyphon,
            currentLoading,
            handleItemClick,
            historyQuery,
            historyYearOptions,
            historyLoading
        }
    },
});
</script>

<style lang="scss">
.Taifeng {
    .tabs {
        position: relative;
        .app-tabs {
            .app-tab-item {
                margin:0 .02rem;
                font-size: .13rem;
            }
        }
        .path-switch {
            position: absolute;
            right: 0rem;
            top: 50%;
            transform: translate3d(0, -50%, 0);
            &__label {
                font-size: 0.12rem;
                .yw-icon {
                    margin-right: 0.02rem;
                }
                opacity: 0.9;
            }
            .el-switch {
                --el-switch-off-color: rgb(78, 83, 90);
                transform: scale(0.9);
            }
        }
    }

    .tf-list {
        padding: 0.1rem 0.1rem;
        // position: relative;

        &__inner {
            height: 0.96rem;
            overflow-y: auto;
        }
        &__item {
            height: 0.3rem;
            display: flex;
            border: 0.02rem solid transparent;
            align-items: center;
            padding: 0 0.2rem;
            margin-bottom: 0.02rem;
            transition: all 0.2s ease;
            cursor: pointer;
            font-size: 0.14rem;
            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            &.is--active {
                border-color: rgba(255, 255, 255, 0.3);
                background-color: rgba(0, 0, 0, 0.3);
            }

            .item-code {
                width: 0.7rem;
            }
            .item-name {
            }
        }

        &.is--has-menu {
            display: flex;
            align-items: center;
            .tf-list-menu {
                height: 0.96rem;
                width: 0.5rem;
                flex: none;
                background-color: rgb(14, 23, 39);
                text-align: center;
                overflow-y: auto;
                padding: 0.04rem 0;
                // background-color: red;
                &__item {
                    height: 0.24rem;
                    line-height: 0.24rem;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    &:hover {
                        color: rgba(255, 255, 255, 0.8);
                    }
                    &.is--active {
                        color: $colorPrimary;
                    }
                }
            }
            .tf-list__inner {
                padding-left: 0.1rem;
                flex: 1;
            }
        }
    }
    .border {
        position: relative;
        width: 100%;
        @include linearBorder(bottom, 100%, 0.02rem);
    }

    .tf-points-list {
        height: 2.7rem;
        margin-top: 0.1rem;
        position: relative;
        .el-table {
            --el-table-background-color: rgba(0, 0, 0, 0.1);
            --el-table-header-font-color: rgb(82, 168, 255);

            .el-table__header {
                background-color: rgba(0, 0, 0, 0.3);
            }

            border-radius: 0.06rem;
            overflow: hidden;
        }
    }
}
</style>
