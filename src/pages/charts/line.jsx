import React,{Component} from 'react'
import { Card,Button, } from 'antd';

// 折线图路由

export default class Line extends Component{
	constructor(props){
		super(props);
	}

	render(){

		return(
			<div className="line">
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