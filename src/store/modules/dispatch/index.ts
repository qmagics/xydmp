import { Module } from 'vuex'
import RootStateTypes from '@/store/interface';
import { DispatchStateTypes, state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

const dispatch: Module<DispatchStateTypes, RootStateTypes> = {
    state,
    getters,
    mutations,
    actions
}

export default dispatch;