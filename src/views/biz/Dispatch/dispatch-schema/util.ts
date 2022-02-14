import { DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";

export const BeforeTextFnMap: { [key: string | number]: Function } = {
    // 码头
    1: (item: DispatchSchemeDetailItem) => {
        const { BeforeBerthPositionName, BeforeBerthGearName, BeforeBerthDirection } = item;
        console.log('BeforeBerthGearName',BeforeBerthGearName)
        return `${BeforeBerthPositionName}${BeforeBerthGearName}(${BeforeBerthDirection})`;
    },

    // 船坞
    2: (item: DispatchSchemeDetailItem) => {
        const { BeforeBerthPositionName, BeforeBerthDirection } = item;
        return `${BeforeBerthPositionName}(${BeforeBerthDirection})`;
    },

    // 锚地
    3: (item: DispatchSchemeDetailItem) => {
        return item.BeforeBerthPositionName;
    }
}

export const AfterTextFnMap: { [key: string | number]: Function } = {
    // 码头
    1: (item: DispatchSchemeDetailItem) => {
        const { AfterBerthPositionName, AfterBerthGearName, AfterBerthDirection } = item;
        return `${AfterBerthPositionName}${AfterBerthGearName}(${AfterBerthDirection})`;
    },

    // 船坞
    2: (item: DispatchSchemeDetailItem) => {
        const { AfterBerthPositionName, AfterBerthDirection } = item;
        return `${AfterBerthPositionName}(${AfterBerthDirection})`;
    },

    // 锚地
    3: (item: DispatchSchemeDetailItem) => {
        return item.AfterBerthPositionName;
    }
}

export const STATUS_MAP: any = {
    1: 'secondary',
    2: 'success',
    3: 'primary'
}