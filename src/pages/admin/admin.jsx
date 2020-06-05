import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd';
// import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import './admin.less'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Content, Footer, Sider } = Layout;
// 后台管理的路由组件
export default class Admin extends Component{

	render(){
		const user = memoryUtils.user
		if(!user || !user._id){
			//如果user没值或者没有_id就 表示当前没有登录 自动跳转到登陆界面(在render()中)
			//在事件回调的函数方法中呢则是用this.props.history.push/replace进行路由跳转
			//而在render()中则是通过return <Redirect>这个标签进行这个操作
			return <Redirect to="/login" />
		}
		return(
			<Layout style={{height:'100%'}}>
			    <Sider>
			      <LeftNav />
			    </Sider>
			    <Layout>
			      <Header style={{ padding: 0 }} />
			      <Content style={{ margin: '24px 16px 0',backgroundColor:"#fff",overflowY: "auto" }}>
		        	<Switch>  
		                <Route path='/home' component={Home} />
		                <Route path='/category' component={Category} />
		                <Route path='/product' component={Product} />
		                <Route path='/role' component={Role} />
		                <Route path='/user' component={User} />
		                <Route path='/charts/bar' component={Bar} />
		                <Route path='/charts/line' component={Line} />
		                <Route path='/charts/pie' component={Pie} />
		                <Redirect to="/home" />
            		</Switch>
			      </Content>
			      <Footer style={{ textAlign: 'center',color:'#ccc' }}>推荐使用谷歌浏览器 可以获得更佳页面操作体验</Footer>
			    </Layout>
			  </Layout>
		)
	}
}