// 自定义react-redux 模块

import React from 'react'
import PropTypes from 'prop-types'

/*

	1) react-redux 向外暴露了 2 个 API
		a. Provider 组件类
		b. connect 函数
	2) Provider 组件
		接收 store 属性
		让所有容器组件都可以看到 store, 从而通过 store 读取/更新状态
	

*/

//用于给所有容器组件提供store的组件类
export class Provider extends React.Component{

	static propTypes ={
		store:PropTypes.object.isRequired //声明接收store
	}
	//声明提供的context的数据名和类型
	static childContextTypes = {
		store:PropTypes.object
	}
	//向所有有声明子组件提供包含要传递数据的context对象
	getChildContext(){
		return {store:this.props.store}
	}


	render(){
		//将其子节点返回
		return this.props.children
	}
}

/*
	3) connect 函数
		接收 2 个参数: mapStateToProps 和 mapDispatchToProps
		mapStateToProps: 为一个函数, 用来指定向 UI 组件传递哪些一般属性
		mapDispatchToProps: 为一个函数或对象, 用来指定向 UI 组件传递哪些函数属性
		connect()执行的返回值为一个高阶组件: 包装 UI 组件, 返回一个新的容器组件
		容器组件会向 UI 传入前面指定的一般/函数类型属性
*/
export function connect (mapStateToProps,mapDispatchToProps){
	
	//接收一个UI组件 
	return (UIComponent)=>{
		//返回一个将 ui组件进行包装后的容器组件
		return class ContainerComponent extends React.Component{

			//声明接收的context数据的名称和类型
			static contextTypes = {
				store:PropTypes.object
			}
			//作为Provider的子组件将context的值接收使用
			constructor(props,context){
				super(props)
				console.log('connect()',context.store) 
				//得到store
				const {store} = context
				//得到包含所有一般属性的对象
				const stateProps = mapStateToProps(store.getState())
				//将所有一般属性作为容器的状态数据 因为一般属性会有所改变 所以保存为容器的状态数据
				this.state = {...stateProps}
				
				let dispatchProps
				//如果传入的是函数 直接传入dispatch即可
				if(typeof mapDispatchToProps=== 'function'){
					//得到包含所有函数属性的对象
					dispatchProps = mapDispatchToProps(store.dispatch)
				}else{
					//不然就得进行包装
					//传入的是对象 那每一个属性名和值都是一个 action的工厂函数 需要通过调用dispatch()
					//再将这个工厂函数传入 执行完后便是一个对应的函数属性 其值是一个运行dispatch的方法
					dispatchProps = Object.keys(mapDispatchToProps).reduce((pre,key)=>{
						const actionCreator = mapDispatchToProps[key]	
						pre[key] = (...args)=>{
							store.dispatch(actionCreator(...args)) //参数透传
						}
						return pre
					},{})
				}
				
				//最后dispatchProps 为一个对象 属性是一个函数名 值是一个调用dispatch方法进行store值更新的操作函数
				//保存到组件上 因为函数属性的不会改变 所以保存于组件上即可
				this.dispatchProps = dispatchProps

				//绑定 store 的 state 变化的监听
				store.subscribe(()=>{
					//store 内部的状态数据发生变化时 
					//更新容器组件 => UI组件更新
					this.setState({...mapStateToProps(store.getState())}) 
				})
			}

			render(){
				return(
					<UIComponent {...this.state} {...this.dispatchProps} />
				)
			}
		}
	}
}
