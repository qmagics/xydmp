import { D3Object, getPickedObjByPosition } from '../D3Object';

export default (viewer: any, zccityTool: any) => {
    const handler = new zccity.ScreenSpaceEventHandler(viewer.canvas);

    // 单选模式下，当前选中的对象
    let selectedObj: D3Object = new D3Object();

    // 点击事件
    handler.setInputAction(function (movement: any) {
        const newObj: D3Object = getPickedObjByPosition(movement.position);

        if (newObj) {
            // 取消之前的选中对象
            if (selectedObj.isNotEmpty) {
                selectedObj.setInactive();
            }
            // 新对象设置为高亮
            newObj.setActive();

            // 当前选中对象设为新对象
            selectedObj = newObj;
        }
        else {

        }
    }, zccity.ScreenSpaceEventType.LEFT_CLICK);

    // 右击事件
    handler.setInputAction(function (movement: any) {
        // 取消所有模型的选中
        selectedObj?.setInactive();

    }, zccity.ScreenSpaceEventType.RIGHT_CLICK)
}