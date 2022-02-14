import { Module } from 'vuex'
import RootStateTypes from '@/store/interface';
import Map3dStateTypes from './interface';
import state from './state';
import mutations from './mutations';
import actions from './actions';

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
} as Module<Map3dStateTypes, RootStateTypes>