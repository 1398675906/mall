import {ADD_COUNTER,ADD_TO_CAET} from "./mutations-types"
export default {
  //mutations唯一的目的就是为了修改state中的一个状态
  //mutations中的每一个方法尽可能完成的事情比较单一一点
  [ADD_COUNTER](state,payload){
    payload.count++
  },
  [ADD_TO_CAET](state,payload){
    payload.count = 1
    payload.checked=true
    state.cartList.push(payload)
  }
}