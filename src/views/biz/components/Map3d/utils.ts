import { store } from '@/store';
import { CssPosition, D3Position } from './types';

/** 根据船舶Id从Store中获取船只信息 */
export function getShipFromStoreById(id: string) {
    return store.state.ShipMap[id];
}

/** 根据id获取船舶模型 */
export function getShipModelById(id: string) {
    
}

/** D3Position 转化为 CssPosition */
export function getCssPositionFromD3Position(d3Position: D3Position): CssPosition {
    const v = zccity.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, d3Position);
    return {
        left: v.x,
        top: v.y,
    }
}

// 3d相机飞到指定位置
export const cameraFlyTo = (x: number, y: number) => {
    viewer.camera.flyTo({
        destination: zccity.Cartesian3.fromDegrees(x, y, viewer.camera.positionCartographic.height),
        duration: 0.4,
        // orientation: {
        //     heading: zccity.Math.toRadians(0.0),
        //     pitch: zccity.Math.toRadians(0.0),
        //     roll: zccity.Math.toRadians(0.0)
        // }
    });
}
