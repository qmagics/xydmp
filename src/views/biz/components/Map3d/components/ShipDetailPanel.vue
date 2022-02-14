<template>
    <div class="ship-detail-panel">
        <div class="ship-detail-panel__header">
            <div class="header-left">
                <yw-icon name="yw-icon-ship"></yw-icon>
                <span>{{ vm.CnName }}</span>
            </div>
            <div class="header-right">
                <app-switchs
                    v-model="currentTab"
                    :items="[{ label: '基本信息', value: 1 }, { label: '调度情况', value: 2 }]"
                ></app-switchs>
            </div>
        </div>
        <div class="ship-detail-panel__body">
            <div class="box" v-show="currentTab === 1">
                <div class="box__left">
                    <el-image :src="ship_png"></el-image>
                </div>
                <div class="box__right">
                    <app-lv label="xxx：" value="xxxxxxxxxxxxxxx"></app-lv>
                    <app-lv label="xxx：" value="xxxxxxxxxxxxxxx"></app-lv>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <app-lv label="xxx：" value="xxxxxxxxxx"></app-lv>
                        </el-col>
                        <el-col :span="12">
                            <app-lv label="xxx：" value="xxxxxxxxxx"></app-lv>
                        </el-col>
                    </el-row>
                    <app-lv label="xxx：" value="xxxxxxxxxxxxxxx"></app-lv>
                    <app-lv label="xxx：" value="xxxxxxxxxxxxxxx"></app-lv>
                </div>
            </div>
            <div class="box" v-show="currentTab === 2">
                <div class="box__left">
                    <el-image :src="ship_png"></el-image>
                </div>
                <div class="box__right">
                    <app-lv label="计划开始：" value="2021.03.26 10：20"></app-lv>
                    <app-lv label="计划结束：" value="2021.03.26 10：20"></app-lv>
                    <el-row class="row1">
                        <!-- <el-col :span="2">
                            <yw-icon name="yw-icon-point"></yw-icon>
                        </el-col>-->
                        <el-col :span="24">
                            <span>6号码头2档（左）</span>
                            <yw-icon style="font-size:.12rem;" name="yw-icon-arrow-right-outline"></yw-icon>
                            <span>2号船坞（艏进）</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <app-lv label="原偏移：" value="3米"></app-lv>
                        </el-col>
                        <el-col :span="12">
                            <app-lv label="目标偏移：" value="11米"></app-lv>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import ship_png from '@/assets/ship.png';

export default defineComponent({
    props: {
        ship: {
            required: true,
            type: Object
        }
    },
    setup(props) {
        const currentTab = ref(1);

        const vm = computed(() => props.ship || {});

        return { currentTab, ship_png, vm }
    }
})
</script>

<style lang="scss">
.ship-detail-panel {
    &__header {
        padding-bottom: 0.06rem;
        display: flex;
        position: relative;
        @include linearBorder(bottom);
        align-items: center;
        justify-content: space-between;

        .header-left {
            font-size: 0.17rem;
            .yw-icon {
                margin-right: 0.1rem;
                font-size: 0.2rem;
                color: $colorPrimaryLight;
            }
            span {
            }
        }
        .header-right {
            .app-switchs {
                .app-switch-item {
                    font-size: 0.14rem;
                }
            }
        }
    }
    &__body {
        height: 1.3rem;
        display: flex;
        align-items: center;
        .box {
            display: flex;
            &__left {
                display: flex;
                align-items: center;
                height: 1.2rem;
                .el-image {
                    width: 1.2rem;
                    height: 1rem;
                    border-radius: 0.04rem;
                }
            }
            &__right {
                overflow-x: hidden;
                padding: 0.1rem 0 0 0.1rem;
                height: 1.2rem;
                overflow-y: auto;

                .el-row {
                    margin-bottom: 0.02rem;
                    margin-top: 0.02rem;
                }
                .row1 {
                    .el-col {
                        @include text-clamp(1);
                    }
                    .yw-icon {
                        font-size: 0.16rem;
                        margin-right: 0.04rem;
                    }
                    span {
                        color: $colorPrimaryLight;
                    }
                }
            }
        }
    }
}
</style>