<template>
<div class="artW">
  <div id="mescroll4" class="mescroll"> 
   <div class="articledetial" >
   	  <div class="article-head fix">
   	  	<img :src="detial.userinfo.face" class="article-userpic" alt="">
   	  	<div class="article-headinfo">
   	  		{{detial.userinfo.username}}
   	  		<div class="article-date">{{detial.create_time}}</div>
   	  	</div>
   	  </div>
   	  <h2 class="article-title">
   	  	 {{detial.title}}
   	  </h2>
   	  <p class="article-con">
   	  	 {{detial.content}}
        <template v-for="item in detial.photos">
          <img :src="item.src" alt=""><br>
        </template>
   	  </p>
   </div>
   	  <div class="pt12">
       <comment :value="comments" @zan="zanfn" id="datalist"></comment>
      </div>  
    </div>
   <review v-on:submited="submit"></review>
   </div>
</template>

<script>
import comment from './common/comment'
import util from '../assets/common'
import review from './common/review'
import Mescroll from  'mescroll.js/mescroll.min.js'
export default {
  name: 'articledetial',
  data(){
    return {
       detial:{
           userinfo:{
            username:''}
       },
       comments:{
         bbs:{sum:0},
         comment:[]
       },
       page:1,       
     }
  },  
  created(){
       document.title = '文章详情';
      let _this = this;
      this.bbsid = this.$route.query.bbsid;
        this.axios.post('/Index/IndexOne',{bbsid:_this.bbsid}).then(function(res){//加载文章详情的内容
           if(res.data.state == 200){            
              _this.detial = res.data.data;
              window.share = function(){//给原生暴露的分享接口
                return res.data.share;
              }
           }else{
              _this.Toast(res.data.msg)
           }
        }).catch(function(err){
           _this.Toast(err)
        })
  },
  mounted:function(){
     var self =this;
     self.mescroll = new Mescroll('mescroll4',{
        up:{
           callback:self.infinite,
        }
     });
     document.getElementById('datalist').style.display = "block";
  },  
  methods: {
    submit(val){//提交评论
        let _this = this;
        this.axios.post('/User/comment',{bbsid:_this.bbsid,content:val}).then(function(res){
           if(res.data.state == 200){              
              _this.mescroll.resetUpScroll(false);  
              _this.Toast('提交成功！');            
           }else{
              _this.Toast(res.data.msg)
           }
        }).catch(function(err){
          _this.Toast(err);
        })
    },
    infinite(page){
       let _this = this;
       this.axios.post('/Index/IndexOneComment',{bbsid:_this.bbsid,page:page.num}).then(function(res){
          if(res.data.state == 200){  
              if(page.num == 1) _this.comments ={bbs:{sum:0},comment:[]}; 
              if(!Array.isArray(res.data.data)){
                 _this.comments.bbs = res.data.data.bbs;               
                 _this.comments.comment=_this.comments.comment.concat(res.data.data.comment);
               }
                _this.mescroll.endSuccess(Array.isArray(res.data.data) ?0: res.data.data.comment.length);
          }else{
              _this.Toast(res.data.msg)
          }
       }).catch(function(err){
          _this.Toast(err);
       })
    },
    zanfn(index,bbsid,commentid){//其他帖子点赞
     let _this = this;
      if(this.comments.comment[index].highlight){
        util.zan(bbsid,commentid,0,function(){
           _this.comments.comment[index].highlight = 0;
           _this.comments.comment[index].like_count--;
        });
      }else{
        util.zan(bbsid,commentid,1,function(){
           _this.comments.comment[index].highlight = 1;
           _this.comments.comment[index].like_count++;
        })
      }
    }
  },
  components: {
     comment,
     review
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .artW{height: 100%;padding-bottom: 1.386667rem;}
   .articledetial{background-color: #fff;padding:0.266667rem 0.4rem 0.72rem;}
   .article-userpic{float: left; width:1.04rem;height: 1.04rem;border-radius: 50%;}
   .article-headinfo{overflow: hidden;font-size:0.373333rem;color: #333;padding-left: 0.16rem;line-height: 1.5;}
   .article-date{font-size: 0.32rem;color: #999;}
   .article-title{font-size: 0.56rem;color: #333;line-height: 1.2;padding:0.133333rem 0;}
   .article-con{font-size: 0.346667rem;color: #333;line-height: 1.5;text-align: center;}
   .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;}
   .article-con img{max-width: 100%;margin-top: 0.266667rem}
</style>
