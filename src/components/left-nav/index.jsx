import React,{Component} from 'react'
import {Link , withRouter} from 'react-router-dom'
import { Layout, Menu } from 'antd';
// import { HomeOutlined,AppstoreOutlined,UnorderedListOutlined,ToolOutlined,UserOutlined,SafetyOutlined,AreaChartOutlined,BarChartOutlined,LineChartOutlined,PieChartOutlined } from '@ant-design/icons';

import './index.less'
import logo from '../../assets/images/logo.png'
import menuConfig from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;
const { Sider } = Layout;

//左侧导航的组件
class LeftNav extends Component{

	constructor(props){
		super(props);
		//获取当前路由path并保存
		var {pathName,openKey} = this.getPathName()
		// console.log(pathName)
		this.state = { pathKey: pathName,openKey: openKey || 'sub1'}
		// this.menuNodes = this.getMenuNodes(menuConfig);
	}

	//点击时候进行跳转 this.props为空 之后进行尝试 
	handleClick = (event)=>{
		// const key = event.key
		// console.log(event)
		//将对应选中项的文字保存于内存中方便调用
		memoryUtils.title = event.item.props.children[1].props.children.props.children;
		// console.log(this)
		// this.props.history.push(key)
	} 

	//循环渲染menunode节点
	getMenuNodes = (menuList) =>{
		//获取 memoryUtils 中当前user的menus信息 对 menuConfig 进行对比筛选 符合条件的才进行渲染
		return menuList.reduce((pre,item)=>{
			if(this.hasAuth(item)){
				if(!item.children){
					pre.push((
						<Menu.Item key={item.key} icon={item.icon}>
				          	<Link to={item.key}>{item.title}</Link>
	          		  	</Menu.Item>
		          	))
				}else{
					// console.log(this.props.location.pathname)
					pre.push((
						<SubMenu key={item.key} icon={item.icon} title={item.title} style={{ backgroundColor:"#001529" }}>
				            {this.getMenuNodes(item.children)}
				         </SubMenu> 
					))
				}
			}
			return pre
		},[])
	}
	//判断是否有权限进行访问
	hasAuth = (item)=>{
		// console.log(item)
		const {key,isPublic} = item
		const {menus} = memoryUtils.user.role
		const username = memoryUtils.user.username
		//如果是admin 管理员 就直接通过 他是全部权限
		//或者 如果当前item为公开的(isPublic值为true时) 直接返回true
		//又或者 当前用户有此item的权限 --- key 是否在menus之中
		if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
			// console.log('1.通过')
			return true
		}else if (item.children && item.children.length!==0){
			// console.log('2.通过')
			//如果当前用户有此item的某个子item的权限 
			//！！双感叹号强制转换为布尔值
			return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
		}
		return false

	}
	//获取当前路由path并保存
	getPathName = ()=>{
		let pathName = this.props.location.pathname
		if(pathName === '/') pathName = '/home'
		// this.state = { pathKey: pathName}
		// 如果当前path为SubMenu下的子菜单项 那么就让对应的SubMenu展开
		let openKey,thisTitle
		menuConfig.forEach((item)=>{
			if(item.children){
				// console.log(item)
				item.children.forEach((items)=>{
					// console.log(items.key === pathName)
					if(items.key === pathName){
						openKey = item.key;
						thisTitle = items.title;
					}
				})
			}else if(item.key === pathName){
				thisTitle = item.title;
			}
		})
		//设置当前要选中的菜单项以及需要展开的菜单列表
		// this.setState({ pathKey: pathName,openKey: openKey || 'sub1'})
		//将对应选中项的文字保存于内存中方便调用
		memoryUtils.title = thisTitle;
		this.menuNodes = this.getMenuNodes(menuConfig);
		//返回相应参数用于设置state
		return {pathName:pathName,openKey:openKey}
		
	}

	componentDidMount(){
		//将当前路由path保存起来
		// let pathName = this.props.location.pathname
		// console.log(pathName)
		// this.setState({ pathKey : pathName })
		//浏览器进行后退前进等操作时候 直接刷新页面
		window.onpopstate = ()=>{
			console.log('浏览器后退/前进了！')
			this.props.history.go(0)
		}
	}

	render(){
		return(
			<div className="left-nav">
				<Link to="/" className="left-nav-Link">
					<img src={logo} alt='logo' />
					<h1>小贱后台</h1>
				</Link>
				<Sider width={200} className="sites-layout-background">
			        <Menu
			          mode="inline"
			          defaultSelectedKeys={[this.state.pathKey]}
			          defaultOpenKeys={[this.state.openKey]}
			          style={{ height: '100%', borderRight: 0,backgroundColor:"#001529" }}
			          onClick={this.handleClick.bind(this)}
			        >
			          {this.menuNodes}
			        </Menu>
		      	</Sider>
			</div>
		)
	}
}
export default withRouter(LeftNav)