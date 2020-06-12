import React,{Component} from 'react'
import { Card,Button,Table,Modal,message  } from 'antd';
import {reqAddRole,reqRoles,reqUpdateRole} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'
import './role.less'
import AddForm from './add-form'
import AuthForm from './auth-form'
import {connect} from 'react-redux'
import {Logout} from '../../redux/actions'

// 角色路由

class Role extends Component{
	addForm = React.createRef();
	authForm = React.createRef()
	state={
		//所有角色的列表
		roles :[
			
		],
		isShowAdd:false,
		isShowAuth:false,
		role:{},//选中的role  
	}

	constructor(props){
		super(props);
		this.state.columns = [
		  {
		    title: '角色名称',
		    dataIndex: 'name',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '创建时间',
		    dataIndex: 'create_time',
		    render: text => <span>{this.getTime(text)}</span>,
		  },
		  {
		    title: '授权时间',
		    dataIndex: 'auth_time',
		    render: text => <span>{this.getTime(text)}</span>,
		  },
		  {
		    title: '授权人',
		    dataIndex: 'auth_name',
		    render: text => <span>{text}</span>,
		  },
		];
	}
	onRow = role  => {	
		return {
			onClick: (event) => {// 点击表头行也就是点击了
				// console.log(role)
				this.setState({role})
			}, 
		};
  	}
  	//获取时间
  	getTime = (time)=>{
  		// console.log(new Date(time))
  		//2019-4-7 20:18:41
  		if(time && time!==0){
  			const newTime = new Date(time)
	  		let str = `${newTime.getFullYear()}-${newTime.getMonth()+1}-${newTime.getDate()} ${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`
	  		return str
  		}else{
  			return ''
  		}
  		
  	}
  	//获取角色列表数据
  	getRoles = async ()=>{
  		const result = await reqRoles()
  		if(result.status === 0){
  			//获取成功
  			const roles = result.data
  			// console.log(roles)
  			this.setState({roles})
  		}
  	}
  	componentDidMount(){
  		this.getRoles()
  	}
  	//显示创建用户对话框
	showModal = () => {
	    this.setState({
	      isShowAdd: true,
	    });
	};
	//点击确定添加角色
	addRole = e => {
	    // console.log(e);
	    // console.log(this.addForm)
	    // console.log(this.addForm.current.goToSubmit())
	   	//this.addForm.current.resetFields() //重置表单数值
	    this.addForm.current.goToSubmit()
	    	.then( async (data)=>{
	    		// console.log(data.name)
	    		const result = await reqAddRole(data.name)
	    		// console.log(result)
	    		if(result.status === 0){
	    			message.success('添加角色成功')
	    			const role = result.data
	    			//更新状态
	    			// const roles = [...this.state.roles]
	    			// roles.push(role)
	    			// this.setState({
	    			// 	roles
	    			// })
	    			this.setState(state=>({
	    				roles:[...state.roles,role]
	    			}))

	    		}else{
	    			message.error(result.msg)
	    		}
	    		this.addForm.current.resetFields() //重置表单数据
	    		this.setState({
			      isShowAdd: false
			    });
	    	},e=>{
	    		console.log(e)
	    	})
	};
	//显示设置角色权限对话框
	showAuth = () => {
	    this.setState({
	      isShowAuth: true,
	    });
	};
	//点击确定设置角色权限
	addAuth = async () => {
	    // console.log(e);
	    //点击确定时 要通过 reqUpdateRole 对对应角色的权限进行更新操作
	    //获取到 _id menus 
	    // console.log(this.state.role)
	    // console.log(this.authForm.current.getMenus())
	    //获取到选择项和设置权限的选项数组 传递给接口进行更新
	    const {role} = this.state
	    const menus = this.authForm.current.getMenus()
	    role.menus = menus
	    role.auth_name = this.props.user.username //获取授权人信息 即当前登录对象 
	    const result = await reqUpdateRole(role)
	    // console.log(result)
	    if(result.status ===0){
	    	message.success('设置权限成功')
	    	//如果当前更新的是自己角色的权限 那么强制退出去登陆
	    	if(role._id===this.props.user.role_id){
	    		this.props.Logout()
	    		message.info('当前用户的权限更新了,请重新登陆 ')
	    		this.props.history.replace('/login')
	    	}else{
	    		this.getRoles()
	    	}
	    }else{
	    	message.error(result.msg)
	    }
	    this.setState({
	      isShowAuth: false
	    });
	};
	render(){
		const {columns,roles,isShowAdd,isShowAuth,role} = this.state
		return(
			<div className="role">
				<Card
				 	title={
				 		<div className="card-button">
				 			<Button type="primary" onClick={this.showModal}>创建用户</Button>
				 			<Button type="primary" disabled={!role._id} onClick={this.showAuth}>设置用户权限</Button>
				 		</div>				 	}
					style={{height:'100%'}}
				>
			      <Table
				    columns={columns}
				    rowKey='_id'
				    dataSource={roles}
				    bordered
				    pagination={{defaultPageSize:PAGE_SIZE}}
				    rowSelection={{
				    	type:'radio',
				    	selectedRowKeys:[role._id],
				    	onSelect:(role)=>{
				    		this.setState({
				    			role
				    		})
				    	}
				    }}
				    onRow={this.onRow}
				  />
			    </Card>
			    <Modal
		          title="创建用户"
		          visible={isShowAdd}
		          onOk={this.addRole}
		          onCancel={()=>{
		          	this.setState({isShowAdd: false})
		          	// console.log(this.addForm.current.formRef.current.resetFields())
		          	this.addForm.current.formRef.current.resetFields() //重置表单数值
		          }}
		        >
		          <AddForm
		          	setForm={(form)=>{this.form = form}}
		          	ref={this.addForm}
		          />
		        </Modal>
		        <Modal
		          title="设置角色权限"
		          visible={isShowAuth}
		          onOk={this.addAuth}
		          onCancel={()=>{this.setState({
				      isShowAuth: false
				    });}}
		        >
		        	<AuthForm
		        		role={role}
		        		ref={this.authForm}
		        		key={role._id}  //当 key 变化时， React 会创建一个新的而不是更新一个既有的组件
		          	/>
		        </Modal>
			</div>
		)
	}
}
export default connect(
	state=>({user:state.user}),
	{Logout}
)(Role)