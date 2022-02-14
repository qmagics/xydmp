import RootStateTypes from "@/store/interface";
import { ActionTree } from "vuex";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";
import { DispatchStateTypes } from "./state";

export const actions: ActionTree<DispatchStateTypes, RootStateTypes> = {
    [ActionTypes.DISPATCH__GET_DIAPATCH_SCHEME_LIST]: ({ commit }, payload) => {
        // commit(MutationTypes.DISPATCH__SET_PLAN_LIST, payload);
    }
}