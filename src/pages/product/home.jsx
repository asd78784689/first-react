import React,{Component} from 'react'
import { Card,Button,Table,Input,Select } from 'antd';
import {reqProducts,reqSearchProducts,reqUpdateProductStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

const {Option} = Select;
//Product 的默认子路由组件
export default class ProductHome extends Component{

	state={
		data :[],
		total:0, //数据总数 用于渲染分页器的总数
		selector:'0',
		searchType:'productName',
		pageNum:1,
	}

	constructor(props){
		super(props);
		this.state.columns = [
		  {
		    title: '商品名称',
		    dataIndex: 'name',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '商品描述',
		    dataIndex: 'desc',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '价格',
		    dataIndex: 'price',
		    render: text => <span>{`￥${text}`}</span>,
		  },
		  {
		    title: '状态',
		    dataIndex: 'status', //1在售 2已下架
		    render: (text,record) => 
		    			<div>
		    				<Button type="primary" onClick={()=>this.updateStatus(record)}>{text===1 ? '下架' : '上架'}</Button>
		    				<div>{text===1 ? '在售' : '已下架'}</div>
		    			</div>,
		  },
		  {
		    title: '操作',
		    render: (text,record) =>  
		    			<div>
		    				<Button type="link" onClick={()=>this.goToDetail(record)}>详情</Button>
		    				<Button type="link" onClick={()=>this.goToUpdate(record)}>修改</Button>
		    			</div>,
		  },
		];
	}

	componentDidMount(){
		this.getProducts(1)
	}

	//根据指定页码的列表数据显示
	getProducts = async (pageNum) =>{
		// this.pageNum = pageNum
		// console.log(pageNum)
		const result = await reqProducts(pageNum,PAGE_SIZE)
		// console.log(result)
		if(result.status === 0){
			const {total,list} = result.data
			this.setState({data:list,total,pageNum})
		}
	}
 
	//搜索栏的分类搜索栏改动
	selectChange = (value) =>{
		// console.log(value)
		if(value === '0'){
			//{pageNum,pageSize,searchType,searchName}
			//按名称搜索 productName
			this.setState({searchType:'productName'})
		}else{
			//按描述搜索 productDesc
			this.setState({searchType:'productDesc'})
		}
		// console.log(this.state)
	}
	//搜索栏input发生改动时
	searchChange = (e)=>{
		// console.log(e.target.value)
		//如果input为空时进行一次getProducts(1)
		const value = e.target.value
		// console.log(!value)
		if(!value){
			this.getProducts(1)
		}
	}
	//按下搜索按钮
	goToSearch = async (e) =>{
		const {searchType} = this.state
		// console.log(pageNum)
		let pageNum = 1  //为了搜索结果能够读取到前面的值
		const iptVal = this.refs.input.state.value
		//获取input的值以及当前选中的搜索方式进行ajax获取到搜索请求
		if(iptVal && iptVal !== ''){
			let result = await reqSearchProducts({
				pageNum,
				pageSize:PAGE_SIZE,
				searchType,
				searchName:iptVal
			})
			// console.log(result)
			let {list,total} = result.data
			this.setState({data:list,total})
		}
	}

	//添加商品按钮被点击
	goToAdd = e =>{
		// console.log('返回')
		// console.log(this.props)
		this.props.history.replace('/product/addupdate')
	}
	//修改按钮被点击
	goToUpdate = record =>{
		// console.log('返回')
		// console.log(record)
		this.props.history.push({pathname:'/product/addupdate',query:record})
	}
	//详情按钮被点击
	goToDetail = (record) =>{
		// console.log(record)
		this.props.history.push({pathname:'/product/detail',query:record})
	}
	//对商品进行上/下架处理
	updateStatus = async (record) =>{
		const {pageNum} = this.state
		// console.log(pageNum)
		let result
		if(record.status === 1){
			// console.log(1)productId,status
			result = await reqUpdateProductStatus(record._id,2)
		}else{
			result = await reqUpdateProductStatus(record._id,1)
		}
		//如果成功了就再获取一次
		if(result.status === 0){
			this.getProducts(pageNum)
		}
	}
	render(){
		const {columns,total,data,selector} = this.state 
		return (
			<div className="productHome">
				<Card
				 	title={
				 		<div>
				 			<Select defaultValue={selector} style={{borderRadius:'5px'}} onChange={this.selectChange}>
						      <Option value="0">按名称搜索</Option>
						      <Option value="1">按描述搜索</Option>
						    </Select>
						    <Input placeholder='关键字' ref='input' onChange={this.searchChange} style={{width:'140px',margin:'0 15px',borderRadius:'5px'}} />
						    <Button type="primary" onClick={this.goToSearch}>搜索</Button>
				 		</div>
				 	}
				 	extra={<Button type="primary" onClick={this.goToAdd}>+ 添加商品</Button>}
					style={{height:'100%'}}
				>
			      <Table
				    columns={columns}
				    rowKey={record => record._id}
				    dataSource={data}
				    pagination={{
				    	total:total,
				    	defaultPageSize:PAGE_SIZE,
				    	current:1,
				    	onChange:this.getProducts
				    	}}
				    bordered
				    
				  />
			    </Card>
			</div>
		)
	}
}