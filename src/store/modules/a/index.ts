import { Module } from 'vuex'
import RootStateTypes from '@/store/interface';
import ModuleATypes from './interface';

export default {
    namespaced: true,
    state: {
        name: "A000"
    },
} as Module<ModuleATypes, RootStateTypes>