import Vue from 'vue'
import Vuex from 'vuex'

import lostPwd from './modules/lospwd'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    lostPwd
  }
})
