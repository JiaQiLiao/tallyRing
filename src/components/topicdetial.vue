<template>
   
   <div class="topicdetial" >
     <div id="mescroll3" class="mescroll"> 
   	  <weekdiscuss class="mt12" :value="topic" :old="old"></weekdiscuss>
      <comment class="mt12" :value="comments" @zan="zanfn" id="datalist"></comment>
      </div>
      <review :place="'评论'" v-on:submited="submit"></review>
   </div>
  
</template>

<script>
import weekdiscuss from './common/weekdiscuss'
import comment from './common/comment'
import util from '../assets/common'
import review from './common/review'
import Mescroll from  'mescroll.js/mescroll.min.js'
export default {
  name: 'topicdetial',  
  data(){
    return {
       topic:{//热议数据
         title:'',
         result:[0,0],
         option_items:['',''],
         like_count:'0',
         comment_count:'0'
       },
       comments:{//评论列表数据
         bbs:{sum:0},
         comment:[]
       },
       bbsid:0,//帖子的id
       old:false //根据url的参数判断来源是否是过期的话题
     }
  },  
  created(){ 
     document.title = '话题详情';
     let _this = this;  
     this.bbsid = Number(_this.$route.query.bbsid);//获取地址参数中的id
     this.old =_this.$route.query.old;//获取参数中的old值

     this.axios.post('/Topic/TopicOne',{bbsid:_this.bbsid}).then(function(res){
        if(res.data.state == 200){ 
          if(!Array.isArray(res.data.data)){//
             _this.topic = res.data.data;
           }
           window.share = function(){//这里是给app调用分享的接口，该接口返回了分享的信息
              return res.data.share;
            }
        }else{
           _this.Toast(res.data.msg)
        }
     }).catch(function(err){
        _this.Toast(res.data.msg);
     })    
  },  
  mounted:function(){
     var self =this;
     self.mescroll = new Mescroll('mescroll3',{
        up:{
           callback:self.infinite,
        }
     });
     document.getElementById('datalist').style.display = "block";
  },
  methods: {    
    infinite(page){
       let _this = this;
        this.axios.post('/Topic/TopicOneComment',{bbsid:_this.bbsid,page:page.num}).then(function(res){
           if(res.data.state == 200){             
                 if(page.num == 1) _this.comments ={bbs:{sum:0},comment:[]}; 
                if(!Array.isArray(res.data.data)){
                    _this.comments.bbs = res.data.data.bbs;
                    _this.comments.comment=_this.comments.comment.concat(res.data.data.comment);
                }
                _this.mescroll.endSuccess(Array.isArray(res.data.data) ? 0:res.data.data.comment.length);       
           }else{
               _this.Toast(res.data.msg)
           }
        }).catch(function(err){
          _this.Toast(err)
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
    },
    submit(val){//提交评论
         let _this = this;
         this.axios.post('/User/comment',{bbsid:_this.bbsid,content:val}).then(function(res){
            if(res.data.state == 200){
               _this.mescroll.resetUpScroll(false);   
               _this.Toast('提交成功！')
            }else{
               _this.Toast(res.data.msg)
            }
         }).catch(function(err){
           _this.Toast(err)
         })
     }   
  },
  components: {
    weekdiscuss,
    comment,
    review  
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .topicdetial{border-top:1px solid transparent;height: 100%;padding-bottom: 1.386667rem;}
    .infinite-loading{text-align: center;font-size: 0.32rem;line-height:0.533333rem;color: #666;}
</style>
