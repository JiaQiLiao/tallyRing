import Mock from 'mockjs'
let Random = Mock.Random;

let postlist = {//帖子模板
	    headpic:Random.dataImage(),
	    name:Random.cname(),      
	    datetime:Random.date('yyyy-MM-dd'),
	    title:Random.sentence(),
	    summary:Random.sentence(),
	    "piclist|1-9":[{
	      src:Random.dataImage("200x100","测试图片效果"), 
	      w:200,
	      h:100        
	    }],
	    "message|1-1000" : 1,
	    "zan|1-1000":1,
	    "iszan":Random.boolean(1,1,false)
}

let postdata = (function(){
	let temp = [];
	 for(var i = 0 ; i < 5 ; i++){
        temp.push(postlist);            
	 }
	 return temp;
})()

let weekdiscuss = {
	  title:Random.sentence(),
	  "yes|1-1000" : 1,
	  "no|1-1000" :1,
	  "message|1-1000":1,
	  "zan|1-1000":1,
	  "isvote":Random.boolean(1,1,false)
}

let vote = {
	 "status":Random.boolean(1,1,false)
}

let operate = {
	 "title":Random.sentence(),
	 "summary":Random.sentence(),
	 "message|1-1000":1,
	 "zan|1-1000":1
}

let hotweek = {
     "title":Random.sentence(),
     "date":Random.date('yyyy-MM-dd'),
     "joins|1-10000":1,
     "istop":Random.boolean(1,1,false)
}
 
let hotweeklist = (function(){
   	let temp = [];
   	 for(var i = 0 ; i < 5 ; i++){
           temp.push(hotweek);            
   	 }
   	 return temp;
})()


Mock.mock('http://www.guinaben.com:8070/getpostlist',postdata)
Mock.mock('http://www.guinaben.com:8070/weekdiscuss',weekdiscuss)
Mock.mock('http://www.guinaben.com:8070/vote',vote)
Mock.mock('http://www.guinaben.com:8070/operate',operate)
Mock.mock('http://www.guinaben.com:8070/hotweek',hotweeklist)

export default Mock