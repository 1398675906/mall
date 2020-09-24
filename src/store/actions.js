import {ADD_COUNTER,ADD_TO_CAET} from "./mutations-types"

export default {
  addCart({state,commit},payload){
    //payload  新添加的商品
    let oldProduct = state.cartList.find((item)=>{
      return item.iid === payload.iid
    })

    //2.判断oldProduct
    if(oldProduct){
      commit(ADD_COUNTER,oldProduct)
    }else{
      commit(ADD_TO_CAET,payload)
    }

  }
}