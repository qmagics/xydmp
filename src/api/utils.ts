import MODULE_API_MAP from "./MODULE_API_MAP";

export function buildXApi(baseUrl: string) {
    MODULE_API_MAP.baseUrl = baseUrl;

    return MODULE_API_MAP;
}