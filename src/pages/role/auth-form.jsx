import React,{PureComponent } from 'react'
import { Form,Input,Tree  } from 'antd';

import menuList from '../../config/menuConfig'
// 设置权限组件
const { TreeNode } = Tree;
//PureComponent 只会在 state 或者 prop 的值修改时才会再次渲染。
export default class AddForm extends PureComponent{
	formRef = React.createRef();
	state = {
		checkedKeys:[] 
	}
	constructor(props){
		super(props);
		// console.log(this.props.role)
		// this.state.role = this.props.role
		// console.log(menuList)
		this.treeNodes = this.getTreeNodes(menuList)
		const {menus} = this.props.role
		this.state = {
			checkedKeys:menus
		}
	}

	onCheck = (checkedKeys, info) => {
    	// console.log('onCheck', checkedKeys);
    	this.setState({checkedKeys})
	};

	//为父组件提交获取最新 menus 数据的方法
	getMenus = () => this.state.checkedKeys

	//获取树形控件内容
	getTreeNodes = (menuList)=>{
		// console.log(menuList)
		return menuList.reduce((pre,item)=>{
			pre.push(
				<TreeNode title={item.title} key={item.key} >
					{item.children?this.getTreeNodes(item.children):null}
				</TreeNode>
			)
			return pre
		},[])
	}

	render(){
		const {role} = this.props

		const formItemLayout = {
			labelCol:{span:5},
			wrapperCol:{span:16}
		}
		const {checkedKeys} = this.state
		// console.log(role)
		//arr1.every(item=>arr2.indexOf(item)) 
		//将props传入的menus 与当前state中保存的进行一一对比 如果不是完全相同就进行替换 然后再次执行render渲染
		// const checkedKeys = this.state.checkedKeys.every(item=> this.props.role.menus.indexOf(item)) ? this.state.checkedKeys : this.props.role.menus
		// console.log(checkedKeys)
		return(

			<Form
		        name="authRole"
		        {...formItemLayout}
  				ref={this.formRef}
	      	>
		        <Form.Item 
		        	name="name" 
		        	label="角色名称"
		        >
		          <Input placeholder={role.name}  disabled  />
		        </Form.Item>
		        <Form.Item >
		        	<Tree
				      checkable									//节点前添加 Checkbox 复选框
				      defaultExpandAll={true}					//默认展开所有树节点
				      onCheck={this.onCheck}					//点击复选框触发
				      checkedKeys={checkedKeys}				//（受控）选中复选框的树节点 选中的值保存于state之中 这样触发onCheck时候在进行一次setState才能实现选中效果
				    >
				    	<TreeNode title="平台权限" key="all" >
				    		{this.treeNodes}
				    	</TreeNode>
				    </Tree>
		        </Form.Item>
	      	</Form>
		)
	}
}