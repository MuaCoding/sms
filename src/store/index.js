import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './mutation-types'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("USER_TOKEN"),
    spinner: {
      isLoading: !1,
    },
    exp: sessionStorage.getItem("TOKEN_EXP"),
    username: sessionStorage.getItem("USER_NAME"),
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      sessionStorage.setItem("USER_TOKEN", data)
      state.token = data;
    },
    [types.EXP]: (state, data) => {
      sessionStorage.setItem("TOKEN_EXP", data)
      state.exp = data;
    },
    [types.LOGOUT]: (state) => {
      sessionStorage.removeItem('USER_TOKEN');
      sessionStorage.removeItem('TOKEN_EXP');
      state.token = null;
    },
    [types.USERNAME]: (state, data) => {
      console.log(data)
      sessionStorage.setItem("USER_NAME", data)
      state.token = data;
    },
    [types.SET_LOADING]: (state, data) => {
      state.spinner.isLoading = data;
    },
  },
  actions: {

  }
})
