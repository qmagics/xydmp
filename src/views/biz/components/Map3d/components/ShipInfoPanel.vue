<template>
    <app-panel
        class="ship-info-panel"
        width="4.2rem"
        height="5rem"
        v-show="ShipInfoPanel.visible"
        v-loading="loading"
    >
        <div class="ship-info-panel__header">
            <div class="header__title">
                <div class="title-text">
                    <yw-icon name="yw-icon-ship"></yw-icon>
                    <span>{{ vm.CnName }}船只详情</span>
                    <yw-icon
                        name="yw-icon-refresh"
                        @click="refreshShip"
                        style="cursor:pointer;margin-left:.1rem;"
                    ></yw-icon>
                </div>
                <app-title-line></app-title-line>
            </div>
            <div class="header__tabs">
                <app-switchs
                    v-model="currentTab"
                    :items="[{ label: '基本信息', value: 1 }, { label: '项目信息', value: 2 }, { label: '人员信息', value: 3 }]"
                ></app-switchs>
            </div>
        </div>

        <div class="ship-info-panel__body">
            <div class="box box1" v-show="currentTab === 1">
                <el-row :gutter="20">
                    <el-col :span="13" class="box-left">
                        <app-lv label="船舶类型：" :value="vm.ShipCategoryName"></app-lv>
                        <app-lv label="IMO：" :value="vm.Imo"></app-lv>
                        <app-lv label="船宽/船长：" :value="`${vm.Width || '-'}/${vm.Length || '-'}`"></app-lv>
                        <app-lv label="总吨位：" :value="vm.TotalTons"></app-lv>
                        <app-lv label="停靠位置：" :value="vm.BerthPositionName"></app-lv>
                        <app-lv label="档位：" :value="vm.BerthGearName"></app-lv>
                    </el-col>
                    <el-col :span="11" class="box-right">
                        <el-image :src="vm.Pic||ship_png"></el-image>
                        <app-lv label="是否无动力：" :value="vm.NoPowerMark ? '是' : '否'"></app-lv>
                        <app-lv label="船向：" :value="vm.BerthDirection"></app-lv>
                    </el-col>
                </el-row>
            </div>
            <div class="box box2" v-show="currentTab === 2">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <app-lv label="项目编号：" :value="vm.Code"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="项目状态：" :value="vm.StatusName"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="预计进厂：" :value="$filters.date(vm.EstimateEnterTime)"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="实际进厂：" :value="$filters.date(vm.ActualEnterTime)"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="总管：" :value="vm.ShipManagerName"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="市场负责人：" :value="vm.MarketDirectorName"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="修理周期：" :value="vm.ConstructionCycle + '天'"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="商务代表：" :value="vm.BusinessRepresentativeName"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="船籍社：" :value="vm.ClassificationSociety"></app-lv>
                    </el-col>
                    <el-col :span="12">
                        <app-lv label="安全主管：" :value="SafeManagerName"></app-lv>
                    </el-col>
                    <el-col :span="24">
                        <app-lv
                            label="工程描述："
                            :value="vm.ProjectDescribe"
                            value-clamp="4"
                            align-items="left"
                        ></app-lv>
                    </el-col>
                </el-row>
            </div>
            <div class="box box3" v-show="currentTab === 3" v-if="vm.TeamInfo">
                <el-row :gutter="10">
                    <el-col :span="10">
                        <app-lv label="施工队/班组：" :value="vm.TeamInfo.TeamCount"></app-lv>
                    </el-col>
                    <el-col :span="7">
                        <app-lv label="上船：">
                            <template #value>
                                <span class="color-success">{{ vm.TeamInfo.AboardCount }}</span>人
                            </template>
                        </app-lv>
                    </el-col>
                    <el-col :span="7">
                        <app-lv label="施工：" :value="vm.TeamInfo.OperatingCount"></app-lv>
                    </el-col>
                </el-row>
                <div class="block-group" v-for="a in vm.TeamInfo.AreaList">
                    <div class="block-group__title">
                        <span>{{ a.Name }}</span>
                        <b>
                            <span class="color-success">{{ a.RealCount }}</span>
                            /
                            <span>{{ a.ShouldCount }}人</span>
                        </b>
                    </div>
                    <el-row class="block-group__item" v-for="g in a.GroupList">
                        <el-col :span="10">{{ g.Name }}</el-col>
                        <el-col :span="7">
                            <app-lv label="实到：">
                                <template #value>
                                    <span class="color-success">{{ g.RealCount }}</span>人
                                </template>
                            </app-lv>
                        </el-col>
                        <el-col :span="7">
                            <app-lv label="应到：" :value="g.ShouldCount + '人'"></app-lv>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </app-panel>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch, nextTick } from 'vue';
import { useStore } from '@/store';
import ship_png from '@/assets/ship.png';
import KanbanApi from '@/api/KanbanApi';

export default defineComponent({
    props: {
        ship: {
            required: true,
            type: Object
        }
    },
    setup(props) {
        const store = useStore();
        const currentTab = ref(1);
        const loading = ref(false);
        const vm = ref<any>({ TeamInfo: {} });

        const refresh = async () => {
            loading.value = true;
            vm.value = {};
            try {
                const { data } = await KanbanApi.getShipDetail(props.ship.ShipRepairProjectId);
                vm.value = data;
            } finally {
                loading.value = false;
            }
        }

        const refreshShip = async () => {
            // 刷新面板
            refresh();

            // 刷新三维船只信息
            const { data } = await KanbanApi.getShipList({ ShipRepairProjectId: props.ship.ShipRepairProjectId });
            const ship = data.rows[0];
            if (ship) {
                RenderShipTools.updateShip(ship);
            }
        }

        watch(() => store.state.ShipInfoPanel.visible, (val) => {
            if (val) {
                nextTick(() => {
                    refresh();
                });
            }
        }, { immediate: true });

        const SafeManagerName = computed(()=>{
            let str = '';

            if(vm.value.ManagerList?.length){
                let one = vm.value.ManagerList.find((i:any)=>i.ManagerConfigName==='安全主管');
                str = one.ManagerName;
            }
            return str;
        })

        return {
            SafeManagerName,
            currentTab,
            ship_png,
            vm,
            loading,
            refreshShip,
            ShipInfoPanel: computed(() => store.state.ShipInfoPanel),
        }
    }
})
</script>

<style lang="scss">
.ship-info-panel {
    position: absolute;
    z-index: 3;
    right: 4.3rem;
    bottom: 0.8rem;
    &__header {
        padding-bottom: 0.06rem;
        position: relative;

        .header__title {
            text-align: center;
            font-size: 0.17rem;
            .yw-icon {
                margin-right: 0.05rem;
            }
        }
        .header__tabs {
            width: 100%;

            .app-switch-item {
                padding: 0 0.26rem !important;
                font-size: 0.14rem;
            }
        }
    }
    &__body {
        display: flex;
        align-items: center;
        .box {
            width: 100%;
            display: flex;
            padding: 0.1rem 0.1rem;
            justify-content: space-between;
            height: 3.6rem;
            overflow-y: auto;
            .el-row {
                width: 100%;
            }
            .app-lv {
                margin-bottom: 0.2rem;
            }
            .el-image {
                width: 1rem;
                height: 1rem;
                border-radius: 0.04rem;
            }
        }

        .box1 {
            .box-right {
                display: flex;
                flex-direction: column;
                .el-image {
                    margin-bottom: 0.2rem;
                }
            }
        }

        .box2 {
            display: block;
        }

        .box3 {
            display: block;
            .app-lv {
                margin-bottom: 0;
            }
            .block-group {
                &__title {
                    padding: 0.05rem 0.1rem;
                    background: rgb(51, 97, 146);
                    display: flex;
                    justify-content: space-between;
                    margin: 0.1rem 0;
                    border-radius: 0.02rem;
                }
                &__item {
                    border-radius: 0.02rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    padding: 0 0.05rem;
                    &:nth-child(2n) {
                        background: rgb(32, 55, 87);
                    }
                }
            }
        }
    }
}
</style>