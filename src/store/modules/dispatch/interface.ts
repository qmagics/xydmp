import { Store as VuexStore, CommitOptions, DispatchOptions } from 'vuex';
import { state, DispatchStateTypes } from './state';

export type DispatchStoreModuleTypes = {
    [K in keyof DispatchStateTypes]: DispatchStateTypes[K]
}

// [K in keyof DispatchStateTypes]: DispatchStateTypes[K]

// export type UserStoreModuleTypes<S = UserStateTypes> = Omit<
//     VuexStore<S>,
//     'commit' | 'getters' | 'dispatch'
// >
//     &
// {
//     commit<
//         K extends keyof UserMutationsTypes,
//         P extends Parameters<UserMutationsTypes[K]>[1]
//     >(
//         key: K,
//         payload?: P,
//         options?: CommitOptions
//     ): ReturnType<UserMutationsTypes[K]>;
// } &
//     {
//         // overwrite state
//         // 注意!!! 注意!!! 注意!!! 此处如果不进行合并，在实际代码提示中会多出一个state层。
//         // store.state.user.state.name
//         // 为了能够有更加完善的提示，把state放到此处进行重写。
//         // store.state.user.name (具体实现，依旧会保留有多一个state提示，如果无法保障正确使用，建议使用getter)
//         [K in keyof UserStateTypes]: UserStateTypes[K];
//     }
//     & {
//         dispatch<K extends keyof UserActionsTypes>(
//             key: K,
//             payload?: Parameters<UserActionsTypes[K]>[1],
//             options?: DispatchOptions
//         ): ReturnType<UserActionsTypes[K]>;
//     };