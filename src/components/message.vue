<template>
  <div class="message">
      <div class="message-tapwrap" v-on:click="seltype">
      	标签 <span class="message-tap" :class="curtype == 2?'cur':''" data-type="2">理财漫谈</span>
      	<span class="message-tap" :class="curtype == 3?'cur':''" data-type="3">智慧生活</span>
      	<span class="message-tap" :class="curtype == 4?'cur':''" data-type="4">抢鲜看</span>
      </div>      
      <group class="msg-title">
       <x-textarea v-model="title"  :max="30" autosize placeholder="请输入标题" :show-counter="true" :rows="1" :cols="30" ></x-textarea>
      </group>
      <group>
          <x-textarea v-model="comment"  :max="800" placeholder="说点什么吧" :show-counter="true" :rows="8" :cols="30" ></x-textarea>
      </group>
      
      <div class="upload-wrap">
      <el-upload action="上传接口地址"
        list-type="picture-card"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :on-change="onChange"
        :on-success="uploadsuccess"
        :http-request="request"
        :accept="'image/*'">
        <!-- <i class="el-icon-plus"></i> -->
      </el-upload>
      </div>
      <button v-on:click="submitFun" class="messagebtn">发表</button>
  </div>
</template>

<script>
import { Upload } from 'element-ui'//引入的这个组件在原代码是有修改样式的，因为本项目用了flexible而element的单位都是px，或者有其他更好的方式避免修改原组件样式
import { XTextarea , Group }  from 'vux'
import qs from 'qs'
import lrz from 'lrz'//引用了对图片上传处理的库https://github.com/think2011/localResizeIMG

export default {
  name: 'message',
  data () {
    return { 
     curtype:2,//留言类型     
     title:'',//发帖标题
     comment:'',//发帖内容
     smlphoto:{},//小图列表
     bigphoto:{},//大图列表
     photocount:0//上传图片张数
    }
  }, 
  created(){
      document.title = '发帖';
  },   
  methods: {   
    seltype(e){//类别选择
      this.curtype = e.target.dataset.type;
    } ,
    handleRemove(file, filelist) {//上传文件删除
        this.photocount = filelist.length;
        this.smlphoto_tmp=filelist.map(function(item,index){
             if(item.response){
              return item.response.data.sm_photo;
             }else{
               return item;
             }
        })
        this.bigphoto_tmp=filelist.map(function(item,index){
             if(item.response){
                 return item.response.data.photo;
             }else{
               return item;
             }
        });
        for(var i = 0 ,len = filelist.length; i < filelist.length ; i++){
           this.smlphoto[i] = this.smlphoto_tmp[i];
           this.bigphoto[i] = this.bigphoto_tmp[i];
        }
    },
    submitFun(){//发表提交
       let _this = this;
       if(!this.title){
          _this.Toast('标题不能为空!');
          return;
        }
        if(!this.comment){
          _this.Toast('内容不能为空!');
          return;
        }
       let data = {content:this.comment,title:this.title,typename:this.curtype,photo:JSON.stringify(this.bigphoto),sm_photo:JSON.stringify(this.smlphoto)}
        this.axios.post('/User/post',data).then(function(res){  
          if (res.data.state == 200) {
            _this.Toast('提交成功!');
            setTimeout(function(){
               _this.$root.$router.replace({path:'/'}); //这里使用路由replace，发帖成功后避免点击返回回到发帖页
            },1000)            
          }else{
            _this.Toast(res.data.msg);
          }            
       }).catch(function(err){
          _this.Toast(err);
       })
    },
    beforeAvatarUpload(file) { //上传前处理     
      let _this = this;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if(this.photocount > 8){this.Toast('最多只能上传九张哦!');return false;}
      if (!isJPG) {
        this.Toast('上传图片只能是JPG或PNG格式!');
        return false;
      }
      // if (!isLt2M) 
      // {
      //   this.Toast('上传图片大小不能超过 2MB!');
      //   return false;       
      // }
      return isJPG;
    },
    request(option){//重写element的ajax请求解决ios拍照的旋转问题，其实也是按照原来的element的ajax重写的
        let _this = this;
        lrz(option.file)//引用了lrz库
                .then(function (rst) {
                    var xhr = new XMLHttpRequest();
                     const action = option.action;
                      if (xhr.upload) {
                          xhr.upload.onprogress = function progress(e) {
                            if (e.total > 0) {
                              e.percent = e.loaded / e.total * 100;
                            }
                            option.onProgress(e);
                          };
                        }                      
                       if (option.data) {
                           Object.keys(option.data).map(key => {
                             rst.formData.append(key, option.data[key]);
                           });
                         }
                       xhr.onerror = function (e) {
                           option.onError(e)
                       };
                       
                       xhr.onload = function onload() {
                           if (xhr.status < 200 || xhr.status >= 300) {
                             return option.onError(_this.getError(action, option, xhr));
                           }
                           option.onSuccess(_this.getBody(xhr));
                         };

                     xhr.open('post', action, true);
                     if (option.withCredentials && 'withCredentials' in xhr) {
                         xhr.withCredentials = true;
                       }
                       const headers = option.headers || {};
                       for (let item in headers) {
                           if (headers.hasOwnProperty(item) && headers[item] !== null) {
                             xhr.setRequestHeader(item, headers[item]);
                           }
                         }                      
                      // 触发上传
                      /* ==================================================== */
                       xhr.send(rst.formData);
                      return rst;
                })
                .catch(function (err) {
                    _this.Toast(err);
                })
                .always(function () {
                    // 不管是成功失败，都会执行
                });
    },
    getBody(xhr) {//element的upload组件中的ajax文件中的方法
      const text = xhr.responseText || xhr.response;
      if (!text) {
        return text;
      }
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    },
    getError(action, option, xhr) {//element的upload组件中的ajax文件中的方法
      let msg;
      if (xhr.response) {
        msg = `${xhr.status} ${xhr.response.error || xhr.response}`;
      } else if (xhr.responseText) {
        msg = `${xhr.status} ${xhr.responseText}`;
      } else {
        msg = `fail to post ${action} ${xhr.status}`;
      }

      const err = new Error(msg);
      err.status = xhr.status;
      err.method = 'post';
      err.url = action;
      return err;
    },
    uploadsuccess(res,file,filelist){//上传成功回调
       this.photocount = filelist.length;
       this.smlphoto_tmp=filelist.map(function(item,index){
            if(item.response){
                return item.response.data.sm_photo;
            }else{
              return item;
            }
       })
       this.bigphoto_tmp=filelist.map(function(item,index){
            if(item.response){
                return item.response.data.photo;
            }else{
              return item;
            }
       });
       for(var i = 0 ,len = filelist.length; i < filelist.length ; i++){
          this.smlphoto[i] = this.smlphoto_tmp[i];
          this.bigphoto[i] = this.bigphoto_tmp[i];
       }
    },
  },
  components: { 
     XTextarea,
     Group,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
   .message{background-color: #fff;}
   .message-title{padding:0.133333rem 0.4rem;width: 100%;font-size: 0.373333rem;margin-top:0.266667rem; color: #666;outline: none;display:block;}
   .message-tapwrap{height: 1.333333rem;line-height: 1.333333rem; padding:0 0 0 0.4rem;border-bottom: 1px solid #e8e8e8;font-size: 0.4rem;color: #666;}
   .message-tap{display: inline-block;margin:0 0.093333rem; width: 2.133333rem;height: 0.64rem;line-height: 0.64rem;font-size: 0.346667rem;color: #666;border-radius: 0.32rem;border:1px solid #d7d7d7;text-align: center;}
   .message-tap.cur{border-color: #edb622}
   .message .weui-textarea{font-size: 0.373333rem;color: #666;font-family: Arial}
   .message .weui-cell{padding:0 0.4rem 0;}
   .message .weui-textarea-counter{font-size: 0.293333rem;color: #cacaca;padding-bottom: 0.133333rem;border-bottom: 1px solid #e8e8e8}
   .message .weui-cells{margin-top: 0.346667rem}
   .messagebtn{position: fixed;bottom: 0;left: 0;width: 100%;height: 1.2rem;line-height: 1.2rem;font-size: 0.48rem; background-color: #f0bd22;border:none;}
   .upload-wrap{padding:0.4rem;}
   .message .weui-cells:before{border-top: none;}
   .msg-title .weui-cells:after{display: none;}
   .upload-wrap .el-upload--picture-card{background:#ededed url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAA5CAMAAAC4cX2fAAAAllBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AJcWoAAAAMXRSTlMA3fT6CBsD59CGcV1SOvAkEuriyaZ5SjMVxigPDdvXuK2pno6Lg4FpZUAg7L+ylFlFt5hbPQAAAelJREFUSMe91emOmzAUhuGvttnCEgIJIfsy2SbJLOf+b66mYjpNa+AQS33/gdAj+0jYMDXcj8jYaD8Es9eEGktewWrhUUujBTgNqLUBOK3bkTVrItQRZyrjLmSHzkrZhcgSppbhLv9R51Fn3te3+S5coi680dONQvzqQFYdoLuQZRegTGyRpMSErJtgZo/MkNgjCagtsTmGURQeN4LaakPyD4U69ZE/hWQRHoqy/shbCmA42WRSZpvJEMDirS+ydzWx/X7easbd90PG2jiLhxmftTLug6yXwMHwk6h1DyQGzvRPZyDmIztgKg2n0RQYs5EpcCdDuca5iA98krFPwGciQeNpPQYCJlIATXcxUDCRIRxqyMGciaT1+IwjT5nIAnETEmPBQL7XbGwOh4nEUNJsSIWYiQyAWdNpigETudefGvk7E5Ep0sRkiBSpZCI0gPk6mlRL5CLeEsowlVxh6bERegecFf3VygHe+xyPkVZ8esjXRkR9EBED6ij+eHFUQCx6ISQKAM6LVw/pxQFQiN6XV6Cgm0eXSzSHTgXPXKOr0MXv3HBFfZGvXRQldGVR7YuFmBNZJqgjEKP/gwh7Q8C3R3wE9kiAq7Q15BU42SInAO7Wzti6qJSTtNjLqTKqroF/e0a4+cEVup8cdWwmIiSr1QAAAABJRU5ErkJggg==) center no-repeat;background-size:0.906667rem 0.76rem; }
</style>
