<template>
  <div class="review">
     <div class="reviewinner">
        <input type="text" :placeholder="place" v-model="reviewvalue" > 
        <div v-on:click="submit(reviewvalue)" class="review-btn" >确定</div>
     </div>     
  </div>
</template>

<script>
export default {
  name: 'review',
  props:{
     place:{//区别提交评论和提交话题的参数，placehoder和提示语
      type:String,
      default:'评论'
     },
  },
  data() {
    return {  
       reviewvalue:''//输入的内容
    }
  }, 
  created(){
  }, 
  methods: { 
    submit(val){
        var str = '';
        if(this.place == '评论'){
           str = this.place;
        }else{
           str = '话题';
        }
        if(!val){
          this.Toast(str + '不能为空！');
          return ;
        }
        this.$emit('submited',val);
        this.reviewvalue = '';//这里应该是提交成功后才重置为空，这里偷懒了
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
   .review{ background-color: #fff; position: absolute;bottom:0; left: 0;width: 100%; border: 1px solid #e8e8e8;padding:0.2rem 0.4rem ;}
   .review input{padding:0.2rem 0.2rem;border-radius: 0.08rem; display: block; background-color: #ededed;width: 100%;height: 0.96rem; line-height: 1.5;font-size: 0.346667rem;}
   .reviewinner{padding-right: 22%;position: relative;}
   .review-btn{width: 20%;position: absolute;right:0;top:0;background-color: #f0bd22;font-size: 0.32rem;line-height:0.96rem;text-align: center;border-radius: 0.08rem;}
</style>
