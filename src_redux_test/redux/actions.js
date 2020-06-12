//包含 n 个用于创建action的工厂函数(action creator)

import {INCREMENT,DECREMENT} from './action-types'
//增加的 action creator
export const increment = (number) =>({type:INCREMENT,data:number})
//减少的 action creator
export const decrement = (number) =>({type:DECREMENT,data:number})
//异步的 增加action creator 返回的是函数
export const incrementAsync = (number) => {
	//执行异步
	return dispatch =>{
		setTimeout(()=>{
			//执行完成时分发一个同步的action
			dispatch(increment(number))
		},1000)
	}
}