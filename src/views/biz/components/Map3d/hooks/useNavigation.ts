export default (viewer: any) => {
    // 增加罗盘 and 比例尺
    var options: any = {
        // 用于在使用重置导航重置地图视图时设置默认视图控制。
        defaultResetView: zccity.Cartographic.fromDegrees(122.14323698829696, 29.79153008003149,
            8631),
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        enableCompass: true,
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
        enableZoomControls: true,
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        enableDistanceLegend: true,
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        enableCompassOuterRing: true
    };

    // 指南针插件初始化
    CesiumNavigation.umd(viewer, options);

    // viewer.scene.camera.moveEnd.addEventListener(function () {
    //     //获取当前相机高度
    //     viewer.scene.camera.moveEnd.addEventListener(function () {
    //         var currentMagnitude = viewer.camera.getMagnitude();
    //     })
    // });
}