import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Button } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dateUtils'
import './index.less'
//头部的组件
class Header extends Component{

	//更新系统时间 每隔1s触发一次
	getSysTime = ()=>{
		this.intervalId = setInterval(()=>{
			this.setState({currentTime:formateDate(Date.now())})
		},1000)
	}

	//点击退出按钮触发退出登录事件
	handleClick = (event)=>{
		//退出登录 并跳转到/login界面
		// console.log(event);
		// console.log('退出')
		//删除内存中的登陆数据
		storageUtils.removeUser()
		memoryUtils.user = '';
		// console.log(this.props)
		this.props.history.push('/login')
	}

	constructor(props){
		super(props)
		// 先给一个初始值方便先渲染
		this.state = { 
			dayPicUrl: '', //天气图片
			weather:'',		//天气文本
			currentTime:formateDate(Date.now()) //当前时间字符串
		} 
	}
	//当组件完成时候再进行jsonp请求
	componentDidMount(){
		reqWeather('河源').then(response=>{
			// console.log(response)
			this.setState({ dayPicUrl: response.dayPictureUrl,weather: response.weather || '晴'})
		}).catch(error=>{
			console.log(error)
		})
		this.getSysTime();
	}
	//当组件要被卸载时清除定时器
	componentWillUnmount(){
		clearInterval(this.intervalId)
	}

	render(){
		const user = memoryUtils.user.username;
		const title = memoryUtils.title || '首页';
		const {dayPicUrl,weather,currentTime} = this.state
		// console.log(this.state)
		return(
			<div className="header">
				<div className="header-top">
					<span>欢迎,{user}</span>
					<Button type="link" onClick={this.handleClick}>退出</Button>
				</div>
				<div className="header-bottom">
					<div className="header-bottom-left">
						{title}
					</div>
					<div className="header-bottom-right">
						<span>{currentTime}</span>
						<img src={dayPicUrl} alt="weather" />
						<span>{weather}</span>
					</div>
				</div>
			</div>
		)
	}
}
export default withRouter(Header)