import { Module } from 'vuex'
import RootStateTypes from '@/store/interface';
import ModuleBTypes from './interface';

export default {
    namespaced: true,
    state: {
        age: 20
    },
} as Module<ModuleBTypes, RootStateTypes>