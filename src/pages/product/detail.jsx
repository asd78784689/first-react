import React,{Component} from 'react'
import { Card ,Button,List} from 'antd';
import { ArrowLeftOutlined  } from '@ant-design/icons';
import {reqCategory} from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'

//Product 的详情页子路由组件
export default class ProductDetail extends Component{
	state = {
		data:[],
		categoryName:'',
		pCategoryName:''
	}
	//完成组件展示

	constructor(props){
		super(props)
		// console.log(this.props.location.query)
		const detailData = this.props.location.query

		if(detailData){
			this.state.data = detailData
			this.getCategory(detailData)
		}else{
			this.props.history.replace('/product/')
		}
	}

	//获取分类名称
	getCategory = async (data) =>{
		const {pCategoryId,categoryId} = data
		// console.log(data)
		let result
		if(pCategoryId === "0"){
			//处于一级分类之中
			// console.log(1)
			result = await reqCategory(categoryId)
			// console.log(result)
			this.setState({categoryName:result.data.name})
		}else{
			//处于二级分类之中
			console.log(2)
			result = await reqCategory(pCategoryId)
			let child = await reqCategory(categoryId)
			console.log(child)
			this.setState({categoryName:child.data.name,pCategoryName:result.data.name})
		}
	}

	//返回按钮被点击
	backClick = e =>{
		// console.log('返回')
		// console.log(this.props)
		this.props.history.replace('/product')
	}

	render(){
		const {data,categoryName,pCategoryName}  = this.state
		// console.log(data)
		return (
			<div className="productDetail">
				<Card
					title={
						<div>
							<Button 
								type="link" 
								icon={<ArrowLeftOutlined />}
								onClick={this.backClick}
							></Button>
							<span>商品详情</span>
						</div>
					} 
					style={{ width: '100%' }}
				>
				    <List>
				    	<List.Item style={{fontSize:'16px'}}>
				          <span className="left">商品名称:</span>{`${data.name}`}
				        </List.Item>
				        <List.Item style={{fontSize:'16px'}}>
				          <span className="left">商品描述:</span>{` ${data.desc}`}
				        </List.Item>
				        <List.Item style={{fontSize:'16px'}}>
				          <span className="left">商品价格:</span>{` ${data.price}元`}
				        </List.Item>
				        <List.Item style={{fontSize:'16px'}}>
				          <span className="left">所属分类:</span>{` ${data.pCategoryId==='0'? categoryName : `${pCategoryName}-->${categoryName}`}`}
				        </List.Item>
				        <List.Item className="list-item-start">
				          <span className="left">商品图片:</span>
				          {	
				          	data.imgs   
				          	? data.imgs.map(img=>(
				          		<img 
				          			key={img}
				          			className="product-img" 
				          			src={`${BASE_IMG_URL}${img}`} 
				          			alt="img" />
				          	))
				          	: ''
				          }
				        </List.Item>
				        <List.Item className="list-item-start">
				          <span className="left">商品详情:</span>
				          <span dangerouslySetInnerHTML={{__html:data.detail}} className="product-detail-span"></span>
				        </List.Item>
				    </List>
				</Card>
			</div>
		)
	}
}