<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentSroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :commentInfo="commentInfo" ref="comment"></detail-comment-info>
      <goods-list :goods="recommends" ref="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import GoodsList from 'components/content/goods/GoodsList'


  import Scroll from 'components/common/scroll/Scroll'

  import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'

  import { itemListenerMinxin,backTopMixin } from 'common/mixin'
  import { debounce } from '../../common/utils'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMinxin,backTopMixin],//混入
    data () {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTop:null,
        currentIndex:0,

      }
    },
    created () {
      // 1.保存传入的iid
      this.iid = this.$route.query.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        // console.log(res);
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //  6.取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

      })

      //  3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

    //  4给getThemeTop赋值,对给this.themeTopYs赋值操作进行防抖
      this.getThemeTop = debounce(()=>{
        //根据最新数据，对应的DOM是已经被渲染出来
        //但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
        //offset值不对的时候，都是因为图片的问题
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        //直接给个最大值
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      },50)
    },
    mounted () {

    },
    methods: {
      //监听详情图片的加载
      imageLoad () {
        // this.$refs.scroll.refresh()
        this.newreFresh()


        //  全部渲染完就会执行这个回调函数
        // this.$nextTick(() => {
        // })

        this.getThemeTop()
      },
      titleClick (index) {
        // console.log(index)

        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
      contentSroll(position){
      //  1.获取y值
        const positionY = -position.y

      //  2.positionY 和主题中的值进行对比
      //   console.log(Number.MAX_VALUE)
        let length = this.themeTopYs.length
        for(let i=0;i<length-1;i++){

          if (this.currentIndex!==i&&(positionY>this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
          }

          // if (this.currentIndex!==i&&((i<length-1&&positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])||(i===length-1&&positionY>=this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   // console.log(this.currentIndex)
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
        this.listenShowTop(position)
      },
      addToCart(){
      //  1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid


      //  2.将商品添加到购物车
      //   this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product)
      }

    },

    deactivated () {
      //  没有缓存 不会调用
    },
    destroyed () {
      this.$bus.$off('itemImageLoad', this.itemLister)
    }

  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
