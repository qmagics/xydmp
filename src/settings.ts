import { ProjectSettings } from "@/types/settings";

const projectName = "鑫亚船舶修造智慧调控中心";

const settings: ProjectSettings = {
    publicPath: "/big-screen/",

    name: projectName,

    title: projectName,

    shortTitle: projectName,

    /** 高德地图Key */
    amapKey: "04d47a0862dd30972a3207b58ee6cf7d",

    /** 高德地图安全密钥 */
    amapSecurityJsCode: "62be817762c33f37a71cbdf84b704912",

    /** 刷新船舶模型时间间隔 */
    refreshShipInterval: 5 * 60 * 1000,

    /** 图表自动刷新间隔 */
    refreshChartInterval: 5 * 60 * 1000
}
export default settings
