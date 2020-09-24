import Vue from 'vue'
import Vuex from  'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//安装插件
Vue.use(Vuex)


//挂载
export default new Vuex.Store({
  state:{
      cartList:[]//保存商品信息
  },
  mutations,
  actions,
  getters
})

