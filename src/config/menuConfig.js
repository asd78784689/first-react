// 导航菜单配置
//在此处引入即可 

import React from 'react'
import { HomeOutlined,AppstoreOutlined,UnorderedListOutlined,ToolOutlined,UserOutlined,SafetyOutlined,AreaChartOutlined,BarChartOutlined,LineChartOutlined,PieChartOutlined } from '@ant-design/icons';

const menuList = [
	{
		title:'首页',
		key:'/home',
		icon:<HomeOutlined />,
		isPublic:true		//公开的页面
	},
	{
		title:'商品',
		key:'sub1',
		icon:<AppstoreOutlined />,
		children:[
			{
				title:'品类管理',
				key:'/category',
				icon:<UnorderedListOutlined />
			},
			{
				title:'商品管理',
				key:'/product',
				icon:<ToolOutlined />
			}
		]
	},
	{
		title:'用户管理',
		key:'/user',
		icon:<UserOutlined />
	},
	{
		title:'角色管理',
		key:'/role',
		icon:<SafetyOutlined />
	},
	{
		title:'图形图表',
		key:'sub2',
		icon:<AreaChartOutlined />,
		children:[
			{
				title:'柱状图',
				key:'/charts/bar',
				icon:<BarChartOutlined />
			},
			{
				title:'折线图',
				key:'/charts/line',
				icon:<LineChartOutlined />
			},
			{
				title:'饼图',
				key:'/charts/pie',
				icon:<PieChartOutlined />
			}
		]
	}
]

export default menuList