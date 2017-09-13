import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
  	 weekdiscuss:{
  	 	title:'我是默认的',
  	 	yes:0,
  	 	no:0,
  	 	message:0,
  	 	zan:0,
  	 	isvote:false
  	 }
  },
  mutations:{
  	 change(state,obj){
  	 	state.weekdiscuss.title = obj.title;
        state.weekdiscuss.yes = obj.yes;
        state.weekdiscuss.no = obj.no;
        state.weekdiscuss.message = obj.message;
        state.weekdiscuss.zan = obj.zan;
        state.weekdiscuss.isvote = obj.isvote
  	 },
  	 vote(state,type){
  	 	type ? state.weekdiscuss.yes++ : state.weekdiscuss.no++;
  	 	state.weekdiscuss.isvote = true;      
  	 }
  }
})