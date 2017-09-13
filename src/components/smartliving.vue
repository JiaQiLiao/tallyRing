<template>      
      <div id="mescroll2" class="mescroll"> 
         <posts :list="postlist" @zan="zan" class="fin-post" id="datalist"></posts>          
      </div> 
</template>

<script>
import posts from './common/posts'
import util from '../assets/common'
import Mescroll from  'mescroll.js/mescroll.min.js'
// import 'mescroll.js/mescroll.min.css'
export default {
  name: 'financetalk',
  data(){
    return {
    	postlist:[],//存储帖子列表 
      api:'',
     }
  }, 
  created(){
    localStorage.liveposition = 0;
  },  
  mounted:function(){
     var self =this;
     self.mescroll = new Mescroll('mescroll2',{
        up:{
           callback:self.infinite
        }
     });
     document.getElementById('datalist').style.display = "block";

     var scrolldom = document.getElementById('mescroll2');
     scrolldom.onscroll = function(){
        localStorage.liveposition =scrolldom.scrollTop;               
     }  
  },
  activated(){  
     var scrolldom = document.getElementById('mescroll2');    
     if(localStorage.liveposition){
        scrolldom.scrollTop=localStorage.liveposition;
     }
  },
  // destoryed(){
  //   self.mescroll = null;
  // },
  methods: {
     infinite(page){          
          let _this = this;
          this.axios.post('/Life/lifeList',{page:page.num}).then(function(res){
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .financetalk{padding:0.16rem 0.32rem;}
   .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;}
   .fin-post{padding:0.16rem .32rem;}
</style>
