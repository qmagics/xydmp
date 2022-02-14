/** 基础信息对象 */
export interface BaseInfoVM {
    /** 员工数量 */
    EmployeeCount: number;

    /** 今日出勤数量 */
    Attendance: number;

    /** 码头停靠数 */
    BerthWharfCount: number;
    /** 码头停靠船只列表 */
    BerthWharfList: any[];

    /** 船坞停靠数 */
    BerthDockCount: number;
    /** 船坞停靠船只列表 */
    BerthDockList: any[];

    /** 锚地停靠数 */
    BerthAnchorageCount: number;
    /** 锚地停靠船只列表 */
    BerthAnchorageList: any[];

    /** xxx */
    SailCount: number;

    /** xxx */
    RepairproCount: number;

    /** 船只总数 */
    ShipAllCount: number;
    /** 船只列表 */
    ShipAllList: any[],

    /** 厂房数 */
    BuildingCount: number;
    /** 厂房列表 */
    BuildingList: any[];

    /** 码头数 */
    WharfCount: number;
    /** 码头列表 */
    WharfList: any[];

    /** 船坞数 */
    DockCount: number;
    /** 船坞列表 */
    DockList: any[];

    /** 锚地数 */
    AnchorageCount: number;
    /** 锚地列表 */
    AnchorageList: any[];

    /** 门机数 */
    CraneCount: number;
    /** 门机列表 */
    CraneList: any[];

    /** 监控数 */
    CameraCount: number;
    /** 监控列表 */
    CameraList: any[];
}

/** 
 * 静态模型类别（BizDsDock 船坞、 BizDsWharf 码头、BizDsAnchorage 锚地、BizDsCrane 门机、BizDsCamera 监控、BizDsBitt 缆桩、BizDsHouse 房屋）; 
 */
export type StaticModelType = 'BizDsDock' | 'BizDsWharf' | 'BizDsAnchorage' | 'BizDsCrane' | 'BizDsCamera' | 'BizDsBitt' | 'BizDsHouse';