import {debounce} from "common/utils";
export const itemListenerMinxin = {
	data(){
		return{
			itemLister:null
		}
	},
	mounted(){
		const refresh = debounce(this.$refs.scroll.refresh, 50)
		this.itemLister = ()=>{
			refresh()
		}
		this.$bus.$on('itemImageLoad',this.itemLister)
		// console.log("我是混入")
	}
}