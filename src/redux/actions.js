//包含 n 个用于创建action的工厂函数(action creator)

import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER } from './action-types'

//获取封装的登录api
import {reqLogin} from '../api/index.js'
import storageUtils from '../utils/storageUtils'
// import {INCREMENT,DECREMENT} from './action-types'
//增加的 action creator
// export const increment = (number) =>({type:INCREMENT,data:number})

// //异步的 增加action creator 返回的是函数
// export const incrementAsync = (number) => {
// 	//执行异步
// 	return dispatch =>{
// 		setTimeout(()=>{
// 			//执行完成时分发一个同步的action
// 			dispatch(increment(number))
// 		},1000)
// 	}
// }

//设置头部标题
export const setHeadTitle = (headTitle)=> ({type:SET_HEAD_TITLE,data:headTitle})

//接收用户的 同步 action
export const receiveUser = (user)=>({type:RECEIVE_USER,user})
//显示错误信息 同步 action
export const showError = (errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})

//退出登录的同步 action
export const Logout = ()=>{
	storageUtils.removeUser()
	return {type:RESET_USER}
}

//登录的异步action
export const login = (username,password)=>{
	return  async dispatch=>{
		const result = await reqLogin(username,password)
		if(result.status === 0){
			const user = result.data
			//保存在 local之中
			storageUtils.saveUser(user)
			dispatch(receiveUser(user))
		}else{
			const msg = result.msg
			dispatch(showError(msg))
		}
	}
}