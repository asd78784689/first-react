//reducer 函数模块 : 根据老的state与action 产生新的state的纯函数
import {combineReducers} from 'redux'  //用于整个多个reducer
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types' //引入定义好的type常量
//管理头部标题的reducer函数
//将获取到的state 与 action 进行判断 之后返回一个新的 state 每个数据建立一个对应的 
const initHeadTitle = '首页'
function headTitle(state=initHeadTitle,action){
	switch(action.type){
		case SET_HEAD_TITLE:
			return action.data
		default : 
			return state
	}
}
//管理当前登录用户
const initUser = storageUtils.getUser() //从 local storage 中获取到登陆用户信息
function user(state=initUser,action){
	switch(action.type){
		case RECEIVE_USER:
			return action.user
		case SHOW_ERROR_MSG:
		    return {...state,errorMsg:action.errorMsg}
		case RESET_USER:
			return {}
		default : 
			return state
	}
}
//combineReducers 接收包含所有reducer函数的对象， 返回一个新的reducer函数 (总reducer )
//之后返回了一个新的state 通过对应属性名获取对应属性值 
//state.count state.user
export default combineReducers({
	headTitle,
	user
})