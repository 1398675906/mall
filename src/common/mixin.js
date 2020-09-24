import {debounce} from "common/utils";
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMinxin = {
	data(){
		return{
			itemLister:null,
			newreFresh:null
		}
	},
	mounted(){
		this.newreFresh = debounce(this.$refs.scroll.refresh, 50)
		this.itemLister = ()=>{
			this.newreFresh()
		}
		this.$bus.$on('itemImageLoad',this.itemLister)
		// console.log("我是混入")
	}
}

export  const backTopMixin = {
	components:{
		BackTop
	},
	data(){
		return {
			isShowBackTop:false
		}
	},
	methods:{
		backClick(){
			this.$refs.scroll.scrollTo(0, 0)
		},
		listenShowTop(position){
			//  3.是否显示回到顶部
			this.isShowBackTop = -position.y>1000
		}
	}
}

