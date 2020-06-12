import React,{Component} from 'react'
import {connect} from 'react-redux'

import Counter from '../components/Counter'
import {increment,decrement,incrementAsync} from '../redux/actions'

//将state数据 转为 ui组件的标签属性 在ui组件中以 this.props.xx调用到
function mapStateToProps(state){
	return {
		count:state.count
	}
}

//将分发action的函数转为ui组件的标签属性 同样以 this.props.xx调用到该方法
function mapDispatchToProps(dispatch){
	return {
		increment:(number) =>dispatch(increment(number)),
		decrement:(number) =>dispatch(decrement(number)),
		incrementAsync:(number) =>dispatch(incrementAsync(number)),
	}
}


//容器组件 通过 connect 包装 UI组件产生组件
//connect()为一个高阶函数 返回的函数为一个高阶组件 ： 接收一个UI组件 生成 一个容器组件
//而 容器组件负责数据与业务逻辑
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Counter)