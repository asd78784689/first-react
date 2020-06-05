// 发送ajax的封装axios模块

import axios from 'axios';
import {message} from 'antd'

export default function ajax(url , data={} ,type="GET"){

	return new Promise(function(resolve,reject){
		let promise
		if(type === 'GET'){
			promise = axios.get(url,{ //配置对象
				params:data      //指定请求参数
			})
		}else{
			promise = axios.post(url,data)
		}
		promise.then(response=>{
			//如果ajax调用成功就resolve
			resolve(response.data)
		}).catch(error=>{
			//对所有ajax请求出错做统一处理 这样外层调用时候就不用去处理错误了
			//失败就提示请求后台出错
			message.error('请求错误'+error.message)
		})
	})
	
}