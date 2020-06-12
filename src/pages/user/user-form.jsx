import React,{PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { Form,Input,Select  } from 'antd';

const { Option } = Select;


// 用户中的表单组件

//PureComponent 只会在 state 或者 prop 的值修改时才会再次渲染。
export default class UserForm extends PureComponent{
	formRef = React.createRef();
	// static propTypes = {
		// roles:PropTypes.array.isRequired
	// } 
	state={
		isShowForm:false,
		formItemLayout:{
		  labelCol: { span: 6 },
		  wrapperCol: { span: 14 },
		}
	}
	componentDidMount(){
		// console.log(this.formRef)
		this.props.setForm(this.formRef)
	}
	componentDidUpdate(){
		//当props/state 有更新时候触发 再次对form表单中的值进行设置 
		if(this.formRef.current && this.formRef.current.setFieldsValue){
			const {
				username='',
				phone='',
				email='',
				role_id=''
			} = this.props.data 
			this.formRef.current.setFieldsValue({
				'username':username,
				'phone':phone,
				'email':email,
				'role_id':role_id
			})
		}	
	}
	//获取不到Select的选项 要不就通过保存于form之中进行调取 
	selectChange = (value)=>{
		// console.log(value)
		this.formRef.current.setFieldsValue({
			role_id:(value)
		})
	}
	//获取当前选中项
	getSelect = ()=> {return this.formRef.current.getFieldValue('role_id')}
	//获取表单填入值
	getResult = ()=> {
		return this.formRef.current.getFieldsValue()
	}
	//进行表单验证
	getValidate = ()=>{    //自定义方法，用来传递数据（需要在父组件中调用获取数据）
        return this.formRef.current.validateFields()
    }
	render(){
		const {formItemLayout} = this.state
		const {roles,data} = this.props
		const {
			username='',
			phone='',
			email='',
			role_id=''
		} = data 
		return(

			<Form
		        name="addUserName"
		        {...formItemLayout}
  				ref={this.formRef}
  				initialValues={{
  					username:username,
					'phone':phone,
					'email':email,
					'role_id':role_id
  				}}
	      	>
		        <Form.Item name="username" label="用户名">
		          <Input placeholder="请输入用户名" />
		        </Form.Item>
		        {
		        	data._id?null:(
		        		<Form.Item name="password" label="密码">
				          <Input.Password placeholder="请输入密码" />
				        </Form.Item>
		        	)
		        }
		        <Form.Item name="phone" label="手机号">
		          <Input placeholder="请输入手机号" />
		        </Form.Item>
		        <Form.Item name="email" label="邮箱">
		          <Input placeholder="请输入邮箱" />
		        </Form.Item>
		        <Form.Item name="role_id" label="角色">
		        	<Select placeholder="请选择角色" onChange={this.selectChange}>
		          		{
		          			roles.map(role=>{return <Option key={role._id} value={role._id}>{role.name}</Option>})
						}
		        	</Select>
		        </Form.Item>
	      	</Form>
		)
	}
}