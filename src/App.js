// 应用的根组件

import React,{Component} from 'react'
import {Button , message} from 'antd'

const success = ()=>{
	message.success('被点击了！');
}

export default class App extends Component {

	//点击事件
	handleClick = ()=>{
		// alert('被点击了');
		message.success('被点击了！');
	}

	render(){
		return(
			<div>
				App
				<Button type="primary" onClick={this.handleClick}>Button</Button>
			</div>
		)
	}
}