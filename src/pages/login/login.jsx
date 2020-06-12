import React,{PureComponent} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from '../../assets/images/logo.png'

import {login} from '../../redux/actions'
import {connect} from 'react-redux'
 
//表单验证
const minNum = 4;
const maxNum = 12;
const formPattern =/^\w{4,12}$/;

// 登陆的路由组件
class Login extends PureComponent{
	//在Form的ref属性中绑定它 之后就能调用Form进行相应API操作
	formRef = React.createRef();
	//提交表单且数据验证成功后回调事件	
	//await所在函数（最近的)定义的左侧使用async 才能正常使用await
	onFinish = async (values)=>{
		// console.log('Success:', values);
		//验证成功后的数据进行解构赋值并传递给登录api进行ajax
		const {username,password} = values
		
		this.props.login(username,password)

  	}
	//提交表单且数据验证失败后回调事件	
	onFinishFailed = (errorInfo)=>{
		console.log('Failed:', errorInfo);
	}
	//点击按钮
	handleClick = (event) =>{
		event.stopPropagation()
		// console.log(event)
	}
	// 
	// componentDidMount() {
	// 	// 获取到form表单 并执行相应操作
	//     this.formRef.current.setFieldsValue({
	//       username: 'Bamboo',
	//     });
	// }

	render(){
		const user = this.props.user
		if(user && user._id){
			return <Redirect to="/home" />
		}

		return(
			<div className="login">
				<header className="login-header">
					<img src={logo} alt="logo" />
					<h1>React项目:后台管理系统</h1>
				</header>
				<section className="login-content">
					<div className={user.errorMsg?'error-msg show':'error-msg'}>{user.errorMsg}</div>
					<h2>用户登陆</h2>
					<Form
				      className="login-form"
				      onFinish={this.onFinish}
				      onFinishFailed={this.onFinishFailed}
				      ref={this.formRef}
				    >
				      <Form.Item
				        name="username"
				        rules={[
				        	{ required: true,whitespace:true, message: '请输入至少4位的用户名!'},
				        	{ message: '用户名至少4位!',min:minNum},
				        	{ message: '用户名至多12位!',max:maxNum},
				        	{ message: '用户名必须是英文、数字和下划线组成!',pattern:formPattern },
				        ]}
				      >
				        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
				      </Form.Item>

				      <Form.Item
				        name="password"
        				rules={[
        					{ required: true, message: '请输入至少4位的密码!'},
				        	{ message: '密码至少4位!',min:minNum},
				        	{ message: '密码至多12位!',max:maxNum},
				        	{ message: '密码必须是英文、数字和下划线组成!',pattern:formPattern },
        				]}
				      >
				        <Input prefix={<LockOutlined className="site-form-item-icon" />}
          					   type="password"
          					   placeholder="密码" />
				      </Form.Item>

				      <Form.Item >
				        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleClick}>
				          登录
				        </Button>
				      </Form.Item>
				    </Form>
				</section>
			</div>
		)
	}
}
export default connect(
	state=>({user:state.user}),
	{login}
)(Login)