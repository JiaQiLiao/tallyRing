import axios from '../api/https'
import 'element-ui/lib/theme-default/index.css'
import { Toast } from 'mint-ui'
var util  ={
    dateFtt:function(fmt,date)   //格式化时间
    { //author: meizz   
      var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return fmt;   
    },
    zan:function(id,type,like,callback){//点赞操作
        let _this = this;
        let status = false;
        if(status) return;
        status = true;
        axios.post('/User/like',{bbsid:id,commentid:type,bool:like}).then(function(res){
           console.log(res);
           if(res.data.state === 200){
             console.log('点赞成功');
             callback();
           }else{
             Toast(res.data.msg);
           }  
           status  = false;
        }).catch(function(err){
          Toast(err);
        }) 
    },
    getCookie:function(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
      else
      return null;
    }
}

export default util;