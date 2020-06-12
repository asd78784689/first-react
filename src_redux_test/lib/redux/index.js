//自定义 redux 库 的主模块
//1) redux 库向外暴露下面几个函数
// createStore(): 接收的参数为 reducer 函数, 返回为 store 对象
// combineReducers(): 接收包含 n 个 reducer 方法的对象, 返回一个新的 reducer 函数
// applyMiddleware() // 暂不实现
// 2) store 对象的内部结构
// getState(): 返回值为内部保存的 state 数据
// dispatch(): 参数为 action 对象
// subscribe(): 参数为监听内部 state 更新的回调函数

//如果想用这个自定义的 redux 则在store 中 引入
//根据指定的 reducer 函数 创建一个store对象并返回
export function createStore(reducer){
	//接收 reducer函数对象 
	//例如 count(state=1,action) 这样
	//用来存储内部状态数据的变量,初始值为调用 reducer 函数返回的结果(外部指定的默认值)
	let state = reducer(undefined,{type:'@@redux/init'})
	//用来存储监听state更新回调函数的数组容器
	const listeners = []

	//返回当前内部的state
	function getState(){
		return state
	}
	//分发action 
	//触发 reducer调用 
	// 产生新的state
	//再调用所有已存在的监听回调
	function dispatch(action){
		//触发reducer调用
		const newState = reducer(state,action)
		//返回的state进行保存
		state = newState
		//触发保存的所有的回调
		listeners.forEach(listener=>listener())
	}
	//绑定内部state改变的监听回调 可给一个store 绑定多个监听
	function subscribe(listener){
		//保存到缓存 listener 的容器数组中  
		listeners.push(listener)
	}
	//返回store
	return {
		getState,
		dispatch,
		subscribe
	}
}

/*
	reducers的结构:{count:(state=2,action)=>3, user: (state={},action)=>{}}

	通过combineReducers 后 得到的总状态的结构
	{
		count:count(state.action,action),
		user:user(state.user,action)
	}
*/

//整合传入的包含多个reducer的对象 返回一个新的reducer函数 {r1:state1,r2:state2}
export function combineReducers(reducers){
	//返回一个新的 reducer 函数
	return (state={},action)=>{
		//遍历调用所有的 reducer , 并得到其返回的新状态值 并通过reduce累加封装成对象作为总的新的state对象
		//Object.keys(obj) 将对象的所有属性提取出来组成一个数组
		const newState = Object.keys(reducers).reduce((preState,key)=>{
			//通过遍历 reducers 将key值一一传入reduce()每一个reducers(key)运行的就是reducer函数对象
			//传入state对应属性的值与action (空的时候就返回state)
			preState[key] = reducers[key](state[key],action)
			return preState
		},{})
		//返回新的状态对象state
		return newState 
  	}
}
//之后的更新 就是当有触发 action 的方法函数时 调用到redux中的 dispatch 传入的action 会到reducer之中进行判断
//那么 combineReducers就会将当前的state 与 传入的action一并对 reducers中的reducer都传入并运行一次
//之后再度返回一个新的state回到store 用于组件使用 