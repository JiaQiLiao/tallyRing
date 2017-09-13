<template>
  <div class="hotweek">
    <div id="mescroll2" class="mescroll">
    <div class="hotweek-scroll scrollbar">
        <weekdiscuss class="mt12" :isshow="false" :value="topic"></weekdiscuss>
        <div class="pasttheme mt12">
          <h2 class="pasttheme-name">往期话题</h2>
          <ul class="pastul" id="datalist">
            <li class="pastitem" v-for="item in hotweeklist">
             <router-link :to="{path:'/topicdetial/',query:{bbsid:item.bbsid,old:true,ajzshare:1}}">
              <span class="base-recommend fl" v-if="item.is_recommend == '1'"></span><h2 class="pastitem-title">{{item.title}}</h2>
              <div class="pastitem-bottom fix">
                <span class="fl">发布时间：{{item.create_time}}</span>
                <span class="fr">参与人数：{{item.join}}</span>
              </div>
              </router-link>
            </li> 
          </ul>
        </div>
      </div>  
     </div>
      <review :place="'我来推荐话题...'" v-on:submited="submit"></review>
  </div>
</template>

<script>
import weekdiscuss from './common/weekdiscuss'
import review from './common/review'
import util from '../assets/common'
import Mescroll from  'mescroll.js/mescroll.min.js'
export default {
  name: 'hotweek',
  data () {
    return { 
       hotweeklist:[],//往期列表
       topic:{//本期热议默认数据
        title:'本周热议',
         result:[0,0],
         option_items:['支持','不支持'],
         like_count:'0',
         comment_count:'0'
       }
    }
  },
  created(){  
     let _this = this;
     localStorage.hotposition = 0;
     document.title = '每周热议'
      this.axios.post('/Topic/TopicList',{}).then(function(res){
         if(res.data.state == 200){
            if(res.data.data.length){
               _this.topic = res.data.data[0];
            }
         }else{
            _this.Toast(res.data.msg)
         }
      }).catch(function(err){
         _this.Toast(err)
      })  
  }, 
  activated(){//缓存页面重新访问触发的声明周期
      var scrolldom = document.getElementById('mescroll2');    
      if(localStorage.hotposition){
         scrolldom.scrollTop=localStorage.hotposition;
      }
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
        localStorage.hotposition =scrolldom.scrollTop;                
     }  
  },  
  methods: { 
     submit(val){//推荐话题提交
         let _this = this;
         this.axios.post('/User/UserReport',{bbsid:0,content:val}).then(function(res){
            if(res.data.state == 200){
               _this.Toast('提交成功！')
            }else{
               _this.Toast(res.data.msg)
            }
         }).catch(function(err){
            _this.Toast(err);
         })
     } ,
     infinite(page){//无限下拉加载
       let _this = this;
        this.axios.post('/Topic/TopicPast',{page:page.num}).then(function(res){
           if(res.data.state == 200){             
                 if(page.num == 1) _this.hotweeklist =[]; 
                  if(res.data.data.length){
                     _this.hotweeklist=_this.hotweeklist.concat(res.data.data); 
                  } 
                  _this.mescroll.endSuccess(res.data.data.length?res.data.data.length:0);
           }else{
               _this.Toast(res.data.msg)
           }
        }).catch(function(err){
             _this.Toast(err);
             _this.mescroll.endErr();
        })
     }  
  },
  components: {
    weekdiscuss,
    review
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hotweek{height: 100%;padding-bottom: 1.386667rem;}
  /*.hotweek-scroll{position: absolute;bottom:1.386667rem;top:0;width: 100%;left: 0;overflow-y:auto; -webkit-overflow-scrolling:touch;} */ 
  .pasttheme-name{font-size: 0.4rem;color: #999;height: 1.013333rem;line-height: 1.013333rem;border-bottom: 1px solid #e8e8e8;padding:0 0.4rem;}
  .pasttheme{background-color: #fff;}
  .pastitem-title{font-size: 0.48rem;color: #333;line-height: 1.3;overflow: hidden;}
  .pastitem{padding:0.213333rem 0.4rem 0.106667rem;border-bottom: 1px solid #e8e8e8;}
  .pastitem-bottom{font-size: 0.266667rem;color: #999;line-height: 1.5;padding-top: 0.16rem}
  .pastitem .base-recommend{margin:0.106667rem 0.106667rem 0 0;}
  .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;background-color: #ededed}
</style>
