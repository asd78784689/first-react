import React,{Component} from 'react'
import { Card,Button,Table,Modal,Input,Select,message,Breadcrumb  } from 'antd';
import './category.less'

import {reqCategorys, reqAddCategory, reqUpdateCategory} from "../../api";
 
const {Option}  = Select;
// 商品分类路由
export default class Category extends Component{
	state={
		data:[],
		parentId:0,
		parentName:'', //当前需要显示的父分类名称
		childData:[],	//子分类列表数据
		visible:false,//添加的对话框
		visibleS:false,//修改分类的对话框
		cateName:'',
		selectVal:'0', //添加分类的分类默认选项
		loading:true
	}

	constructor(props){
		super(props);
		this.state.columns = [
		  {
		    title: '分类名称',	 //顶部的title
		    dataIndex: 'name',   //数据值的key值
		    width:'75%'			 //所占的width值
		  },
		  {
		    title: '操作',
		    dataIndex:'name',
		    render: (text,record) => 
		    			<div>
		    				<Button type="link" data-title={text} data-id={record._id} onClick={this.updateClick}>修改分类</Button> 
		    				<Button type="link" onClick={()=>this.seeChild(record)} disabled={this.state.parentId !== 0}>查看子分类</Button>
		    			</div>,    //渲染时候的内容
		    width:'25%'
		  },
		];
	}
	//当组件准备好的时候触发获取列表数据
	componentDidMount(){
		reqCategorys(this.state.parentId).then(response=>{
			// console.log(response)
			this.setState({data:response.data},)
			setTimeout(()=>{
				this.setState({loading:false})
			},2000)
		}).catch(error=>{	
			console.log(error)
		})
	}
	//获取分类列表数据
	getCategorys = ()=>{
		reqCategorys(this.state.parentId).then(responses=>{
			// console.log(responses)
			if(this.state.parentId === 0){
				this.setState({data:responses.data})
				setTimeout(()=>{
					this.setState({loading:false})
				},2000)
			}else{
				//如果不是0说明是获取子分类数据
				this.setState({childData:responses.data})
				setTimeout(()=>{
					this.setState({loading:false})
				},2000)
			}
		})
	}
	//点击查看子分类按钮触发事件
	seeChild = (categorys)=>{
		// console.log('查看子分类')
		// console.log(categorys)
		this.setState(
			{parentId:categorys._id,parentName:categorys.name}
			,()=>{this.getCategorys()})
	}

	//点击添加按钮事件
	addClick = (event)=>{
		//添加分类 的功能 
		//在一级分类界面时只能添加一级 在子分类界面时候就添加其二级分类
		//主要是id的改动即可
		const {parentId} = this.state
		// console.log(parentId !== 0)
		if(parentId !== 0){
		// 	// console.log(this.state)
			this.setState({selectVal:"1"},()=>{
		// 		console.log(this.state)
				this.setState({visible:true})
			})
		}else{
			this.setState({selectVal:"0"},()=>{
				console.log(this.state)
				this.setState({visible:true})
			})
		}
		// console.log('添加!')
		
	}
	//添加对话框点击确认
	handleOk = e =>{
		// console.log('确认')
		// console.log(e)
		//先在state中设置两个用于add时候的默认值 Select和Input的值会将其进行更新 
		//点击确定时候进行判断 如果Input的值为空就不进行add 如果有值进行添加分类项
		const iptVal = this.refs.addInput.state.value
		const selVal = this.state.parentId
		// console.log(iptVal && iptVal != '')
		console.log(selVal)
		if(iptVal && iptVal !== ''){
			// console.log(1);
			//如果不为空就进行添加操作并进行更新
			this.setState({loading:true})
			reqAddCategory(selVal,iptVal).then(response=>{
				// console.log(response)
				this.getCategorys()
			}).catch(error=>{	
				console.log(error)
				message.error(error.msg);
			})
		}else{
			message.info('分类名不能为空哦~');
		}
		this.setState({visible:false})
	}
	//添加对话框点击取消
	handleCancel = e =>{
		console.log('取消')
		this.setState({visible:false})
	}
	//选项发生改变
	handleChange = (value)=> {
	  // console.log(`selected ${value}`);
	  this.setState({selectVal:value})
	}
	//点击修改分类按钮事件
	updateClick = (event)=>{
		// console.log('添加!')
		// console.log(e.parentNode.getAttribute('data-title'));
		//保存点击项对应的title值和id值 并将其保存于state之中
		//对button下的span触发click事件进行处理 防止button跟span均能触发click事件
		let e
		//因为button中的span会触发onclick所以要进行检测 
		if(event.target.nodeName === 'SPAN'){
			e = event.target.parentNode
		}else{
			e = event.target
		}
		const value = e.getAttribute('data-title')
		const Id = e.getAttribute('data-id')
		// console.log(e)
		//只有当数据设置完毕后才执行显示 
		//将对应项的name和id进行保存以及对对话框中的input的value进行设置后才进行其显示效果
		const fn = ()=> {return new Promise(resolve=>{
				this.setState({cateName:value,cateId:Id})
				resolve()
			}) 
		}
		fn().then(response=>{
			if(this.refs.input){
				// console.log(this.refs.input)
				this.refs.input.state.value = value
			}
			this.setState({visibleS:true})
		})
		
		
	}
	//修改分类对话框点击确认
	handleOkS = e =>{
		console.log('确认')
		// console.log(e)
		//给input绑定change改变或者其他事件 当改动结束后修改state上的value值 而当其点击
		//确定按钮时候就将其进行update更新操作 并看看是否会重新渲染
		const {cateId,cateName} = this.state
		const IptVal = this.refs.input.state.value
		//通过这个值进行修改
		// console.log(this.state)
		// console.log(this.refs.input.state.value)
		// console.log(categoryName !== IptVal)
		if(IptVal && IptVal !== ''){
			if(cateName !== IptVal){
				//进行更新操作
				this.setState({loading:true})
				reqUpdateCategory({categoryId:cateId,categoryName:IptVal}).then(response=>{
					// console.log(response)
					// this.setState({data:response.data})
					// 成功修改后重新获取一次进行更新
					this.getCategorys()
				}).catch(error=>{	
					console.log(error)
				})
			}
		}else{
			message.info('分类名不能为空哦~');
		}
		
		this.setState({visibleS:false})
	}
	//修改分类对话框点击取消
	handleCancelS = e =>{
		// console.log('取消')
		this.setState({visibleS:false})
	}
	//返回一级分类列表
	backTo = e =>{
		this.setState({parentId:0,parentName:''})
	}
	render(){
		// console.log(this.state)
		const {columns,data,cateName,selectVal,loading,childData,parentName,parentId} = this.state
		// console.log(cateName)
		return(
			<div className="category">
				<Card 
					title={
						<Breadcrumb separator=">">
						    <Breadcrumb.Item onClick={this.backTo}>一级分类列表</Breadcrumb.Item>
						    <Breadcrumb.Item>{parentName}</Breadcrumb.Item>
						</Breadcrumb>
					} 
					style={{height:'100%'}}
					extra={<Button type="primary" onClick={this.addClick}>+ 添加</Button>}
				>
			      <Table
				    columns={columns}
				    dataSource={parentId === 0 ? data : childData}
				    bordered
				    rowKey='_id'
				    loading={loading}
				  />
			    </Card>
			     <Modal
		          title="添加分类"
		          visible={this.state.visible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		        >
		          <p>所属分类:</p>
		          <Select value={selectVal} style={{width:'100%',marginBottom:'10px'}} onChange={this.handleChange} ref='select'>
				      <Option value="0" disabled={selectVal !== '0'}>一级分类</Option>
				      <Option value="1" disabled={selectVal === '0'}>二级分类</Option>
				   </Select>
		          <p>分类名称:</p>
		          <Input placeholder="请输入分类名称"  ref='addInput' />
		        </Modal>
		        <Modal
		          title="修改分类"
		          visible={this.state.visibleS}
		          onOk={this.handleOkS}
		          onCancel={this.handleCancelS}
		        >
		          <Input defaultValue={cateName} ref='input' />
		        </Modal>
			</div>
		)
	}
}