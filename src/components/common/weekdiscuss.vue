<template>
   <div class="weekdiscuss">
         <h2 class="weekdiscuss-name">{{old ? '往期话题':'本周热议'}}</h2>
         <div class="weekdiscuss-conwrap">
            <h2 class="weekdiscuss-title">{{value.title}}</h2>
            <ul class="weekdiscuss-vote" ref="count" :class="old?'older':''">
               <li><button type="button" class="yesbtn" v-on:click="vote(0,value.bbsid)">{{value.option_items[0]}}</button><p>
               {{value.result[0]}}票</p></li>
               <li><button type="button" class="nobtn" v-on:click="vote(1,value.bbsid)">{{value.option_items[1]}}</button><p>
               {{value.result[1]}}票</p></li>               
            </ul>
            <div class="old-logo" v-if="old"></div>
         </div>
         <div class="weekdiscuss-foot fix" v-show="isshow">
           <router-link to="/hotweek" class="more fl">查看更多></router-link>
           <div class="fr">
            <router-link :to="{path:'/topicdetial/',query:{bbsid:value.bbsid}}">
             <span class="base-message">{{value.comment_count}}</span>&nbsp;&nbsp;
            </router-link>
             <span v-on:click="zan(0,value.bbsid)" class="base-zan" :class="value.highlight ? 'zan':'' ">{{value.like_count}}</span>
           </div>
         </div>
      </div>
</template>

<script>
export default {
  name: 'weekdiscuss',
  props:{
     value:{
  		type:Object,
  		default:{}
     },
  	 isshow:{//是否显示底下的点赞和更多，首页有
  	 	type:Boolean,
  	 	default:true
  	 },
     old:{//标示显示是往期话题还是本周话题
      type:Boolean,
      default:false
     }
  },
  data(){
    return {      
    }
  },
  methods:{   
  	vote(type,id){ //热议投票
  	   let _this = this; 
       if(this.old){
        this.Toast('话题已结束')
         return;
       }
  	   this.axios.post('/User/topicOption',{bbsid:id,option_result:type}).then(function(res){
  	   	  console.log(res)
  	      if(res.data.state === 200){
              _this.$nextTick(() => {//这里是直接获取元素进行赋值，尝试父组件传递但没有成功或者用vuex
                _this.$refs.count.children[type].children[1].innerHTML = _this.value.result[type] + 1 +'票';
               })              
             _this.Toast('投票成功');
  	      }else{
             _this.Toast(res.data.msg);
  	      }  
  	   }).catch(function(err){
  	     _this.Toast(err);
  	   })	 
  	},
    zan(index,bbsid){
      this.$emit('zan',index,bbsid)  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*热议*/
    .yesbtn,.nobtn{width: 1.626667rem;overflow: hidden; height: 0.88rem;line-height: 0.88rem; border:none;border-radius: 0.08rem; font-size: 0.373333rem;color: #333; background-color: #63a5ef;}
    .older .yesbtn,.older .nobtn{background: #ccc;}
    .nobtn{background-color: #f67e65}
    .more{font-size: 0.32rem;color: #568ece;}

    .weekdiscuss{position: relative; padding:0 0.266667rem; background-color: #fff;}
    .weekdiscuss-name{font-size: 0.4rem;color: #999;height: 1.026667rem;line-height: 1.026667rem;border-bottom: 1px solid #e8e8e8}
    .weekdiscuss-conwrap{padding:0.4rem 0;}    
    .weekdiscuss-vote{padding:0.266667rem 1.2rem 0;font-size: 0;text-align: center;}
    .weekdiscuss-vote li{position: relative; width: 50%; display: inline-block;font-size: 0.32rem;color: #999;}
    .weekdiscuss-vote li:first-child:after{content:'VS';position: absolute;right: -0.226667rem;font-weight: bold; top:0.213333rem;font-size: 0.426667rem;color: #666;}
    .weekdiscuss-vote p{line-height: 0.6rem;}
    .weekdiscuss-title{font-size: 0.48rem;line-height: 1.5; color: #666;text-align: center}
    .weekdiscuss-foot{height: 0.786667rem;line-height: 0.786667rem; border-top:1px solid #e8e8e8;font-size: 0.32rem;color: #c1c1c1;overflow: hidden;}

    .weekdiscuss .base-message,.weekdiscuss .base-zan{color: #999}
    .old-logo{position: absolute; right: 0.4rem;top:0.4rem; width: 2.133333rem; height: 1.6rem; background: url(data:image/png;base64,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) no-repeat;background-size: 100% 100%;}
</style>
