import { Module } from 'vuex'
import RootStateTypes from '@/store/interface';
import ModuleAppTypes from './interface';

export default {
    namespaced: true,
    state: {
        isHasBottomBar: false
    },
    mutations: {
        SET_IS_HAS_BOTTOM_BAR(state, val) {
            state.isHasBottomBar = val;
        },
    },
    actions: {
        hideBottomBar({ commit }) {
            commit("SET_IS_HAS_BOTTOM_BAR", false);
        },
        showBottomBar({ commit }) {
            commit("SET_IS_HAS_BOTTOM_BAR", true);
        },
    },
    getters: {
        isHasBottomBar: state => state.isHasBottomBar
    }
} as Module<ModuleAppTypes, RootStateTypes>