import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);
export const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    state: {
        user: null,
        loggedIn: false,
        conversation: [
            {
                role: 'system',
                content: 'You are an expert in encryption, files, and file systems.'
            },
        ]
    },
    actions: {
        ADD_USER({ commit }, user) {
            commit('SET_USER', user);
        },

        SET_LOGGED_IN({ commit }, loggedIn) {
            commit('SET_LOGIN', loggedIn);
        },

        LOGOUT({ commit }) {
            commit('SET_LOGOUT');
        },

        ADD_CONVERSATION({ commit }, convo){
            commit('SET_CONVERSATION', convo)
        },

        CLEAR_CONVERSATION({ commit }){
            commit('CLEAR_CONVERSATION')
        }
    },

    mutations: {

        SET_LOGIN(state, loggedIn) {
            state.loggedIn = loggedIn;
        },

        SET_USER(state, user) {
            state.user = user;
        },

        SET_LOGOUT(state) {
            state.user = null;
            state.loggedIn = false;
            sessionStorage.clear();
        },

        SET_CONVERSATION(state, convo){
            state.conversation = convo
        },

        CLEAR_CONVERSATION(state){
            state.conversation = [
                {
                    role: 'system',
                    content: 'You are an expert in encryption, files, and file systems.'
                },
            ]
        }
    },

    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        conversation: state => state.conversation
    },
});
