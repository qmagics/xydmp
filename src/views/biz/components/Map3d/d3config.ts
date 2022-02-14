
/** 3D对象标签默认属性 */
export const LABEL_STYLE = {
    font: 'normal 32px Microsoft YaHei',
    style: zccity.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth: 7,
    outlineColor: new zccity.Color(0, 0, 0, 0.6),
    fillColor: zccity.Color.WHITE,
    verticalOrigin: zccity.VerticalOrigin.BOTTOM,
    horizontalOrigin: zccity.HorizontalOrigin
        .CENTER, //水平位置
    //中心位置
    pixelOffset: new zccity.Cartesian2(0, -10),
    scale: 0.5,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
}

/** 3D模型GIF图标配置表 */
export const MODEL_ICON_GIF_MAP = {
    Building: "/big-screen/IMG/building.gif",
    Chuanwu: "/big-screen/IMG/docker.gif",
    Jiankong: "/big-screen/IMG/camera.gif",
    Langzhuang: "",
    Longmendiao: "",
    Mao: "/big-screen/IMG/anchor.gif",
    Matou: "/big-screen/IMG/wharf.gif",
    Menji: "/big-screen/IMG/machine.gif",
    Ship: "/big-screen/IMG/ship.gif"
}

/** 选中墙样式 */
export const WALL_STYLE = {
    material: zccity.Color.YELLOW.withAlpha(0.8),
    outline: true,
    outlineColor: zccity.Color.BLACK.withAlpha(0.1)
}
