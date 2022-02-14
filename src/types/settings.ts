export type ProjectSettings = {
    publicPath: string,
    
    /** 名称 */
    name: string

    /** 标题 */
    title: string

    /** 短标题 */
    shortTitle: string

    /** 首页颜色表 */
    homeMenuColors?: string[],

    /** 高德地图Key */
    amapKey: string,

    /** 高德地图安全密钥 */
    amapSecurityJsCode: string;

    /** 刷新船舶模型时间间隔 */
    refreshShipInterval: number,

    /** 刷新图表时间间隔 */
    refreshChartInterval: number
}