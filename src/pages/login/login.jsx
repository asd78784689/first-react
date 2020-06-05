import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './login.less'
import logo from '../../assets/images/logo.png'
//获取封装的登录api
import {reqLogin} from '../../api/'
 
//表单验证
const minNum = 4;
const maxNum = 12;
const formPattern =/^\w{4,12}$/;

// 登陆的路由组件
export default class Login extends Component{
	//在Form的ref属性中绑定它 之后就能调用Form进行相应API操作
	formRef = React.createRef();
	//提交表单且数据验证成功后回调事件	
	//await所在函数（最近的)定义的左侧使用async 才能正常使用await
	onFinish = async (values)=>{
		// console.log('Success:', values);
		//验证成功后的数据进行解构赋值并传递给登录api进行ajax
		const {username,password} = values
		//加上async 和 await 达到简化promise对象的使用 不用使用then()来指定成功/失败的回调
		//并用同步编码方式达到异步流程
		// try{
			//await 会异步等待async的完成的返回值
			//在返回promise的表达式左侧使用await 这样就能异步获取到promise异步执行成功的value数据
		const response = await reqLogin(username,password)
		const result = response.data
		console.log('success',result)
		// }catch(error){
			//但因为ajax封装时候就进行了错误的功能包装 所以不需要再调用时考虑调用失败的回调提示
			// 想要触发就是ajax的url请求地址出错时 
			// console.log('error',error)
		// }
		//通过ajax请求后返回的值判断是否登陆成功
		if(response.status===0){
			//登录成功
			message.success('登录成功！')
			//将登录信息进行保存 方便之后管理界面的调用 这个是将其保存于内存中
			memoryUtils.user = result
			//这个是保存在Storage中 这样刷新时也能保存登陆状态
			storageUtils.saveUser(result)

			//跳转到管理界面 (不需要回退到登陆界面 直接前往管理后台界面即可)
			this.props.history.replace('/')
		}else{
			//登陆失败
			message.error(response.msg)
		}
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
		const user = memoryUtils.user
		if(user && user._id){
			return <Redirect to="/" />
		}

		return(
			<div className="login">
				<header className="login-header">
					<img src={logo} alt="logo" />
					<h1>React项目:后台管理系统</h1>
				</header>
				<section className="login-content">
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