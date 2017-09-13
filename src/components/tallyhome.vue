<template>
  <div id="mescroll" class="mescroll"> 
  <div class="tallyhome" >
     <!-- 导航部分 -->
      <div class="nav">
          <router-link to="/hotweek" class="nav-item "><span class="icon1-hotweek"></span>每周热议</router-link>
          <router-link :to="{path:'/financetalk/'}" class="nav-item financialtalk"><span class="icon1-financialtalk"></span>理财漫谈</router-link> 
          <router-link :to="{path:'/smartliving/'}" class="nav-item smartliving"><span class="icon1-smartliving"></span>智慧生活</router-link>
          <router-link :to="{path:'/firstlook/'}" class="nav-item firstlook"><span class="icon1-firstlook"></span>抢鲜看</router-link>
          <router-link to="/message" class="posted_btn">我也来说说&nbsp;&nbsp;<span class="base-pen"></span></router-link>
      </div>
          <!-- 本周热议部分 -->
          <weekdiscuss class="mt12" :value='topic' @zan="zanfnhot"></weekdiscuss>
          <ul class="postul " v-if="operation" id="datalist">
            <!-- 运营位贴 -->
            <li class="postlist mt12">
            <a :href="operation.link">
              <h2 class="postlist-title">{{operation.title}}</h2>
              <p class="postlist-summary">{{operation.digest}}</p>
              <img :src="operation.photo" alt="" width="100%" v-if="!Array.isArray(operation.photo)">
              <!-- <div class="postlist-bottom fix">            
                <div class="fr">
                  <span class="base-message">{{operation.comment_count}}</span>&nbsp;&nbsp;
                  <span v-on:click="zan(0,operation.bbsid)" class="base-zan" :class="operation.highlight ? 'zan':'' ">{{operation.like_count}}</span>
                </div>
              </div> -->
              </a>
            </li> 
          </ul>
          <!-- 帖子列表 -->
          <posts class="mt12" :list="post" @zan="zanfn"></posts>
  </div>
  </div>
</template>

<script>
import weekdiscuss from './common/weekdiscuss'//本周热议组件
import posts from './common/posts'//帖子列表组件
import util from '../assets/common'//公共类库
import Mescroll from  'mescroll.js/mescroll.js'//下拉加载插件

export default {
  name: 'tallyhome',
  data () {
    return { 
      topic:{//本周热议数据
         "bbsid": "25",
         title:'本周热议',
         result:[0,0],
         option_items:['支持','反对'],
         like_count:'0',
         comment_count:'0'
      },
      post:[],//帖子列表数据
      operation:{//运营位数据
        photo:[]
      },
      mescroll:null,//插件引用
    }
  },
  watch: {
    '$route' (to, from) {//发布帖子后返回首页刷新
       if(from.path == '/message'){
          this.mescroll.resetUpScroll(false);
       }
    }
  },
  created(){//创建时将滚动的位置设置为0     
    localStorage.homeposition = 0;
  },
  mounted:function(){    
     var self =this;
     self.mescroll = new Mescroll('mescroll',{//挂载dom后创建mescroll实例，官网：http://www.mescroll.com/
        up:{
           callback:self.infinite,
        }
     });
     document.getElementById('datalist').style.display = "block";
     var scrolldom = document.getElementById('mescroll');
     scrolldom.onscroll = function(){//监听onscroll记录scroll的位置，实现方式可以优化
        localStorage.homeposition =scrolldom.scrollTop;        
     }     
  },
  activated(){    
     document.title = '账圈';
     this.gethome();
     var scrolldom = document.getElementById('mescroll'); //设置scroll的记录为历史记录   
     if(localStorage.homeposition){
        scrolldom.scrollTop=localStorage.homeposition;
     }     
  },
  methods: { 
     infinite(page){ //无限下拉加载方法
       let _this = this;
       this.axios.post('/Index/indexPost',{page:page.num}).then(function(res){
          if(res.data.state == 200){   
              if(page.num == 1) _this.post =[];          
                 if(res.data.data.length){
                     _this.post=_this.post.concat(res.data.data);
                 }
                  _this.mescroll.endSuccess(res.data.data.length ? res.data.data.length:0);     
          }else{
              _this.Toast(res.data.msg);
          }
       }).catch(function(err){
          _this.Toast(err);
          _this.mescroll.endErr();
       })
     },
     gethome(){//请求运营位和本周热议数据
        let _this = this;   
        this.axios.post('/Index/index',{}).then(function(res){
           if(res.data.state == 200){
              _this.topic = res.data.data.topic;
              (_this.operation) && (_this.operation = res.data.data.operation);
           }else{
              _this.Toast(res.data.msg)
           }
        }).catch(function(err){
          _this.Toast(err);
        })
     },
     zanfn(index,bbsid){//其他帖子点赞
      let _this = this;
       if(this.post[index].highlight){
         util.zan(bbsid,0,0,function(){
            _this.post[index].highlight = 0;
            _this.post[index].like_count--;
         });
       }else{
         util.zan(bbsid,0,1,function(){
            _this.post[index].highlight = 1;
            _this.post[index].like_count++;
         })
       }
     },
     zanfnhot(index,bbsid){//热议点赞
      let  _this = this;
        if(this.topic.highlight){
          util.zan(bbsid,0,0,function(){
             _this.topic.highlight = 0;
             _this.topic.like_count--;
          });
        }else{
          util.zan(bbsid,0,1,function(){
             _this.topic.highlight = 1;
             _this.topic.like_count++;
          })
        }
     },
     // zan(index,bbsid){//运营位点赞
     //    let  _this = this;
     //      if(this.operation.highlight){
     //        util.zan(bbsid,0,0,function(){
     //           _this.operation.highlight = 0;
     //           _this.operation.like_count--;
     //        });
     //      }else{
     //        util.zan(bbsid,0,1,function(){
     //           _this.operation.highlight = 1;
     //           _this.operation.like_count++;
     //        })
     //      }
     // }, 
  },
  components: {
    posts,
    weekdiscuss
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tallyhome{padding:0.16rem 0.32rem;}
  /*导航*/
    .nav{padding:0.4rem 0.266667rem; background-color: #fff;text-align: center;font-size: 0;}
    .nav-item{display:inline-block;width: 25%;margin:0 0 0.4rem; font-size: 0.346667rem;color: #333;}
    /*账圈图标*/
    .nav-item span{display:block;margin:0 auto 0.186667rem;height: 1.2rem;width: 1.2rem;}
    .icon1-weekdiscuss{background-position: 0 0;}
    .icon1-financialtalk{background-position:-1.28rem 0}
    .icon1-smartliving{background-position: -2.533333rem 0}
    .icon1-firstlook{background-position: -3.813333rem 0}
    /*按钮*/
    a.posted_btn{ display: block;height: 1.333333rem;line-height: 1.333333rem;border-radius: 0.08rem;text-align: center;font-size: 0.4rem; background-color: #ffc12f;color: #333;}
   
   /*帖子列表*/ 
     .postlist-userhead{width: 0.88rem;height: 0.88rem;border-radius: 50%;}
     .postlist-usertxt{overflow: hidden;font-size: 0.373333rem;color: #333;line-height: 1.4;padding-left: 0.16rem;}
     .postlist-userdate{font-size: 0.266667rem;color: #999;}
     .postlist-user{padding-bottom: 0.16rem}
     .postlist{padding:0.266667rem;background-color: #fff;}
     .postlist-title{font-size: 0.48rem;color: #333;line-height: 1.2;}
     .postlist-summary{font-size: 0.346667rem;color: #666;line-height: 1.2;padding:0.133333rem 0 0;margin-bottom:0.106667rem;  display: -webkit-box;
-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;padding-right: 0.093333rem;}
     .postlist-bottom{height: 0.786667rem;line-height: 0.786667rem;margin-top:0.4rem; border-top:1px solid #e8e8e8;font-size: 0.32rem;color: #c1c1c1;}
     .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;}
</style>
