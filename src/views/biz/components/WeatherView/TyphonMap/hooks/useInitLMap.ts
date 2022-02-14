// pk.eyJ1IjoicW1hZ2ljcyIsImEiOiJja3hpYjhpbGw0N2FnMnJvNTUwbGx6azJmIn0.GMjKnHhb3EqhaN04wIajyg
import { useStore } from '@/store';
import { TyphonObject } from '@/types/biz';
import { onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import { createTyphoon } from '../typhon';

// 注册地图图层
(() => {
    const providers: any = {
        GaoDe: {
            Normal: {
                Map: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
            },
            Satellite: {
                Map: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                Annotion: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
            },
            Subdomains: ["1", "2", "3", "4"]
        },

        Google: {
            Normal: {
                Map: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            },
            Terrain: {
                // Map: "http://www.google.cn/maps/vt?lyrs=t@189&gl=cn&x={x}&y={y}&z={z}",
                Map: "http://mt0.google.cn/vt/lyrs=t@132,r@292000000&hl=zh-CN&gl=cn&src=app&x={x}&y={y}&z={z}&scale=2&s=Gal",
                Annotion: "http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}&scale=2&s="
            },
            Satellite: {
                Map: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
                Annotion: "http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}&scale=2&s="
            },
            Subdomains: []
        },

        Arcgis: {
            Normal: {
                Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
                Color: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer/tile/{z}/{y}/{x}",
                PurplishBlue: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
                Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
                Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
                Cold: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetCold/MapServer/tile/{z}/{y}/{x}"
            }, Satellite: {
                Map: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                Annotion: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            },
            Subdomains: []

        },

        Open: {
            Normal: {
                Map: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
            },
            Subdomains: []
        }
    };

    L.TileLayer.ChinaProvider = L.TileLayer.extend({
        initialize: function (type: any, options: any) { // (type, Object)
            var parts = type.split('.');

            var providerName = parts[0];
            var mapName = parts[1];
            var mapType = parts[2];

            var url = providers[providerName][mapName][mapType];
            options.subdomains = providers[providerName].Subdomains;

            L.TileLayer.prototype.initialize.call(this, url, options);
        }
    });

    L.tileLayer.chinaProvider = function (type: any, options: any) {
        return new L.TileLayer.ChinaProvider(type, options);
    };
})();

// 创建预警线
const createWarningLine = (map: any) => {
    //24小时警戒线
    var poline24 = [[34, 127], [22, 127], [18, 119], [11, 119], [4.5, 113], [0, 105]];

    var jj24Layer = L.polyline(
        [poline24], { color: '#d0d008', weight: '1.5' }
    ).addTo(map);

    var content = "<div style='color:#ee8c06'>24小时警戒线</div>";

    var myIcon = L.divIcon({
        html: content,
        className: 'my-div-icon',
        iconSize: 10
    });

    //中心点位
    L.marker([31, 127], { icon: myIcon }).addTo(map);

    //48小时警戒线
    var poline48 = [[34, 132], [15, 132], [0, 120], [0, 105]]
    var jj48Layer = L.polyline(
        [poline48], { color: '#949312', weight: '2', dashArray: [5, 6] }
    ).addTo(map);

    var content1 = "<div style='color:#55b839;'>48小时警戒线</div>";

    var myIcon = L.divIcon({
        html: content1,
        className: 'my-div-icon',
        iconSize: 10
    });

    //中心点位
    L.marker([28, 132], { icon: myIcon }).addTo(map);
}

export default (elRef: Ref<HTMLDivElement>) => {
    const store = useStore();
    const { typhonMapCenter, typhonMapZoom } = store.state.WeatherView;
    const mapInstance = ref();
    let isFirst = true;
    let tf: any = null;

    const initMap = (cb?: Function) => {
        // 高德卫星图
        const GaoDeSatelliteMap_Layer = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
            maxZoom: 18,
            minZoom: 0
        });

        // 高德标注图
        const GaoDeSatelliteAnnotion_Layer = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
            maxZoom: 18,
            minZoom: 0
        });

        // 初始化 地图
        mapInstance.value = L.map(elRef.value, {
            center: [...typhonMapCenter].reverse(),
            zoom: typhonMapZoom,
            layers: [GaoDeSatelliteMap_Layer, GaoDeSatelliteAnnotion_Layer]
        });

        createWarningLine(mapInstance.value);

        // 触发回调
        cb && cb();
    }

    const destroyMap = () => {
        mapInstance.value?.remove();
        mapInstance.value = null;
    }

    const renderTyohoon = (ty: TyphonObject) => {
        if (isFirst) {
            isFirst = false;
            tf = createTyphoon(mapInstance.value, L, 0, [ty]);
        }
        else {
            destroyTyphoon();
            destroyMap();
            initMap(() => {
                tf = createTyphoon(mapInstance.value, L, 0, [ty]);
            })
        }
    }

    const destroyTyphoon = () => {
        if (tf) {
            tf.deleteTyphoon();
            tf = null;
        }
    }

    onBeforeUnmount(() => {
        destroyMap();
        destroyTyphoon();
    });

    return {
        initMap,
        mapInstance,
        renderTyohoon
    }
}