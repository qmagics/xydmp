import { DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";
import { cameraFlyTo } from "./utils";

// 默认配置
const DEFAULT_OPTIONS = {
    modelColor: new zccity.Color(0, 0, 0, 0.1),
    outLineColor: zccity.Color.WHITE,
    linkWidth: 15,
    linkFlowDuration: 3000,
    scale: 1,
    colorList: [zccity.Color.YELLOW, zccity.Color.BLUE],
}

let models: any[] = [];

/** 显示调度预览效果 - 单次调度模式 */
export const showPreviewEffect = (item: DispatchSchemeDetailItem) => {

    const { BeforeSWparam, AfterSWparam, swurl } = item;

    // 船舶模型
    const shipModel = viewer.entities.add({
        model: {
            uri: swurl,
        }
    });

    const BeforeSWparamNumber = {
        a: Number(BeforeSWparam.a), // 角度,
        sx: Number(BeforeSWparam.sx), // x方向比例
        sy: Number(BeforeSWparam.sy), // y反向比例
        x: Number(BeforeSWparam.x),
        y: Number(BeforeSWparam.y),
        z: Number(BeforeSWparam.z),
    }

    const AfterSWparamNumber = {
        a: Number(AfterSWparam.a), // 角度,
        sx: Number(AfterSWparam.sx), // x方向比例
        sy: Number(AfterSWparam.sy), // y反向比例
        x: Number(AfterSWparam.x),
        y: Number(AfterSWparam.y),
        z: Number(AfterSWparam.z),
    }

    // 预览路径参数
    const routeParams = [
        {
            ...BeforeSWparamNumber,
            scale: DEFAULT_OPTIONS.scale,
            modelColor: DEFAULT_OPTIONS.modelColor,//模型颜色，最后一位为透明度
            outLineColor: DEFAULT_OPTIONS.outLineColor,//模型轮廓颜色
            linkColor: DEFAULT_OPTIONS.colorList[0],//到下一个点的连接线的颜色
            linkWidth: DEFAULT_OPTIONS.linkWidth,//连接线宽度
            linkFlowDuration: DEFAULT_OPTIONS.linkFlowDuration,//连接线流动速度
        },
        {
            ...AfterSWparamNumber,
            scale: DEFAULT_OPTIONS.scale
        }
    ];

    // 参与预览的模型列表
    models = zccityTool.preMoveModel(shipModel, routeParams);

    // 预览效果中心点
    const centerPos = {
        x: (BeforeSWparamNumber.x + AfterSWparamNumber.x) / 2,
        y: (BeforeSWparamNumber.y + AfterSWparamNumber.y) / 2,
    }

    // 相机飞过去
    cameraFlyTo(centerPos.x, centerPos.y);
}

/** 销毁调度预览效果 */
export const destroyPreviewEffect = () => {
    zccityTool.removePreMoveModel(models);
    models = [];
}