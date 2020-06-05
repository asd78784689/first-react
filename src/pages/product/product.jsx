import React,{Component} from 'react'
import {Switch,Route} from 'react-router-dom'
// import { Card,Button,Table,Modal,Input,Select,message } from 'antd';

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'
// 产品路由
// const {Option} = Select; 
export default class Product extends Component{

	state={
		data :[]
	}

	// constructor(props){
	// 	super(props);
		
	// }

	render(){
		return(
			<div className="product">
				<Switch>
					<Route path='/product/addupdate' component={ProductAddUpdate} />
					<Route path='/product/detail' component={ProductDetail} />
					<Route path='/product' component={ProductHome} />
				</Switch>
			</div>
		)
	}
}