import { cameraFlyTo, getShipFromStoreById } from "../Map3d/utils";

export const RowClickEventHandlers: Record<string, (row: any) => void> = {
    Changfang(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);

        // todo: 设置图标高亮
        // viewer.entities.getById("8fd48170-3ad4-4efc-a597-0225f7e247d9").billboard.image='/big-screen/IMG/building-select.gif'
    },
    Matou(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);
    },
    Chuanwu(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);
    },
    Chuanzhi(row: any) {
        const { ShipRepairProjectId } = row;
        if (ShipRepairProjectId) {
            const shipInfo = getShipFromStoreById(ShipRepairProjectId);
            const { x, y } = shipInfo.swparam;
            cameraFlyTo(x, y);
        }
    },
    Maodi(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);

    },
    Shebei(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);
    },
    Jiankong(row: any) {
        const { X, Y } = row;
        const x = Number(X), y = Number(Y);

        cameraFlyTo(x, y);
    },
}