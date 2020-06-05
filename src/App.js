// 应用的根组件

import React,{Component} from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom';
// import {Button , message} from 'antd'

import Admin from './pages/admin/admin'
import Login from './pages/login/login'

import './App.less'

export default class App extends Component {

    //用BrowserRouter作为最外层元素 方便其他元素用得到Link等路由组件
    //Switch用于匹配 当匹配成功后 就停止匹配
    //Route便是路由项了 path为跳转的路径  
	render(){
		return(
			<BrowserRouter>
				<Switch>  
	                <Route path='/login' component={Login} />
	                <Route path='/' component={Admin} />
	            </Switch>
			</BrowserRouter>
		)
	}
}