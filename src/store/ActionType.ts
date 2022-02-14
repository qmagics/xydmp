export enum ActionType {
    /** 设置全局船舶模式 */
    SET_GLOBAL_SHIP_MODE = 'SET_GLOBAL_SHIP_MODE',


    /** 设置船舶信息映射表 */
    SET_SHIP_MAP = 'SET_SHIP_MAP',



    /** 设置船舶列表信息 */
    SET_SHIP_LIST = 'SET_SHIP_LIST',



    /** 切换船舶工具栏显隐 */
    TOGGLE_SHIP_TOOLBAR = 'TOGGLE_SHIP_TOOLBAR',
    /** 设置船舶工具栏3D位置 */
    SET_SHIP_TOOLBAR_D3_POSITION = 'SET_SHIP_TOOLBAR_D3_POSITION',


    /** 切换船只信息面板显隐 */
    TOGGLE_SHIP_INFO_PANEL = 'TOGGLE_SHIP_INFO_PANEL',


    /** 设置当前船只 */
    SET_CURRENT_SHIP = 'SET_CURRENT_SHIP',


    /** 设置船坞列表 */
    SET_CHUANWU_LIST = 'SET_CHUANWU_LIST',

    /** 设置码头列表 */
    SET_MATOU_LIST = 'SET_MATOU_LIST',

    /** 设置建筑列表 */
    SET_BUILDING_LIST = 'SET_BUILDING_LIST',

    /** 设置门机列表 */
    SET_MENJI_LIST = 'SET_MENJI_LIST',


    /** 设置一类模型的状态 */
    SET_MODEL_STATE = 'SET_MODEL_STATE',



    /** 设置设备看板基础信息 */
    SET_BASE_INFO = 'SET_BASE_INFO',


    /** 设置图表层可见切换 */
    SET_CHART_VIEW_TOGGLE = 'SET_CHART_VIEW_TOGGLE',

    /** 设置气象层可见切换 */
    SET_WEATHER_VIEW_TOGGLE = 'SET_WEATHER_VIEW_TOGGLE',

    /** 设置台风路径图是否可见 */
    SET_TYPHON_PATH_TOGGLE = 'SET_TYPHON_PATH_TOGGLE',

    /** 设置当前台风描述对象 (TyphonMap组件会根据此对象渲染台风路径信息) */
    SET_CURRENT_TYPHON_OBJECT = 'SET_CURRENT_TYPHON_OBJECT',


    /** 设置当前潮高 */
    SET_TIDE_HEIGHT = 'SET_TIDE_HEIGHT',


    /** 设置监控视图可见切换 */
    SET_MONITOR_VIEW_TOGGLE = 'SET_MONITOR_VIEW_TOGGLE',

    /** 设置监控视图大小 */
    SET_MONITOR_VIEW_SIZE = 'SET_MONITOR_VIEW_SIZE',

    /** 设置监控当前选中页签 */
    // SET_MONITOR_VIEW_CURRENT_TAB = 'SET_MONITOR_VIEW_CURRENT_TAB'
}