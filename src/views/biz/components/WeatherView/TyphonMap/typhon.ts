import { store } from '@/store';

import tf_png from '@/assets/tf.png';
import RK_RDDY from '@/assets/RK_RDDY.png';
import RK_RDFB from '@/assets/RK_RDFB.png';
import RK_QRDFB from '@/assets/RK_QRDFB.png';
import RK_TF from '@/assets/RK_TF.png';
import RK_QTF from '@/assets/RK_QTF.png';
import RK_CQTF from '@/assets/RK_CQTF.png';

const RK_MAP: any = {
    "热带低压": RK_RDDY,
    "热带风暴": RK_RDFB,
    "强热带风暴": RK_QRDFB,
    "台风": RK_TF,
    "强台风": RK_QTF,
    "超强台风": RK_CQTF,
}

const COUNTRY_COLOR = {
    CHN: "rgb(255,60,78)",
    HK: "rgb(254,189,0)",
    JP: "rgb(36,188,0)",
    TW: "rgb(255,0,254)",
    USA: "rgb(4,250,247)",
}

const CIRCLE_COLOR = {
    7: "rgb(238, 160, 29)",
    10: "rgb(172,123,51)",
    12: "rgb(218,149,36)"
}

//计算出台风所有需要的数据对象
function dataHandler(typhoonTestData) {
    //获取台风坐标点数据对象
    var forecast = typhoonTestData[0]['points'];
    //定义折线点数据的新数组
    var polylinePoints = []; //主点线坐标
    var radius = {}; //主所有风圈信息、点中信息
    var pointlayerImage = {}; //主点图片信息
    //台风名称
    var typhoonName = typhoonTestData[0].name; //台风name
    var typhoonNumber = typhoonTestData[0].tfid; //台风编号
    var mainlandForecastList = []; //大陆预测线经纬度
    var mainlandForecastinfo = {}; //大陆预测点信息
    var japanForecastList = []; //日本预测点经纬度
    var japanForecastinfo = {}; //日本预测点信息
    var taiwanForecastList = []; //台湾预测点经纬度
    var taiwanForecastinfo = {}; //台湾预测点信息
    var usaForecastList = []; //美国预测点经纬度
    var usaForecastinfo = {}; //美国预测点信息
    var hkForecastList = []; //美国预测点经纬度
    var hkForecastinfo = {}; //美国预测点信息
    //找到经纬度数据，存放在新数组中
    for (var i = 0; i < forecast.length; i++) {
        var points = forecast[i];
        polylinePoints.push([Number(points['lat']), Number(points['lng'])])
        var typhoon_Rank_name = points.strong;
        var typhoonImage = TyphoonImageRank(typhoon_Rank_name)

        radius[i] = {
            radius7: points.radius7,
            radius10: points.radius10,
            radius12: points.radius12,
            lat: points.lat,
            lng: points.lng,
            movedirection: points.movedirection,
            movespeed: points.movespeed,
            power: points.power,
            pressure: points.pressure,
            speed: points.speed,
            strong: points.strong,
            time: points.time,
            name: typhoonName,
            number: typhoonNumber
        }

        // 台风强度变化后的首个节点方法显示
        let iconSize = [8, 8];
        const pre = forecast[i - 1];
        if (pre?.strong && pre.strong !== points.strong) {
            iconSize = [12, 12];
        }

        pointlayerImage[i] = {
            icon: L.icon({
                iconUrl: typhoonImage,
                iconSize,
                className: 'tf-key-point'
            })
        }
        //添加预测点线的经纬度
        if (i == forecast.length - 1) {
            var forecastPointData = forecast[i].forecast
            forecastPointData.forEach((item, index, arr) => {
                if (item.tm == "中国") {
                    item.forecastpoints.forEach((item, index) => {
                        mainlandForecastList.push([Number(item.lat), Number(item.lng)])
                        mainlandForecastinfo[index] = {
                            lat: item.lat,
                            lng: item.lng,
                            power: item.power,
                            pressure: item.pressure,
                            speed: item.speed,
                            strong: item.strong,
                            time: item.time,
                            tm: "中国",
                            name: typhoonName,
                            number: typhoonNumber
                        };
                    });
                } else {
                    if (item.tm == "日本") {
                        item.forecastpoints.forEach((item, index) => {
                            japanForecastList.push([Number(item.lat), Number(item.lng)])
                            japanForecastinfo[index] = {
                                lat: item.lat,
                                lng: item.lng,
                                power: item.power,
                                pressure: item.pressure,
                                speed: item.speed,
                                strong: item.strong,
                                time: item.time,
                                tm: "日本",
                                name: typhoonName,
                                number: typhoonNumber
                            };
                        });
                    } else {
                        if (item.tm == "美国") {
                            item.forecastpoints.forEach((item, index) => {
                                usaForecastList.push([Number(item.lat), Number(item.lng)])
                                usaForecastinfo[index] = {
                                    lat: item.lat,
                                    lng: item.lng,
                                    power: item.power,
                                    pressure: item.pressure,
                                    speed: item.speed,
                                    strong: item.strong,
                                    time: item.time,
                                    tm: "美国",
                                    name: typhoonName,
                                    number: typhoonNumber
                                };
                            });
                        } else {
                            if (item.tm == "中国台湾") {
                                item.forecastpoints.forEach((item, index) => {
                                    taiwanForecastList.push([Number(item.lat), Number(item.lng)])
                                    taiwanForecastinfo[index] = {
                                        lat: item.lat,
                                        lng: item.lng,
                                        power: item.power,
                                        pressure: item.pressure,
                                        speed: item.speed,
                                        strong: item.strong,
                                        time: item.time,
                                        tm: "中国台湾",
                                        name: typhoonName,
                                        number: typhoonNumber
                                    };
                                });
                            } else {
                                if (item.tm == "中国香港") {
                                    item.forecastpoints.forEach((item, index) => {
                                        hkForecastList.push([Number(item.lat), Number(item.lng)])
                                        hkForecastinfo[index] = {
                                            lat: item.lat,
                                            lng: item.lng,
                                            power: item.power,
                                            pressure: item.pressure,
                                            speed: item.speed,
                                            strong: item.strong,
                                            time: item.time,
                                            tm: "中国香港",
                                            name: typhoonName,
                                            number: typhoonNumber
                                        };
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    var info = {
        polylinePoints: polylinePoints,
        radius: radius,
        pointlayerImage: pointlayerImage,
        typhoonName: typhoonName,
        typhoonNumber: typhoonNumber,
        mainlandForecastList: mainlandForecastList,
        mainlandForecastinfo: mainlandForecastinfo,
        japanForecastList: japanForecastList,
        japanForecastinfo: japanForecastinfo,
        taiwanForecastList: taiwanForecastList,
        taiwanForecastinfo: taiwanForecastinfo,
        usaForecastList: usaForecastList,
        usaForecastinfo: usaForecastinfo,
        hkForecastList: hkForecastList,
        hkForecastinfo: hkForecastinfo
    };
    return info;
};

function TyphoonImageRank(typhoon_Rank_name) {
    return RK_MAP[typhoon_Rank_name] || RK_TF;
}

export const createTyphoon = function (map: any, L: any, typhoonNum: number, typhoonTestData: any, AgencyIsShow: any = { 中国: true, 美国: true, 日本: true, 中国台湾: true, 中国香港: true }) {
    const { typhonMapCenter, typhonMapZoom } = store.state.WeatherView;
    var Agency = AgencyIsShow
    var typhoon = {}
    var typhoonList = []; // 已经加载的台风路径数组
    // 全部扇形对象
    var primitives = {}
    var tyPrimitives = [];
    var myLayerGroupline = new L.LayerGroup(); //主点线清除方法
    var myLayerGrouppoint = new L.LayerGroup(); //主点清除方法
    var myLayerGroupmode = new L.LayerGroup(); //模型标签
    var myLayerchinaforceline = new L.LayerGroup(); //中国预测线段
    var myLayerchinaforcepoint = new L.LayerGroup(); //中国预测线点
    var myLayerjapanforcepoint = new L.LayerGroup(); //日本预测点
    var myLayerjapanforceline = new L.LayerGroup(); //日本预测线
    var myLayertaiwanforcepoint = new L.LayerGroup(); //台湾预测点
    var myLayertaiwanforceline = new L.LayerGroup(); //台湾预测线
    var myLayerAmericanforcepoint = new L.LayerGroup(); //美国预测点
    var myLayerAmericanforceline = new L.LayerGroup(); //美国预测线
    var myLayerHKforcepoint = new L.LayerGroup(); //香港预测点
    var myLayerHKforceline = new L.LayerGroup(); //香港预测线
    var timer;
    typhoonList = {
        myLayerGroupline: myLayerGroupline,
        myLayerGrouppoint: myLayerGrouppoint,
        myLayerGroupmode: myLayerGroupmode,
        myLayerchinaforceline: myLayerchinaforceline,
        myLayerchinaforcepoint: myLayerchinaforcepoint,
        myLayerjapanforcepoint: myLayerjapanforcepoint,
        myLayerjapanforceline: myLayerjapanforceline,
        myLayertaiwanforcepoint: myLayertaiwanforcepoint,
        myLayertaiwanforceline: myLayertaiwanforceline,
        myLayerAmericanforcepoint: myLayerAmericanforcepoint,
        myLayerAmericanforceline: myLayerAmericanforceline,
        myLayerHKforcepoint: myLayerHKforcepoint,
        myLayerHKforceline: myLayerHKforceline
    }
    var TyphoonAllInfo = dataHandler(typhoonTestData);
    console.log("TyphoonAllInfo", TyphoonAllInfo)
    var allpoints = TyphoonAllInfo.polylinePoints;
    var polyline = L.polyline(allpoints, { color: "#00BFFF" }).addTo(map);
    map.fitBounds(polyline.getBounds(), { maxZoom: typhonMapZoom });
    map.removeLayer(polyline);
    var pointlayerImage = TyphoonAllInfo.pointlayerImage;
    var radius = TyphoonAllInfo.radius;
    var typhoonNumber = TyphoonAllInfo.typhoonNumber;
    var typhoonName = TyphoonAllInfo.typhoonName;
    var mainlandForecastList = TyphoonAllInfo.mainlandForecastList;
    var mainlandForecastinfo = TyphoonAllInfo.mainlandForecastinfo;
    var japanForecastList = TyphoonAllInfo.japanForecastList;
    var japanForecastinfo = TyphoonAllInfo.japanForecastinfo;
    var taiwanForecastList = TyphoonAllInfo.taiwanForecastList;
    var taiwanForecastinfo = TyphoonAllInfo.taiwanForecastinfo;
    var usaForecastList = TyphoonAllInfo.usaForecastList;
    var usaForecastinfo = TyphoonAllInfo.usaForecastinfo;
    var hkForecastList = TyphoonAllInfo.hkForecastList;
    var hkForecastinfo = TyphoonAllInfo.hkForecastinfo;
    animateDrawLine()
    //动态绘制折线
    function animateDrawLine() {

        myLayerGroupline.clearLayers();
        myLayerGrouppoint.clearLayers();
        myLayerGroupmode.clearLayers();
        myLayerchinaforceline.clearLayers();
        myLayerchinaforcepoint.clearLayers();
        myLayerjapanforcepoint.clearLayers();
        myLayerjapanforceline.clearLayers();
        myLayertaiwanforcepoint.clearLayers();
        myLayertaiwanforceline.clearLayers();
        myLayerAmericanforcepoint.clearLayers();
        myLayerAmericanforceline.clearLayers();
        myLayerHKforcepoint.clearLayers();
        myLayerHKforceline.clearLayers();
        // var marker
        var markermode
        var lineLayer
        var pointLayer
        var labellayer
        var length = allpoints.length;
        //定义用来存放递增元素的经纬度数据
        var drawPoints = [];
        var count = 0;
        var typhoonIcon = L.icon({
            iconUrl: tf_png,
            iconSize: [28, 28],
            // iconAnchor: [15, 15]
        });
        //添加台风编号
        var typhoonIconfirst = L.icon({
            // iconUrl: 'img/blankImage.png',
            iconUrl: tf_png,
            iconSize: [20, 20]
        });
        labellayer = L.marker([radius[0].lat, radius[0].lng], {
            icon: typhoonIconfirst,
            title: "",
            riseOnHover: true,
            keyboard: true,
            className: 'tf-key-point'
        }).bindTooltip(typhoonNumber + "-" + typhoonName, {
            direction: 'right',
            offset: [10, 0],
            permanent: true,
            opacity: "1",
            className: "labelName"
        }).openTooltip();
        myLayerGrouppoint.addLayer(labellayer);
        map.addLayer(myLayerGrouppoint);
        //定时器100ms，动态的塞入坐标数据
        timer = setInterval(
            function () {
                //循环台风路径中的每个点，设置定时器依次描绘
                if (count < length) {
                    drawPoints.push(allpoints[count]);
                    count++;
                    //清除之前绘制的折线图层
                    if (lineLayer && count !== length) {
                        map.removeLayer(lineLayer);
                        lineLayer = null;
                    }
                    //清除之前的marker图层
                    if (markermode && count !== length) {
                        map.removeLayer(markermode);
                        markermode = null;
                    }
                    if (tyPrimitives.length != 0) {
                        romovecircle()
                    }
                    //最新数据点drawPoints绘制折线
                    lineLayer = L.polyline(drawPoints, { color: "#00BFFF", weight: 2 })
                    myLayerGroupline.addLayer(lineLayer);
                    map.addLayer(myLayerGroupline);

                    //根据最新的数据组最后一个绘制marker
                    if (count === length) {
                        map.removeLayer(markermode);
                        // drawForecastPointLine()
                        if (Agency.中国 == true)
                            drawForecastChinaPointLine()

                        if (Agency.中国台湾 == true)
                            drawForecastTaiWanPointLine()
                        if (Agency.日本 == true)
                            drawForecastJapanPointLine()
                        if (Agency.美国 == true)
                            drawForecastUSAPointLine()
                        if (Agency.中国香港 == true)
                            drawForecastHKPointLine()
                        drawSingleCircle(drawPoints[count - 1], count - 1)
                        pointLayer = L.marker(drawPoints[count - 1], { icon: pointlayerImage[count - 1].icon, className: 'tf-key-point' });

                        myLayerGrouppoint.addLayer(pointLayer);
                        map.addLayer(myLayerGrouppoint);
                        //如果是路径最后一个点，自动弹出信息框
                        markermode = L.marker(drawPoints[length - 1], {
                            icon: L.divIcon({
                                className: "dIcon",
                                html: `<div class="live"><img src="${tf_png}"></div>`,
                                iconSize: [15, 15],
                                iconAnchor: [20, 20]
                            })
                        }).bindPopup(
                            getTyphoonInfoHtml(radius[count - 1], "主点"), {
                            offset: [0, 0],
                            className: "typhoonInfo"
                        }
                        ).closePopup();
                        myLayerGroupmode.addLayer(markermode);
                        map.addLayer(myLayerGroupmode);
                    } else {

                        drawSingleCircle(drawPoints[count - 1], count);

                        // console.log("drawPoints[count - 1]", drawPoints[count - 1]);

                        pointLayer = L.marker(drawPoints[count - 1], {
                            icon: pointlayerImage[count - 1].icon,
                            title: "",
                            riseOnHover: true,
                            keyboard: true,
                            className: "tf-key-point"
                        }).bindPopup(
                            getTyphoonInfoHtml(radius[count - 1], "主点"), {
                            offset: [0, 0],
                            className: "typhoonInfo"
                        }).closePopup();

                        myLayerGrouppoint.addLayer(pointLayer);
                        map.addLayer(myLayerGrouppoint);

                        //取已绘制点数组中最后一个点，放置台风标志
                        markermode = L.marker(drawPoints[count - 1], {
                            icon: typhoonIcon
                        });
                        myLayerGroupmode.addLayer(markermode);
                        map.addLayer(myLayerGroupmode);
                    }

                } else {
                    //取完数据后清除定时器
                    clearInterval(timer);
                }
            }, 50);
    }
    //返回台风中样式html
    function getTyphoonInfoHtml(info, Pointtype) {
        var html = ``;
        if (Pointtype == "主点") {
            const radius7 = info.radius7.split('|').map(Number);
            // var radius10 = info.radius10.split('|')
            // var radius12 = info.radius12.split('|')

            html = ` <div class="typhone_info">
                <div class="info_title">
                    <h3>${info.number}-${info.name} &nbsp;&nbsp; <small>${new Date(info.time).format('yyyy-MM-dd H时')}</small></h3>
                </div>
                <ul class="info_list">
                    <li>
                        <span>中心位置</span>
                        <p>${info.lng}° / ${info.lat}°</p>
                    </li>
                    <li>
                        <span>风速风力</span>
                        <p>${info.speed != "" ? info.speed : "0"} 米/秒，${info.power}级(${info.strong})</p>
                    </li>
                    <li>
                        <span>中心气压</span>
                        <p>${info.pressure != "" ? info.pressure : "0"} 百帕</p>
                    </li>
                    <li class="info_forecast">
                        <span>移速移向</span>
                        <p>${info.speed != "" ? info.speed : "0"}公里/小时，${info.movedirection}</p>
                    </li>
                    <li>
                        <span>七级半径</span>
                        <p>${Math.min.apply(null, radius7)}~${Math.max.apply(null, radius7)} 公里</p>
                    </li>
                </ul>
            </div>`;
        } else {
            html = `
            <div class="typhone_info is--yuce">
                <div class="info_title">
                    <h3>${info.tm} <small>${new Date(info.time).format('yyyy-MM-dd H时')} 预报</small></h3>
                </div>
                <ul class="info_list">
                    <li>
                        <span>当前位置</span>
                        <p>${info.lng}° / ${info.lat}°</p>
                    </li>
                    <li>
                        <span>中心气压</span>
                        <p>${info.pressure != "" ? info.pressure : "0"} 百帕</p>
                    </li>
                    <li>
                        <span>最大风速</span>
                        <p>${info.speed != "" ? info.speed : "0"} 米/秒</p>
                    </li>
                    <li>
                        <span>最大风力</span>
                        <p>${info.strong}</p>
                    </li>
                </ul>
            </div>`;
        }

        return html;
    }

    //清除单个风圈
    function romovecircle() {
        for (var j = 0; j < tyPrimitives.length; j++) {
            map.removeLayer(tyPrimitives[j]);
        }
        tyPrimitives = [];
    }
    //绘制中国预测点和线
    function drawForecastChinaPointLine() {
        var chinaforceline = L.polyline(mainlandForecastList, { weight: 1, className: 'mainlandtestSvg', color: COUNTRY_COLOR.CHN, dashArray: [10, 5] });
        myLayerchinaforceline.addLayer(chinaforceline);
        map.addLayer(myLayerchinaforceline);
        mainlandForecastList.forEach((item, index) => {
            if (index != 0) {
                var strong = mainlandForecastinfo[index].strong;
                var Image = TyphoonImageRank(strong)
                var forcePointImage = L.icon({
                    iconUrl: Image,
                    iconSize: [8, 8],
                    className: 'tf-key-point'
                });

                var mainlandforcePoint = L.marker(item, { icon: forcePointImage }).bindPopup(
                    getTyphoonInfoHtml(mainlandForecastinfo[index], "预测点"), {
                    offset: [0, 0],
                    className: "typhoonForecastInfo"
                }
                ).closePopup()

                myLayerchinaforcepoint.addLayer(mainlandforcePoint);
                map.addLayer(myLayerchinaforcepoint);
            }

        });
    }
    //绘制日本预测点和线
    function drawForecastJapanPointLine() {
        var japanforceline = L.polyline(japanForecastList, { weight: 1, className: 'japantestSvg', color: COUNTRY_COLOR.JP, dashArray: [10, 5] });
        myLayerjapanforceline.addLayer(japanforceline);
        map.addLayer(myLayerjapanforceline);
        japanForecastList.forEach((item, index) => {
            if (index != 0) {
                var strong = japanForecastinfo[index].strong;
                var Image = TyphoonImageRank(strong)
                var forcePointImage = L.icon({
                    iconUrl: Image,
                    iconSize: [8, 8],
                    className: 'tf-key-point'
                });
                var japanPoint = L.marker(item, { icon: forcePointImage }).bindPopup(
                    getTyphoonInfoHtml(japanForecastinfo[index], "预测点"), {
                    offset: [0, 0],
                    className: "typhoonForecastInfo"
                }
                ).closePopup();
                myLayerjapanforcepoint.addLayer(japanPoint);
                map.addLayer(myLayerjapanforcepoint);
            }

        });
    }

    function drawForecastUSAPointLine() {
        var Americanforceline = L.polyline(usaForecastList, { weight: 1, className: 'japantestSvg', color: COUNTRY_COLOR.USA, dashArray: [10, 5] });
        myLayerAmericanforceline.addLayer(Americanforceline);
        map.addLayer(myLayerAmericanforceline);
        usaForecastList.forEach((item, index) => {
            if (index != 0) {
                var strong = usaForecastinfo[index].strong;
                var Image = TyphoonImageRank(strong)
                var forcePointImage = L.icon({
                    iconUrl: Image,
                    iconSize: [8, 8],
                    className: 'tf-key-point'
                });

                var usaPoint = L.marker(item, { icon: forcePointImage }).bindPopup(
                    getTyphoonInfoHtml(usaForecastinfo[index], "预测点")

                    , {
                        offset: [0, 0],
                        className: "typhoonForecastInfo"
                    }
                ).closePopup();
                myLayerAmericanforcepoint.addLayer(usaPoint);
                map.addLayer(myLayerAmericanforcepoint);
            }

        });
    }

    function drawForecastTaiWanPointLine() {
        var taiwanforceline = L.polyline(taiwanForecastList, { weight: 1, className: 'japantestSvg', color: COUNTRY_COLOR.TW, dashArray: [10, 5] });
        myLayertaiwanforceline.addLayer(taiwanforceline);
        map.addLayer(myLayertaiwanforceline);
        taiwanForecastList.forEach((item, index) => {
            if (index != 0) {
                var strong = taiwanForecastinfo[index].strong;
                var Image = TyphoonImageRank(strong)
                var forcePointImage = L.icon({
                    iconUrl: Image,
                    iconSize: [8, 8],
                    className: 'tf-key-point'
                });
                var taiwanPoint = L.marker(item, { icon: forcePointImage }).bindPopup(
                    getTyphoonInfoHtml(taiwanForecastinfo[index], "预测点")

                    , {
                        offset: [0, 0],
                        className: "typhoonForecastInfo"
                    }
                ).closePopup();
                myLayertaiwanforcepoint.addLayer(taiwanPoint);
                map.addLayer(myLayertaiwanforcepoint);
            }

        });

    }

    function drawForecastHKPointLine() {
        var HKforceline = L.polyline(hkForecastList, { weight: 1, className: 'japantestSvg', color: COUNTRY_COLOR.HK, dashArray: [10, 5] });
        myLayerHKforceline.addLayer(HKforceline);
        map.addLayer(myLayerHKforceline);
        hkForecastList.forEach((item, index) => {
            if (index != 0) {
                var strong = hkForecastinfo[index].strong;
                var Image = TyphoonImageRank(strong)
                var forcePointImage = L.icon({
                    iconUrl: Image,
                    iconSize: [8, 8],
                    className: 'tf-key-point'
                });
                var HKPoint = L.marker(item, { icon: forcePointImage }).bindPopup(
                    getTyphoonInfoHtml(hkForecastinfo[index], "预测点")

                    , {
                        offset: [0, 0],
                        className: "typhoonForecastInfo"
                    }
                ).closePopup();
                myLayerHKforcepoint.addLayer(HKPoint);
                map.addLayer(myLayerHKforcepoint);
            }

        });

    }
    //绘制单个风圈（7，10，12级）
    function drawSingleCircle(latlng, count) {
        var radius7 = radius[count].radius7;
        var radius10 = radius[count].radius10;
        var radius12 = radius[count].radius12;
        var radius7 = radius7.split('|')
        var radius10 = radius10.split('|')
        var radius12 = radius12.split('|')
        //绘制七级风圈
        if (radius7.length > 1) {
            var radiusNorthEast7 = radius7[0] / 100
            var radiusSouthEast7 = radius7[1] / 100
            var radiusNorthWast7 = radius7[2] / 100
            var radiusSouthWest7 = radius7[3] / 100
            var primitiveFill = new setvisible(latlng, radiusNorthEast7, "NorthEast", CIRCLE_COLOR[7])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthEast7, "SouthEast", CIRCLE_COLOR[7])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusNorthWast7, "NorthWest", CIRCLE_COLOR[7])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthWest7, "SouthWest", CIRCLE_COLOR[7])
            tyPrimitives.push(primitiveFill);
        }
        //绘制十级风圈
        if (radius10.length > 1) {
            var radiusNorthEast10 = radius10[0] / 100
            var radiusSouthEast10 = radius10[1] / 100
            var radiusNorthWast10 = radius10[2] / 100
            var radiusSouthWest10 = radius10[3] / 100
            primitiveFill = new setvisible(latlng, radiusNorthEast10, "NorthEast", CIRCLE_COLOR[10])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthEast10, "SouthEast", CIRCLE_COLOR[10])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusNorthWast10, "NorthWest", CIRCLE_COLOR[10])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthWest10, "SouthWest", CIRCLE_COLOR[10])
            tyPrimitives.push(primitiveFill);
        }
        if (radius12.length > 1) {
            //绘制十二级风圈
            var radiusNorthEast12 = radius12[0] / 100
            var radiusSouthEast12 = radius12[1] / 100
            var radiusNorthWast12 = radius12[2] / 100
            var radiusSouthWest12 = radius12[3] / 100
            primitiveFill = new setvisible(latlng, radiusNorthEast12, "NorthEast", CIRCLE_COLOR[12])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthEast12, "SouthEast", CIRCLE_COLOR[12])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusNorthWast12, "NorthWest", CIRCLE_COLOR[12])
            tyPrimitives.push(primitiveFill);
            primitiveFill = new setvisible(latlng, radiusSouthWest12, "SouthWest", CIRCLE_COLOR[12])
            tyPrimitives.push(primitiveFill);
        }
    }
    //绘制台风风圈方法
    var setvisible = function (latlng, semiMinorAxis, anglex, color) {
        var anglexdirection = {
            NorthEast: [0, 90],
            SouthEast: [90, 180],
            SouthWest: [180, 270],
            NorthWest: [270, 360]
        };
        var points3 = getPoints(latlng, semiMinorAxis, anglexdirection[anglex][0], anglexdirection[anglex][1], 1000);
        var primitiveFill = new L.polygon(points3, {
            color: color,
            fillColor: color,
            fillOpacity: 0.4,
            opacity: 0.4,
            weight: 1,
            smoothFactor: 0,
            // strokeWidth: 10,
            // strokeColor: "red",
        }).addTo(map);
        return primitiveFill;

        function getPoints(center, radius, startAngle, endAngle, pointNum) {
            var sin;
            var cos;
            var x;
            var y;
            var angle;
            var points = new Array();
            points.push(center);
            for (var i = 0; i <= pointNum; i++) {
                angle = startAngle + (endAngle - startAngle) * i / pointNum;
                sin = Math.sin(angle * Math.PI / 180);
                cos = Math.cos(angle * Math.PI / 180);
                y = center[0] + radius * cos;
                x = center[1] + radius * sin;
                points[i] = [y, x];
            }
            var point = points;
            point.push(center);
            return point;
        }
    }

    typhoon.deleteTyphoon = function () {
        clearInterval(timer);
        romovecircle()
        myLayerGroupline.clearLayers();
        myLayerGrouppoint.clearLayers();
        myLayerGroupmode.clearLayers();
        myLayerchinaforceline.clearLayers();
        myLayerjapanforceline.clearLayers();
        myLayertaiwanforceline.clearLayers();
        myLayerAmericanforceline.clearLayers();
        myLayerchinaforcepoint.clearLayers();
        myLayertaiwanforcepoint.clearLayers();
        myLayerAmericanforcepoint.clearLayers();
        myLayerjapanforcepoint.clearLayers();
        myLayerHKforcepoint.clearLayers();
        myLayerHKforceline.clearLayers();
    }

    /**
     * 预测路线是否显示
     */
    typhoon.forecastingAgencyIsShow = function (agency, isShow) {
        switch (agency) {
            case '中国':
                if (isShow === true) {
                    drawForecastChinaPointLine()
                } else {
                    myLayerchinaforceline.clearLayers();
                    myLayerchinaforcepoint.clearLayers();
                }
                break
            case '日本':
                if (isShow === true) {
                    drawForecastJapanPointLine()
                } else {
                    myLayerjapanforceline.clearLayers();
                    myLayerjapanforcepoint.clearLayers();
                }
                break
            case '美国':
                if (isShow === true) {
                    drawForecastUSAPointLine()
                } else {
                    myLayerAmericanforcepoint.clearLayers();
                    myLayerAmericanforceline.clearLayers();
                }
                break
            case '中国台湾':
                if (isShow === true) {
                    drawForecastTaiWanPointLine()
                } else {
                    myLayertaiwanforceline.clearLayers();
                    myLayertaiwanforcepoint.clearLayers();
                }
                break
            case '中国香港':
                if (isShow === true) {
                    drawForecastHKPointLine()
                } else {
                    myLayerHKforcepoint.clearLayers();
                    myLayerHKforceline.clearLayers();
                }
                break
        }
    }

    /**
     * 是否重播
     */
    typhoon.Replay = function (AgencyIsShow) {
        Agency = AgencyIsShow;
        this.deleteTyphoon();
        animateDrawLine()
    }

    return typhoon;
}