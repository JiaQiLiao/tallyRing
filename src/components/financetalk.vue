<template>      
      <div id="mescroll1" class="mescroll"> 
         <posts :list="postlist" @zan="zan" class="fin-post" id="datalist"></posts>          
      </div> 
</template>

<script>
import posts from './common/posts'
import util from '../assets/common'
import Mescroll from  'mescroll.js/mescroll.min.js'
export default {
  name: 'financetalk',//financetalk，smartliving和firstlook的UI展示是一样的，但是为了解决列表的缓存问题，所以分开了这三个
  data(){
    return {
    	postlist:[],//存储帖子列表 
     }
  }, 
  created(){
    localStorage.finposition = 0;
  },  
  mounted:function(){
     var self =this;
     self.mescroll = new Mescroll('mescroll1',{
        up:{
           callback:self.infinite           
        }
     });
     document.getElementById('datalist').style.display = "block";

     var scrolldom = document.getElementById('mescroll1');
     scrolldom.onscroll = function(){
        localStorage.finposition =scrolldom.scrollTop;                
     }  
  },
  activated(){        
     var scrolldom = document.getElementById('mescroll1');    
     if(localStorage.finposition){
        scrolldom.scrollTop=localStorage.finposition;
     }
  },
  // destoryed(){
  //   self.mescroll = null;
  // },
  methods: {
     infinite(page){ //无限下拉加载        
          let _this = this;
          this.axios.post('/finance/financeList',{page:page.num}).then(function(res){
              if(res.data.state == 200){
                  if(page.num == 1) _this.postlist =[];
                   if(res.data.data.length){                      
                      _this.postlist=_this.postlist.concat(res.data.data);
                   }                     
                     _this.mescroll.endSuccess(res.data.data.length ? res.data.data.length:0);
              }else{
                  _this.Toast(res.data.msg)
              }
           }).catch(function(err){
             _this.Toast(err);
            _this.mescroll.endErr();
           })
     },
     zan(index,bbsid){//其他帖子点赞
      let _this = this;
       if(this.postlist[index].highlight){
         util.zan(bbsid,0,0,function(){
            _this.postlist[index].highlight = 0;
            _this.postlist[index].like_count--;
         });
       }else{
         util.zan(bbsid,0,1,function(){
            _this.postlist[index].highlight = 1;
            _this.postlist[index].like_count++;
         })
       }
     }
  },
   components: {
    posts    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .financetalk{padding:0.16rem 0.32rem;}
   .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;}
   .fin-post{padding:0.16rem .32rem;}
</style>
