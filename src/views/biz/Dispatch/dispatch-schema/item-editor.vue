<template>
    <el-dialog custom-class="blur-dialog item-editor" width="9rem" v-model="dlgVisible">
        <app-panel width="100%" height="7rem" v-loading="loading">
            <div class="item-editor__header">
                <div class="title">
                    <template v-if="mode === 'add'">
                        <yw-icon name="yw-icon-add"></yw-icon>&nbsp;新增调度内容
                    </template>
                    <template v-else-if="mode === 'edit'">
                        <yw-icon name="yw-icon-wheel"></yw-icon>&nbsp;修改调度内容
                    </template>
                </div>
                <app-title-line></app-title-line>
            </div>
            <div class="item-editor__body" v-if="!loading">
                <el-form :model="vm" label-width="1.1rem" :rules="rules" ref="formRef">
                    <el-row>
                        <el-col>
                            <el-form-item label="调度类型：" prop="Type">
                                <el-radio-group v-model="vm.Type">
                                    <el-radio label="1">船舶调度</el-radio>
                                    <el-radio label="2">实施运维</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="vm.Type === '1'">
                        <el-col>
                            <el-form-item label="船名：" prop="DispatchShipId">
                                <el-select
                                    class="select--theme-dark"
                                    v-model="vm.DispatchShipId"
                                    size="mini"
                                    @change="onDispatchShipIdChange"
                                >
                                    <!-- :disabled="mode === 'edit'" -->
                                    <el-option
                                        v-for="i in ShipList"
                                        :label="i.CnName"
                                        :value="i.DispatchShipId"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="计划开始：" prop="EstimateDispatchStartTime">
                                <el-date-picker
                                    class="input--theme-dark"
                                    size="mini"
                                    v-model="vm.EstimateDispatchStartTime"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="计划结束：" prop="EstimateDispatchEndTime">
                                <el-date-picker
                                    class="input--theme-dark"
                                    size="mini"
                                    v-model="vm.EstimateDispatchEndTime"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:.1rem" v-if="vm.Type === '1'">
                        <!--原位置-->
                        <el-col :span="11">
                            <div class="position-box">
                                <div class="position-box__title">原位置</div>
                                <el-form-item label="位置类型：" prop="BeforeBerthPositionCategory">
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.BeforeBerthPositionCategory"
                                        size="mini"
                                    >
                                        <el-option
                                            v-for="i in PositionTypes"
                                            :label="i.label"
                                            :value="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="停靠位置：" prop="BeforeBerthPosition">
                                    <!-- 船坞和码头 -->
                                    <el-select
                                        v-if="vm.BeforeBerthPositionCategory === '1' || vm.BeforeBerthPositionCategory === '2'"
                                        class="select--theme-dark"
                                        size="mini"
                                        value-key="value"
                                        :model-value="{ value: vm.BeforeBerthGear, label: vm.BeforeBerthGearName }"
                                        @change="onBeforeBerthGearChange"
                                    >
                                        <el-option-group
                                            v-for="i in PositionList.Before[vm.BeforeBerthPositionCategory]"
                                            :key="i.value"
                                            :label="i.label"
                                        >
                                            <el-option
                                                v-for="j in i.children"
                                                :key="j.value"
                                                :label="j.displayLabel"
                                                :value="j"
                                            >{{ j.label }}</el-option>
                                        </el-option-group>
                                    </el-select>

                                    <!-- 锚点 -->
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.BeforeBerthPosition"
                                        size="mini"
                                        v-else-if="vm.BeforeBerthPositionCategory === '3'"
                                    >
                                        <el-option
                                            v-for="i in PositionList.Before[vm.BeforeBerthPositionCategory]"
                                            :label="i.label"
                                            :value="i.value"
                                            :key="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="船向："
                                    prop="BeforeBerthDirection"
                                    v-if="vm.BeforeBerthPositionCategory !== '3'"
                                >
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.BeforeBerthDirection"
                                        size="mini"
                                    >
                                        <el-option
                                            v-for="i in DirectionList[vm.BeforeBerthPositionCategory]"
                                            :label="i.label"
                                            :value="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="偏移距离：" prop="BeforeBowOffsetDistance">
                                    <el-input-number
                                        class="input--theme-dark"
                                        v-model="vm.BeforeBowOffsetDistance"
                                        size="mini"
                                    ></el-input-number>&nbsp;&nbsp;米
                                </el-form-item>
                            </div>
                        </el-col>
                        <!--目标位置-->
                        <el-col
                            :span="2"
                            style="display: flex;align-items: center;justify-content: center;"
                        >
                            <yw-icon name="yw-icon-arrow-right-circle" style="font-size: .24rem;"></yw-icon>
                        </el-col>
                        <el-col :span="11">
                            <div class="position-box">
                                <div class="position-box__title">目标位置</div>
                                <el-form-item label="位置类型：" prop="AfterBerthPositionCategory">
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.AfterBerthPositionCategory"
                                        size="mini"
                                    >
                                        <el-option
                                            v-for="i in PositionTypes"
                                            :label="i.label"
                                            :value="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="停靠位置：" prop="AfterBerthPosition">
                                    <!-- 船坞和码头 -->
                                    <el-select
                                        v-if="vm.AfterBerthPositionCategory === '1' || vm.AfterBerthPositionCategory === '2'"
                                        class="select--theme-dark"
                                        size="mini"
                                        value-key="value"
                                        :model-value="{ value: vm.AfterBerthGear, label: vm.AfterBerthGearName }"
                                        @change="onAfterBerthGearChange"
                                    >
                                        <el-option-group
                                            v-for="i in PositionList.After[vm.AfterBerthPositionCategory]"
                                            :key="i.value"
                                            :label="i.label"
                                        >
                                            <el-option
                                                v-for="j in i.children"
                                                :key="j.value"
                                                :label="j.displayLabel"
                                                :value="j"
                                            >{{ j.label }}</el-option>
                                        </el-option-group>
                                    </el-select>

                                    <!-- 锚点 -->
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.AfterBerthPosition"
                                        size="mini"
                                        v-else-if="vm.AfterBerthPositionCategory === '3'"
                                    >
                                        <el-option
                                            v-for="i in PositionList.After[vm.AfterBerthPositionCategory]"
                                            :label="i.label"
                                            :value="i.value"
                                            :key="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="船向："
                                    prop="AfterBerthDirection"
                                    v-if="vm.AfterBerthPositionCategory !== '3'"
                                >
                                    <el-select
                                        class="select--theme-dark"
                                        v-model="vm.AfterBerthDirection"
                                        size="mini"
                                    >
                                        <el-option
                                            v-for="i in DirectionList[vm.AfterBerthPositionCategory]"
                                            :label="i.label"
                                            :value="i.value"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="偏移距离：" prop="AfterBowOffsetDistance">
                                    <el-input-number
                                        class="input--theme-dark"
                                        v-model="vm.AfterBowOffsetDistance"
                                        size="mini"
                                    ></el-input-number>&nbsp;&nbsp;米
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row v-if="vm.Type === '2'">
                        <el-col :span="12">
                            <el-form-item label="位置类型：" prop="AfterBerthPositionCategory">
                                <el-select
                                    class="select--theme-dark"
                                    v-model="vm.AfterBerthPositionCategory"
                                    size="mini"
                                >
                                    <el-option
                                        v-for="i in PositionTypes"
                                        :label="i.label"
                                        :value="i.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="停靠位置：" prop="AfterBerthPosition">
                                <el-select
                                    class="select--theme-dark"
                                    v-model="vm.AfterBerthPosition"
                                    size="mini"
                                >
                                    <template
                                        v-for="i in PositionList.After[vm.AfterBerthPositionCategory]"
                                    >
                                        <template v-if="i.isGroup">
                                            <el-option-group :key="i.value" :label="i.label">
                                                <el-option
                                                    v-for="j in i.children"
                                                    :key="j.value"
                                                    :label="j.label"
                                                    :value="i.value"
                                                ></el-option>
                                            </el-option-group>
                                        </template>
                                        <template v-else>
                                            <el-option :label="i.label" :value="i.value"></el-option>
                                        </template>
                                    </template>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="是否停用：" prop="DisabledMark">
                                <el-switch
                                    inactive-color="rgb(94,102,111)"
                                    v-model="vm.DisabledMark"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="调度执行说明：" prop="Remarks">
                                <el-input
                                    type="textarea"
                                    class="input--theme-dark"
                                    v-model="vm.Remarks"
                                    rows="3"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="item-editor__footer" v-if="!loading">
                <el-button type="primary" size="mini" @click="confirm" :loading="submitLoading">确认</el-button>
                <el-button type="info" size="mini" @click="cancel">取消</el-button>
            </div>
        </app-panel>
    </el-dialog>
</template>

<script lang="ts">
import DispatchApi from '@/api/DispatchApi';
import { useStore } from '@/store';
import { $message } from '@/utils';
import { computed, defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import useLoading from '@/hooks/useLoading';

export default defineComponent({
    props: {
        visible: Boolean,

        mode: {
            type: String as PropType<'add' | 'edit'>,
            required: true
        },
    },
    emits: ['update:visible', 'submit-success'],
    setup(props, { emit }) {

        const store = useStore();

        const loading = useLoading();
        const submitLoading = ref(false);

        const formRef = ref();

        // 弹窗可见
        const dlgVisible = computed({
            get: () => props.visible,
            set: v => emit('update:visible', v)
        });

        // 确认
        const confirm = async () => {
            await formRef.value.validate();

            const Api = props.mode === 'add' ? DispatchApi.addSchedulingContent : DispatchApi.updateSchedulingContent;

            try {
                submitLoading.value = true;
                const { data, bl, msg } = await Api(vm as any);
                if (bl) {
                    emit('submit-success', data);
                    dlgVisible.value = false;
                }
                else {
                    $message(msg);
                }
            } finally {
                submitLoading.value = false;
            }
        }

        // 取消
        const cancel = () => {
            dlgVisible.value = false;
        }

        const ShipDispatchSchemeId = computed(() => store.state.Dispatch.CurrentShipDispatchSchemeId);

        const init = () => {
            if (!ShipDispatchSchemeId.value) {
                $message('请选择一条调度方案，再添加调度内容');
                return;
            }

            getShipList();
            getPositionList();

            if (props.mode === 'add') {
                initAdd();
            }
            else if (props.mode === 'edit') {
                initEdit();
            }
        }

        // 新增初始化
        const initAdd = () => {
            vm.ShipDispatchSchemeId = ShipDispatchSchemeId.value as string;
        }

        // 编辑初始化
        const initEdit = () => {
            vm.ShipDispatchSchemeId = ShipDispatchSchemeId.value as string;
            const oldVm = store.state.Dispatch.CurrentDispatchSchemeDetailItem;

            if (oldVm) {
                Reflect.ownKeys(oldVm).forEach((key) => {
                    vm[key] = (oldVm as any)[key];
                });
            }
        }

        // 获取船只列表
        const ShipList = ref<any[]>([]);
        const getShipList = async () => {
            try {
                loading.start('getShipList');
                const { bl, data } = await DispatchApi.getDispatchShipList();

                if (bl) {
                    ShipList.value = data.rows;
                }
            } finally {
                loading.stop('getShipList');
            }
        }

        // 位置类型
        const PositionTypes = ref([
            {
                label: '码头',
                value: '1'
            },
            {
                label: '船坞',
                value: '2'
            },
            {
                label: '锚地',
                value: '3'
            }
        ]);

        // 停靠位置
        const PositionList = reactive({
            Before: {
                1: [],
                2: [],
                3: [],
            } as any,
            After: {
                1: [],
                2: [],
                3: [],
            } as any
        });
        const getPositionList = async () => {
            const p_list = [
                DispatchApi.getBerthPositionList({ BeforeBerthPositionCategory: '1' }),
                DispatchApi.getBerthPositionList({ BeforeBerthPositionCategory: '2' }),
                DispatchApi.getBerthPositionList({ BeforeBerthPositionCategory: '3' }),

                DispatchApi.getBerthPositionList({ AfterBerthPositionCategory: '1' }),
                DispatchApi.getBerthPositionList({ AfterBerthPositionCategory: '2' }),
                DispatchApi.getBerthPositionList({ AfterBerthPositionCategory: '3' })
            ];

            try {
                loading.start('getPositionList');
                const arr = await Promise.allSettled(p_list);
                arr.forEach((item, index) => {
                    if (item.status === 'fulfilled') {
                        if (index === 0) {
                            PositionList.Before[1] = item.value.data.rows.map(i => ({ isGroup: true, label: i.Name, value: i.Id, children: i.list.map((j: any) => ({ label: j.Name, value: j.Id, displayLabel: `${i.Name} - ${j.Name}`, parentValue: i.Id, parentLabel: i.Name })) })) as any;
                        }
                        if (index === 1) {
                            PositionList.Before[2] = item.value.data.rows.map(i => ({ isGroup: true, label: i.Name, value: i.Id, children: i.list.map((j: any) => ({ label: j.Name, value: j.Id, displayLabel: `${i.Name} - ${j.Name}`, parentValue: i.Id, parentLabel: i.Name })) })) as any;
                        }
                        if (index === 2) {
                            PositionList.Before[3] = item.value.data.rows.map((i: any) => ({ label: i.Name, value: i.Id })) as any;
                        }
                        if (index === 3) {
                            PositionList.After[1] = item.value.data.rows.map(i => ({ isGroup: true, label: i.Name, value: i.Id, children: i.list.map((j: any) => ({ label: j.Name, value: j.Id, displayLabel: `${i.Name} - ${j.Name}`, parentValue: i.Id, parentLabel: i.Name })) })) as any;
                        }
                        if (index === 4) {
                            PositionList.After[2] = item.value.data.rows.map(i => ({ isGroup: true, label: i.Name, value: i.Id, children: i.list.map((j: any) => ({ label: j.Name, value: j.Id, displayLabel: `${i.Name} - ${j.Name}`, parentValue: i.Id, parentLabel: i.Name })) })) as any;
                        }
                        if (index === 5) {
                            PositionList.After[3] = item.value.data.rows.map((i: any) => ({ label: i.Name, value: i.Id })) as any;
                        }
                    }
                })
            } finally {
                loading.stop('getPositionList');
            }
        }

        // 目标停靠档位变更
        const onAfterBerthGearChange = (item: any) => {
            vm.AfterBerthGear = item.value;
            vm.AfterBerthGearName = item.label;
            vm.AfterBerthPosition = item.parentValue;
            vm.AfterBerthPositionName = item.parentLabel;
        }

        // 原停靠档位变更
        const onBeforeBerthGearChange = (item: any) => {
            vm.BeforeBerthGear = item.value;
            vm.BeforeBerthGearName = item.label;
            vm.BeforeBerthPosition = item.parentValue;
            vm.BeforeBerthPositionName = item.parentLabel;
        }

        // 船向
        const DirectionList = reactive({
            1: [
                {
                    label: '左靠',
                    value: '左靠'
                },
                {
                    label: '右靠',
                    value: '右靠'
                }
            ] as any[],
            2: [
                {
                    label: '艏进',
                    value: '艏进'
                },
                {
                    label: '艉进',
                    value: '艉进'
                }
            ] as any[],
            3: [

            ] as any[]
        });

        // 船舶调度内容
        const vm = reactive<Record<string | number | symbol, any>>({
            ShipDispatchSchemeId: null,
            DispatchShipId: null,
            EstimateDispatchStartTime: "",
            EstimateDispatchEndTime: "",
            Type: "1",
            BeforeBerthPositionCategory: "",
            BeforeBerthPosition: null,
            BeforeBerthPositionName: "",
            BeforeBerthDirection: "",
            BeforeBowOffsetDistance: 0,
            BeforeBerthGear: null,
            BeforeBerthGearName: "",

            AfterBerthPositionCategory: "",
            AfterBerthPosition: null,
            AfterBerthPositionName: "",
            AfterBerthDirection: "",
            AfterBowOffsetDistance: 0,
            AfterBerthGear: null,
            AfterBerthGearName: "",

            DisabledMark: false,
            Remarks: "",
        });
        const rules = reactive({
            DispatchShipId: {
                required: true,
                message: '船舶是必填项'
            },
            EstimateDispatchStartTime: {
                required: true,
                message: "计划开始时间是必填项"
            },
            EstimateDispatchEndTime: {
                required: true,
                message: "计划结束时间是必填项"
            },
            BeforeBerthPositionCategory: {
                required: true,
                message: "位置类型是必填项"
            },
            BeforeBerthPosition: {
                required: true,
                message: "停靠位置是必填项"
            },
            BeforeBerthDirection: {
                required: true,
                message: "船向是必填项"
            },

            AfterBerthPositionCategory: {
                required: true,
                message: "位置类型是必填项"
            },
            AfterBerthPosition: {
                required: true,
                message: "停靠位置是必填项"
            },
            AfterBerthDirection: {
                required: true,
                message: "船向是必填项"
            },
        });

        // 选择的船舶变更
        const onDispatchShipIdChange = (DispatchShipId: string) => {
            // 获取船舶信息
            const shipInfo = ShipList.value.find(i => i.DispatchShipId === DispatchShipId);

            // 填入原位置信息
            if (shipInfo) {
                const {
                    BeforeBerthDirection,
                    BeforeBerthPosition,
                    BeforeBerthPositionCategory,
                } = shipInfo;

                vm.BeforeBerthPositionCategory = BeforeBerthPositionCategory;
                vm.BeforeBerthPosition = BeforeBerthPosition;
                vm.BeforeBerthDirection = BeforeBerthDirection;
            }
        }

        onMounted(() => {
            init();
        });

        return {
            dlgVisible,
            confirm,
            cancel,
            vm,
            rules,
            ShipList,
            PositionTypes,
            PositionList,
            DirectionList,
            onDispatchShipIdChange,
            loading: loading.value,
            submitLoading,
            onAfterBerthGearChange,
            onBeforeBerthGearChange,
            formRef
        }
    }
});
</script>

<style lang="scss">
$headerHeight: 0.4rem;
$footerHeight: 0.5rem;

.item-editor {
    margin-top: 1rem;

    &__header {
        height: $headerHeight;

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.17rem;
            font-weight: bold;

            .yw-icon {
                font-size: 0.2rem;
            }
        }
    }

    &__body {
        height: calc(100% - #{$headerHeight} - #{$footerHeight});
        overflow-y: auto;
        padding: 0 0.2rem;

        .el-form {
            * {
                color: rgb(228, 228, 228);
            }
            .el-form-item__error {
                color: #f56c6c;
            }
            .el-radio-group {
                height: 0.3rem;
                line-height: 0.3rem;
            }

            .el-input,
            .el-select,
            .el-date-picker {
                width: 100%;
            }
        }
        .el-form-item {
            margin-bottom: 0.08rem;
            &__label {
            }
        }
    }

    &__footer {
        height: $footerHeight;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .icon-btns {
        font-size: 0.16rem;
        .yw-icon {
            margin: 0 0.05rem;
            cursor: pointer;
        }
    }

    .position-box {
        border: 0.02rem solid #656870;
        border-radius: 0.08rem;
        padding: 0.1rem 0;
        height: 2.5rem;

        .el-input,
        .el-select,
        .el-date-picker {
            width: auto;
        }

        &__title {
            color: #fff;
            font-size: 0.17rem;
            text-align: center;
            position: relative;
            height: 0.4rem;
            line-height: 0.4rem;
            &::before,
            &::after {
                position: absolute;
                height: 0.02rem;
                width: 20%;
                content: "";
                top: 50%;
                transform: translateY(-50%);
                background-image: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.4) 50%,
                    rgba(255, 255, 255, 0) 100%
                );
            }
            &::before {
                left: 15%;
            }
            &::after {
                right: 15%;
            }
        }
    }
}
</style>