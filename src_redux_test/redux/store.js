//redux 最核心的管理对象 : store
import {createStore,applyMiddleware} from 'redux' 
import thunk from 'redux-thunk'  //用于实现redux异步的redux中间件插件
import reducer from './reducer'
import {composeWithDevTools} from 'redux-devtools-extension'
//创建 store 对象 内部会第一次调用reducer() 用于得到初始状态值
//这样就返回了一个store对象 可直接通过import store 获取到 
//然后通过thunk 让reducer实现异步
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk))) 