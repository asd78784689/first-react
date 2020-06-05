import React,{Component} from 'react'
import { Form,Input, } from 'antd';
import PropTypes from 'prop-types'

// 添加表单组件
export default class AddForm extends Component{
	formRef = React.createRef();
	static propTypes = {
		setForm:PropTypes.func.isRequired
	}
	constructor(props){
		super(props);
		console.log(this.props.form)
		this.props.setForm(this.props.form)
	}
	//进行提交操作
	goToSubmit = ()=>{
		// console.log('进行提交！')
		// console.log(this.refs.pictures)
		//触发Form表单验证
		//收集数据发送给对应的接口 reqAddOrUpdateProduct
		//获取到 state 中的 data 进行对应赋值再传给接口 
		return this.formRef.current.validateFields()
	}
	render(){
		const formItemLayout = {
			labelCol:{span:5},
			wrapperCol:{span:16}
		}
		return(

			<Form
		        name="addRole"
		        {...formItemLayout}
  				ref={this.formRef}
	      	>
		        <Form.Item 
		        	name="name" 
		        	label="角色名称"
		        	rules={[
			          {
			            required: true,
			            message: '角色名称必须输入',
			          },
			        ]}
		        >
		          <Input placeholder="请输入角色名称" />
		        </Form.Item>
	      	</Form>
		)
	}
}