import React,{Component } from 'react'
import { Card ,Button,Form,Input ,InputNumber,Cascader,message} from 'antd';
import { ArrowLeftOutlined  } from '@ant-design/icons';
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'
// import {BASE_IMG_URL} from '../../utils/constants'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { TextArea } = Input;

//Product 的添加和更新子路由组件
export default class ProductAddUpdate extends Component{
	//在Form的ref属性中绑定它 之后就能调用Form进行相应API操作
	formRef = React.createRef();
	picRef = React.createRef();
	richRef = React.createRef();
	state = {
		data:[],
		loading: false,
		title:'添加',
		categoryData:[],
		parentId:0,
		defaultCategory:[]
	}
	constructor(props){
		super(props)
		// console.log(this.props.location.query)
		//通过是否有传入值判断是添加还是修改
		const updateData = this.props.location.query
		if(updateData){
			this.state.title = '修改'
			this.state.data = updateData
			//处理一下默认选中的级联项
			const result = this.setDefault(updateData)
			this.state.defaultCategory = result
		}else{
			this.state.title = '添加'
		}
	}
	//
	componentDidMount(){
		// console.log(this.state)
		this.getCategoryList(0)
	}
	//对默认选中级联数据进行渲染
	setDefault = (data) =>{
		let arr
		if(data.pCategoryId === '0'){
			//说明在一级分类之中
			arr = [data.categoryId]
		}else{
			//在二级分类中	要对categoryData进行一次获取更新
			//但渲染时会出现 还没有结果返回就设定了默认值所以暂时不搞有二级分类的情况
			//查看pdf中的做法 通过其思路改进
			 
			arr = [data.pCategoryId,data.categoryId]
		} 
		return arr
	}
	//完成添加/更新操作
	//获取对应数据 并进行封装为一个对象再进行请求
	//获取分类的数据
	getCategoryList = async (parentId,itemIndex)=>{
		const result = await reqCategorys(parentId)
		//如果是一级分类那么设为false用于获取下一个分类 如果不等于0说明是二级分类那么就设置为true不用获取
		let isLeafTF = parentId !== 0 ? true : false
		if(result.status === 0){
			let data = result.data
			let newData = data.map((item,index)=>{
				item.value = item._id
				item.label = item.name
				item._index = index   //下标值
				item.isLeaf = isLeafTF   //用于获取下一个分类
				return item
			})
			// console.log(newData)
			if(parentId===0){
				//说明parentId为0 那么直接通过initOptions给 categoryData 赋值
				// console.log(0)
				// this.setState({categoryData:newData})
				// return newData
				this.initOptions(newData)
			}else{
				// console.log(1)
				//说明是获取到子分类 那么此时循环后的Data为一个children属性的值
				return newData
			}
		}
	}
	//生成级联的一级/二级列表
	initOptions = async (categorys) =>{
		// console.log(categorys)
		// console.log(this.state)
		const {title} = this.state
		const {pCategoryId} = this.state.data
		//获取title以及一级分类id
		if(title==='修改' && pCategoryId!=='0'){
			//修改界面且商品是一个二级分类下的
			const subCategorys = await this.getCategoryList(pCategoryId)
			// console.log(subCategorys)
			//获取到分类信息后在一级分类信息中进行查找 当一级分类的value与该二级分类的pCategoryId一致就返回
			const targetOption = categorys.find(item=>item.value === pCategoryId)
			// console.log(targetOption)
			//设为false并给该一级分类的children属性赋值
			targetOption.loading = false
			targetOption.children = subCategorys
		}
		//进行设置分类数据
		this.setState({categoryData:categorys})
	}
	//动态加载选项
	loadData = async (selectOptions) =>{
		// console.log(selectOptions[0])
		//获取选中项
		const targetOption = selectOptions[0];
		targetOption.loading = true;
		//获取到选中项下的二级分类数据
		const subCategorys = await this.getCategoryList(targetOption._id,targetOption._index)
		// const result = await reqCategorys(targetOption._id)
		targetOption.loading = false;
		//当有二级分类数据时候进行赋值
		if(subCategorys && subCategorys.length>0){
			targetOption.children = subCategorys
		}else{
			targetOption.isLeaf = true
		}

		this.setState({categoryData:[...this.state.categoryData]})
	}
	
	//返回按钮被点击
	backClick = e =>{
		// console.log('返回')
		// console.log(this.props)
		this.props.history.replace('/product')
	}
	//选项发生改变
	onChange = (value)=>{
		console.log(value)
		// console.log(value[0] === this.state.defaultCategory[0])

	}
	
	//进行提交操作
	goToSubmit = (e)=>{
		// console.log('进行提交！')
		// console.log(this.refs.pictures)
		//获取到商品图片当前的图片名的数组
		const imgs = this.picRef.current.getImg()
		const detail = this.richRef.current.getDetail()
		const thisData = this.state.data
		// console.log(imgs)
		// console.log(rictText)
		// console.log(this.state.data)
		// console.log(this.formRef.current.validateFields)
		//触发Form表单验证
		//收集数据发送给对应的接口 reqAddOrUpdateProduct
		//获取到 state 中的 data 进行对应赋值再传给接口 
		this.formRef.current
			.validateFields()
			.then(values=>{
				// console.log(values)
				let {name,desc,price,sort} = values
				//进行数值更新
				let pCategoryId = ''
				let categoryId = ''
				if(sort.length===1){
					pCategoryId = '0'
					categoryId = sort[0]
				}else{
					pCategoryId = sort[0]
					categoryId = sort[1]
				}
				// console.log(thisData)
				const product = {name,desc,price,categoryId,pCategoryId,imgs,detail}
				if(thisData._id && thisData._id !== ''){
					product._id = thisData._id
				}
				this.setProduct(product)
			}).catch(error=>{
				console.log(error)
			})
	}
	//进行请求 
	//修改是成功的 但是添加是失败的 回调为成功但是并没有出现添加项
	setProduct = async (data)=>{
		// console.log(data)
		const result = await reqAddOrUpdateProduct(data)
		// console.log(result)
		if(result.status === 0){
			message.success(`${this.state.title}成功`)
			// console.log(this.props)
			this.props.history.replace('/product')
		}else{
			message.error('保存商品失败')
		}
	}
	render(){
		const { title,categoryData,data,defaultCategory } = this.state;
		// console.log(defaultCategory)
		return (
			<div className="productAddUpdate">
				<Card
					title={
						<div>
							<Button 
								type="link" 
								icon={<ArrowLeftOutlined />}
								onClick={this.backClick}
							></Button>
							<span>{`${title}商品`}</span>
						</div>
					} 
					style={{ width: '100%' }}
				>
			      <Form
			      	labelAlign="left"
			      	ref={this.formRef}
			      	initialValues={{
				        ['price']: data.length===0?0:data.price,
			      	}}
			      >
			      	<Form.Item
				        name="name"
				        label="商品名称"
				        rules={[
				          {
				            required: true,
				            message: '请输入商品名称',
				          },
				        ]}
				        initialValue={data.length===0?'':data.name}
				      >
				        <Input />
				    </Form.Item>
				    <Form.Item
				        name="desc"
				        label="商品描述"
				        rules={[
				          {
				            required: true,
				            message: '请输入商品描述',
				          },
				        ]}
				        initialValue={data.length===0?'':data.desc}
				     >
				        <TextArea 
				        	autoSize={{minRows:2,maxRows:6}}
				        />
				    </Form.Item>
				    <Form.Item
				        label="商品价格"
				      >
				      	<Form.Item 
					      	name="price" 
					      	noStyle 
					      	rules={[
					          {
					            required: true,
					            message: '请输入商品价格',
					          },
					        ]}
				        >
				      		<InputNumber 
				      			min={0}
					      		style={{ width: 360,padding:'0 10px',
									  borderTopRightRadius: 0,
									  borderBottomRightRadius:0}}
								// defaultValue={data.length===0?'':data.price}
							/>
				      	 </Form.Item>
				      	<span className="productPrice">元</span>
				    </Form.Item>
				    <Form.Item
				        name="sort"
				        label="商品分类"
				        rules={[
				          {
				            required: true,
				            message: '请选择商品分类',
				          },
				        ]}
				        initialValue={defaultCategory}
				      >
				        <Cascader
				         		options={categoryData} 
				         		loadData={this.loadData}
				         		onChange={this.onChange} 
				         		style={{width:'400px'}}
				         		// defaultValue={defaultCategory}
				        />
				    </Form.Item>
				    <Form.Item
				        name="productimg"
				        label="商品图片"
				    >
				        <PicturesWall ref={this.picRef} imgs={data.length===0?'':data.imgs} />
				    </Form.Item>
				    <Form.Item
				        name="productdetail"
				        label="商品详情"
				      >
				        <RichTextEditor ref={this.richRef} detail={data.length===0?'':data.detail} />
				    </Form.Item>
				    <Form.Item
				        name="productButton"
				      >
				        <Button type="primary" onClick={this.goToSubmit}>提交</Button>
				    </Form.Item>
			      </Form>
			    </Card>
			</div>
		)
	}
}