import React,{Component} from 'react'
import { Card,Button,Table,Modal,message } from 'antd';
import {QuestionCircleOutlined} from '@ant-design/icons';
import UserForm from './user-form'
import {reqUsers,reqAddOrUpdateUser,reqDeleteUser} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

const { confirm } = Modal;
// 用户路由

export default class User extends Component{
	userRef = React.createRef();
	state={
		users :[],
		isShowForm:false,
		formItemLayout:{
		  labelCol: { span: 6 },
		  wrapperCol: { span: 14 },
		}
	}

	constructor(props){
		super(props);
		this.getUsers()
		this.state.columns = [
		  {
		    title: '用户名',
		    dataIndex: 'username',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '邮箱',
		    dataIndex: 'email',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '电话',
		    dataIndex: 'phone',
		    render: text => <span>{text}</span>,
		  },
		  {
		    title: '注册时间',
		    dataIndex: 'create_time',
		    render: text => <span>{this.getTime(text)}</span>,
		  },
		  {
		    title: '所属角色',
		    dataIndex: 'role_id',
		    render: role_id => <span>{this.roleNames[role_id]}</span>,
		  },
		  {
		    title: '操作',
		    render: (text,record) =>  
		    			<div>
		    				<Button type="link" onClick={()=>this.showUpdate(record)}>修改</Button>
		    				<Button type="link" onClick={()=>this.deleteUsers(record)}>删除</Button>
		    			</div>,
		  },
		];
	}

	//获取角色信息
	getUsers = async ()=>{
		const result = await reqUsers()
		// console.log(result)
		if(result.status === 0){
			const {users,roles} = result.data
			// console.log(data.users)
			this.initRoleNames(roles)
			this.setState({users,roles})
		}
	}
	//获取对应的所属角色名称对象
	//通过遍历roles 将每一项的 _id 作为其下标 然后对应其值为name 
	initRoleNames = (roles)=>{
		const roleNames = roles.reduce((pre,role)=>{
			pre[role._id] = role.name
			return pre
		},{})
		// console.log(roleNames)
		this.roleNames = roleNames
	}
	//将时间进行更新
	getTime = (time)=>{
		if(time && time!==0){
  			const newTime = new Date(time)
	  		let str = `${newTime.getFullYear()}-${newTime.getMonth()+1}-${newTime.getDate()} ${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`
	  		return str
  		}else{
  			return ''
  		}
	}
	//显示对话框 试试是否能通过 confirm 的形式 再通过传参决定是添加还是修改的操作是否可行  
	showModal = () => {
		this.user = null
	    this.setState({
	      isShowForm: true,
	    });
	};
	showUpdate = (user)=>{
		this.user = user
		this.setState({
	      isShowForm: true,
	    });
	}
	//删除用户操作
	deleteUsers = (record)=>{
		confirm({
		    title: `确定要删除${record.username}吗？`,
		    icon: <QuestionCircleOutlined />,
		    onOk: async ()=> {
				console.log('OK');
				const result = await reqDeleteUser(record._id)
	      		if(result.status === 0){
					message.success('删除成功')
				}else{
					message.error('删除失败')
				}
				this.getUsers()
	    	},
		    onCancel() {
	      		console.log('Cancel');
		    },
	  	});
	}

	//点击确定 表单验证功能无法正常调用?????


	addOrUpdateUser = async (e) => {
	    // console.log(e);
	    //进行表单数据获取 将数据包装为 user 对象 再传给接口进行添加/更新的操作 reqAddOrUpdateUser 
	    // console.log(this.form)
	    //防止提交时候没有生成role_id
	    const role_id = this.userRef.current.getSelect()
	    console.log(this.userRef.current.getValidate())	//用 validateFields 进行校验没效果
	    console.log(this.userRef.current.getResult())  //这是用 getFieldsValue 直接获取表单值

	    //直接获取表单填入值 校验没有任何结果
		const values = this.userRef.current.getResult()
		if(this.user && this.user._id!==''){
			values._id = this.user._id
		}
		values.role_id = role_id
		const result = await reqAddOrUpdateUser(values)
		if(result.status === 0){
			message.success(`成功`)
			this.getUsers()
		}else{
			message.error(`失败`)
		}
	    this.setState({
	      isShowForm: false,
	    });
	};
	
	render(){
		const {columns,users,isShowForm,formItemLayout,roles} = this.state
		const user = this.user
		return(
			<div className="productUser">
				<Card
				 	title={
			 			<Button type="primary" onClick={this.showModal}>创建用户</Button>
				 	}
					style={{height:'100%'}}
				>
			      <Table
				    columns={columns}
				    rowKey={record => record._id}
				    dataSource={users}
				    bordered
				    pagination={{defaultPageSize:PAGE_SIZE}}
				  />
				  <Modal 
				  	title={user ? '修改用户' : '添加用户'}
					visible={isShowForm}
					onCancel={() => this.setState({isShowForm: false})}
					onOk={this.addOrUpdateUser}
				  >
				  	<UserForm 
				  		setForm={(form)=>this.form = form}
				  		data={user?user:{}}
				  		roles={roles}
				  		ref={this.userRef}
				  	/>
				  </Modal>
			    </Card>
			</div>
		)
	}
}