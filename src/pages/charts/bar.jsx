import React,{Component} from 'react'
import { Card,Button, } from 'antd';

// 柱状图路由

export default class Bar extends Component{

	constructor(props){
		super(props);
	}

	render(){

		return(
			<div className="bar">
				<Card
				 	title={
				 		<Button type="primary">设置用户权限</Button>
				 	}
					style={{height:'100%'}}
				>

				</Card>
			</div>
		)
	}
}