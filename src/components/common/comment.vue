<template>
       <div class="comment">
       	<h2 class="comment-name"><span class="base-message">评论（{{value.bbs.sum}}）</span></h2>
       	<ul class="comment-ul" v-if="value.comment">
       		<li class="comment-item" v-for="(item,index) in value.comment">
       			<img :src="item.userinfo.face" class="comment-avatar" alt="">
       			<div class="comment-rwrap">
       				<div class="comment-userinfo fix">
       				 <div class="fl">
       				    <div class="comment-username">{{item.userinfo.username}}</div>
       				    <div class="comment-date">{{item.create_time}}</div>
       				  </div> 
                <span v-on:click="zan(index,item.bbsid,item.commentid)" class="fr base-zan" :class="item.highlight ? 'zan':'' ">{{item.like_count}}</span>
       				</div>
       				<p class="comment-details fix">{{item.content}}</p>
       			</div>
       		</li>
       	</ul>
       </div>
</template>

<script>
export default {
  name: 'comment',
  props:{
    value:{//评论的默认值
      type:Object,
      default:{
        bbs:{sum:0},
        comment:[]
      }
    }
  },
  data(){
    return {
    }
  }, 
  methods: { 
     zan(index,bbsid,commentid){
       this.$emit('zan',index,bbsid,commentid)  
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .comment{background-color: #fff;}
    .comment-name{padding:0 0.4rem; height: 0.893333rem;line-height: 0.88rem; border-bottom: 1px solid #e8e8e8;font-size: 0.346667rem;color: #999;}
    .comment-item{padding:0.266667rem 0.4rem; border-bottom: 1px solid #e8e8e8;}
    .comment-avatar{float: left; width: 0.72rem;height: 0.72rem;border-radius: 50%;overflow: hidden;}
    .comment-rwrap{overflow: hidden;padding-left: 0.133333rem}
    .comment-username{line-height: 1.4; font-size: 0.32rem;color: #333;}
    .comment-date{font-size: 0.266667rem;color: #999;}
    .comment-details{line-height: 1.3;padding-top: 0.133333rem;color: #555;font-size: 0.32rem;}
    .comment .base-zan{font-size: 0.346667rem;color: #999;}   
</style>
