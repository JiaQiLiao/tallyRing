<template>
   <div class="posts">
       <ul class="posts-ul">
        <!-- 普通帖 -->
        <li class="posts-list mb12" v-for="(item,index) in list">
          <div class="posts-hwrap fix">
            <img :src="item.userinfo.face" alt="" class="fl posts-avatar">
            <div class="posts-username">{{item.userinfo.username}}
              <p class="posts-date">{{item.create_time}}</p>
            </div>
          </div>
          <router-link :to="{path:'/articledetial/',query:{bbsid:item.bbsid,ajzshare:1}}">
            <h2 class="posts-title">{{item.title}}</h2>
            <p class="posts-summary">{{item.digest}}</p>
          <!-- </router-link> -->
          <ul class="imgul">
          <!-- @click="show(index,item.photos)" 这里是后来改的需求，不需要在列表页点击图片预览-->
            <li :class="item.sm_photos.length == 1 ? 'imglist_one': 'imglist_more'" v-for="(i,index) in item.sm_photos" v-if="item.sm_photos.length > 0" class="previewer-img" ><span :style="'background:url('+ i.src +') no-repeat center;background-size:'+ (i.w > i.h ? 'auto 100% ': '100% auto')"></span>
             </li>
          </ul>
          </router-link>
          <div class="posts-foot fix">            
            <div class="fr">
              <!-- 这里的ajzshare=1是给app判断是可分享页面 -->
              <router-link :to="{path:'/articledetial/',query:{bbsid:item.bbsid,ajzshare:1}}">
                 <span class="base-message">{{item.comment_count}}</span>&nbsp;&nbsp;
              </router-link>
              <span v-on:click="zan(index,item.bbsid)" class="base-zan" :class="item.highlight ? 'zan':'' ">{{item.like_count}}</span>
            </div>
          </div>
        </li>  
      </ul>  
      <div v-transfer-dom>
          <previewer :list="previewerlist" ref="previewer" :options="options" @on-close="close"></previewer>
      </div>
   </div>
</template>

<script>
import { Previewer , TransferDom} from 'vux'
export default {
  name: 'posts',
  props:{
  	list:{
  		type:Array,
  		default:[]
  	}
  },
  data(){
    return {
      options: {    
         fullscreenEl: false,
         arrowEl: false,   
         zoomEl:false,
         preloaderEl: false, 
        //暂时取消放大渐变的过程，过程不协调
        // getThumbBoundsFn (index) {
        //   // find thumbnail element
        //   let thumbnail = document.querySelectorAll('.previewer-img')[index]
        //   // get window scroll Y
        //   let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
        //   // optionally get horizontal scroll
        //   // get position of element relative to viewport
        //   let rect = thumbnail.getBoundingClientRect()
        //   // w = width
        //   return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        //   // Good guide on how to get element coordinates:
        //   // http://javascript.info/tutorial/coordinates
        // }
      },
      previewerlist:[]//大图预览列表
    }
  },
  created(){

  },
  directives: {
    TransferDom
  },
  components: {
    Previewer    
  },
  methods: {
    close(){
       if(window.client){//处理app中处理返回箭头到原生页面的问题
          window.client.setBackVisibility(1);
       }else if(window.setBackVisibility){
          window.setBackVisibility(1);
       }
    },
    show (index,i) {  
      if(window.client){//处理app中处理返回箭头到原生页面的问题
          window.client.setBackVisibility(0);
       }else if(window.setBackVisibility){
          window.setBackVisibility(0);
       }    
      this.previewerlist = i;
      //上面的数据赋值完毕，但vue没有立刻就更新完成
      this.$nextTick(()=>{
         this.$refs.previewer.show(index);         
      })
    },
    zan(index,bbsid){
      this.$emit('zan',index,bbsid)  
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
       /*帖子列表*/ 
         .posts-avatar{width: 0.88rem;height: 0.88rem;border-radius: 50%;}
         .posts-username{overflow: hidden;font-size: 0.373333rem;color: #333;line-height: 1.4;padding-left: 0.16rem;}
         .posts-date{font-size: 0.266667rem;color: #999;}
         .posts-hwrap{padding-bottom: 0.16rem}
         .posts-list{padding:0.266667rem 0.266667rem 0;background-color: #fff;}
         .posts-title{font-size: 0.48rem;color: #333;line-height: 1.2;}
         .posts-summary{font-size: 0.346667rem;color: #666;line-height: 1.2;padding:0.133333rem 0 0;margin-bottom:0.106667rem;  display: -webkit-box;
    -webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;padding-right: 0.093333rem;}
         .posts-foot{height: 0.786667rem;line-height: 0.786667rem;margin-top:0.4rem; border-top:1px solid #e8e8e8;font-size: 0.32rem;color: #c1c1c1;}
         /*图片列表*/
         .imgul{font-size: 0;}
         .imglist_one{width: 100%;height: 4.946667rem;overflow: hidden;}
         .imglist_one span{display:block;height: 4.946667rem}

         .imglist_more{display: inline-block; width: 33.33%; height: 2.853333rem;margin-top: 0.133333rem;}
         .imglist_more span{display: inline-block;width: 2.853333rem;height: 2.853333rem;overflow: hidden;}
         .imglist_more:nth-child(1),.imglist_more:nth-child(2),.imglist_more:nth-child(3){margin-top:0;}
         .imglist_more:nth-child(3n+2){text-align: center;}
         .imglist_more:nth-child(3n+3){text-align: right}         
         .posts .base-message,.posts .base-zan{color:#999 }
         .posts .zan{color: #b08e5a}
</style>
