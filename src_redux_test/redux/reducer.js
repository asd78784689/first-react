//reducer 函数模块 : 根据老的state与action 产生新的state的纯函数
import {combineReducers} from 'redux'  //用于整个多个reducer
import {INCREMENT,DECREMENT} from './action-types'  //引入定义好的type常量
//管理count状态数据的reducer 并给予一个初始值
//将获取到的state 与 action 进行判断 之后返回一个新的 state 每个数据建立一个对应的 
function count(state=1,action){
	switch(action.type){
		case INCREMENT:
			return state + action.data
		case DECREMENT:
			return state - action.data
		default : 
			return state
	}
}
const initUser = {}
function user(state=initUser,action){
	switch(action.type){

		default : 
			return state
	}
}
//combineReducers 接收包含所有reducer函数的对象， 返回一个新的reducer函数 (总reducer )
//之后返回了一个新的state 通过对应属性名获取对应属性值 
//state.count state.user
export default combineReducers({
	count,
	user
})