import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { DispatchStateTypes } from "./state";

export const mutations: MutationTree<DispatchStateTypes> = {
    [MutationTypes.DISPATCH__SET_DIAPATCH_MODE]: (state: DispatchStateTypes, payload) => {
        state.Mode = payload;
    },

    [MutationTypes.DISPATCH__SET_DIAPATCH_SIZE]: (state: DispatchStateTypes, payload) => {
        state.Size = payload;
    },

    [MutationTypes.DISPATCH__SET_DIAPATCH_SCHEME_LIST]: (state: DispatchStateTypes, payload) => {
        state.DispatchSchemeList = payload;
    },

    [MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL]: (state: DispatchStateTypes, payload) => {
        state.CurrentDispatchSchemeDetail = payload;
    },

    [MutationTypes.DISPATCH__SET_CURRENT_DIAPATCH_SCHEME_DETAIL_ITEM]: (state: DispatchStateTypes, payload) => {
        state.CurrentDispatchSchemeDetailItem = payload;
    },

    [MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_ID]: (state: DispatchStateTypes, payload) => {
        state.CurrentShipDispatchSchemeId = payload;
    },
    [MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_NAME]: (state: DispatchStateTypes, payload) => {
        state.CurrentShipDispatchSchemeName = payload;
    },
    [MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_CODE]: (state: DispatchStateTypes, payload) => {
        state.CurrentShipDispatchSchemeCode = payload;
    },

    [MutationTypes.DISPATCH__SET_DIAPATCH_SCHEME_QUERY_CATEGORY]: (state: DispatchStateTypes, payload) => {
        state.DispatchSchemeQuery.Category = payload;
    },
    [MutationTypes.DISPATCH__SET_DIAPATCH_SCHEME_QUERY_DATETIMES]: (state: DispatchStateTypes, payload) => {
        state.DispatchSchemeQuery.DateTimes = payload;
    },
}