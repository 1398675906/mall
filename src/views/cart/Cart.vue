<template>
  <div>
    <!--导航-->
    <nav-bar class="nav-bar"><div slot="center">购物车({{length}})</div></nav-bar>
    <!--商品列表-->
    <cart-list :cartList="cartList"></cart-list>
    <!--底部汇总-->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'
  import {mapGetters}  from 'vuex'


  export default {
    name: "Cart",
    components: {
      CartList,
    	NavBar,
      CartBottomBar
    },
    computed: {
        //两种用法
        // ...mapGetters(["cartLength","cartList"]),
      ...mapGetters({
        length:"cartLength",
        cartList:"cartList"
      })
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
    position: relative;
    z-index: 9;
  }
</style>
