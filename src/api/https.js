import axios from 'axios'
import qs from 'qs'
import { Toast } from 'mint-ui'
import util from '../assets/common'
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '//dev-bbs.ajzhan.com/Api/';
// axios.defaults.baseURL = 'http://192.168.1.129:8383';
//POST传参序列化
axios.interceptors.request.use((config) => {
  if(config.method  === 'post'){
    config.data = qs.stringify(config.data);
  }
  return config;
},(error) =>{   
   Toast(error);
});

axios.interceptors.response.use((res) =>{ 
    if(res.data.state == '201'){ //201未登录，跳转原生登录
       if(window.client){
          window.client.toLogin();
       }else if(window.toLogin){
          window.toLogin();
       }
    }    
     return res;     
}, (error) => {    
  Toast('网络异常')
  console.log('网络异常',error);  
});
export default axios;