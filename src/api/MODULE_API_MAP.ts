import { RequestResponse } from "@/types/request"
import request from "@/utils/request";

// 工序档案
const Procedure = {
    /** 获取工序列表 */
    getProcedureList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getProcedure`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取工序树 */
    getProcedureTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getProcedureTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 存货档案
const Stock = {
    /** 获取存货列表 */
    getStockList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getStock`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取存货树 */
    getStockTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getStockTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 工位档案
const Workplace = {
    /** 获取工位列表 */
    getWorkplaceList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getWorkplace`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取工位树 */
    getWorkplaceTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getWorkplaceTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 工作中心
const WorkCenter = {
    /** 获取工作中心列表 */
    getWorkplaceList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getWorkCenter`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取工作中心树 */
    getWorkplaceTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getWorkCenterTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 客户
const Customer = {
    /** 获取客户列表 */
    getCustomer(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getCustomer`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取客户树 */
    getCustomerTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getCustomerTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 委外商
const Supplier = {
    /** 获取客户列表 */
    getSupplierList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getSupplier`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取客户树 */
    getSupplierTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getSupplierTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 生产部门
const BizOrg = {
    /** 获取部门树 */
    getBizOrgTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getOrg`,
            method: 'get',
            params
        })
    }
}

// 工艺路线
const ProcessRoute = {
    /** 获取工艺路线列表 */
    getProcessRouteList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getProcessRoute`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取工艺路线详情 */
    getProcessRouteDetail(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getProcessRouteDetail`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    }
}

// 模具档案
const Mould = {
    /** 获取模具档案列表 */
    getMouldList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getMould`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取模具档案树 */
    getSupplierTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getMouldTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 设备档案
const Equipment = {
    /** 获取设备列表 */
    getEquipmentList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getEquipment`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取设备树 */
    getEquipmentTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getEquipmentTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 货位档案
const Location = {
    /** 获取货位列表 */
    getLocationList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getLocation`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },
    /** 获取货位树 */
    getLocationTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getLocationTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }
}

// 职员档案
const Staff = {
    /** 获取职员列表 */
    getStaffList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetStaff`,
            method: 'get',
            params
        })
    },
    /** 获取基础职员列表 */
    getBasicStaffList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetStaffInfo`,
            method: 'get',
            params
        })
    },
    /** 获取职员树 */
    getStaffTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetStaffCategory`,
            method: 'get',
            params
        })
    }
}


// 模具镶块
const MouldStockStandard = {
    /** 获取模具镶块列表 */
    getMouldStockStandardList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetMouldStockStandard`,
            method: 'get',
            params
        })
    },
}


// 生产任务单
const ProductionOrder = {
    /** 获取生产任务单列表 */
    getProductionOrderList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetProductionOrder`,
            method: 'get',
            params
        })
    },
}

// 工序排程
const ProcessProcedure = {
    /** 获取生产任务单列表 */
    getProcessProcedureList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetBizProductionOrderProcessProcedure`,
            method: 'get',
            params
        })
    },
}


// 工位生产任务
const ProductionTask = {
    /** 获取工位生产任务列表 */
    getWorkplaceTaskList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetBizWorkplaceTask`,
            method: 'get',
            params
        })
    },

    /** 获取工位生产任务列表 */
    getWorkplaceTaskDetail(this: any, id: string) {
        return request({
            url: `${this.baseUrl}/GetBizWorkplaceTaskDetail`,
            method: 'get',
            params: {
                ProductionTaskDetailsId: id
            }
        })
    },
}

// 生产需求订单
const RequirementOrder = {
    /** 获取生产任务单列表 */
    getRequirementOrderList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetRequirementOrder`,
            method: 'get',
            params
        })
    },
}


// 采购订单
const PurchaseOrder = {
    /** 获取生产任务单列表 */
    getPurchaseOrderList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetPurchaseOrder`,
            method: 'get',
            params
        })
    },
}


// 箱码打印
const BoxCodePrinting = {
    /** 获取生产任务单列表 */
    getBoxCodePrintingList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetBoxCodePrinting`,
            method: 'get',
            params
        })
    },
}

// 工具档案
const Tool = {
    /** 获取工具列表 */
    getToolList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getTool`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },

    /** 获取工具树 */
    getToolTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getToolTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    },
}


// 不合格原因
const QualityRejectReason = {
    /** 获取不合格原因列表 */
    getQualityRejectReasonList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getQualityRejectReason`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },

    /** 获取不合格原因树 */
    getQualityRejectReasonTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getQualityRejectReasonTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    },
}


// 检验方案
const QualityInspectionPlan = {
    /** 获取检验方案列表 */
    getInspectionSchemeList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetQualityInspectionPlan`,
            method: 'get',
            params: {
                Nature: 2,
                ...params
            }
        })
    },

    /** 获取检验方案树 */
    getInspectionSchemeTree(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetStockTree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    },

    /** 获取检验方案列表2 */
    getQualityInspectionPlanList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/getQualityInspectionPlan`,
            method: 'get',
            params
        })
    },
}

// 工位任务
const StationTask = {
    /** 获取工位任务列表 */
    getStationTaskList(this: any, params: any) {
        return request({
            url: `${this.baseUrl}/GetProductionTaskDetails`,
            method: 'get',
            params
        })
    },
}

export default {
    baseUrl: "/api",
    ...Procedure,
    ...Stock,
    ...Workplace,
    ...WorkCenter,
    ...Customer,
    ...Supplier,
    ...BizOrg,
    ...ProcessRoute,
    ...Mould,
    ...Equipment,
    ...Location,
    ...Staff,
    ...MouldStockStandard,
    ...ProductionOrder,
    ...ProcessProcedure,
    ...ProductionTask,
    ...RequirementOrder,
    ...PurchaseOrder,
    ...BoxCodePrinting,
    ...Tool,
    ...QualityRejectReason,
    ...QualityInspectionPlan,
    ...StationTask,
}