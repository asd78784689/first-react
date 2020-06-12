import React,{Component} from 'react'
import { Card,Button, } from 'antd';
import ReactEcharts from 'echarts-for-react'

// 柱状图路由

export default class Bar extends Component{
	state = {
		sales:[5,20,16,10,10,20], 		//销量
		inventorys:[15,30,46,20,20,40]	//库存
	}
	//返回柱状图的配置对象
	getOption = ()=>{
		const {sales,inventorys} = this.state
		return {
			title: {
		        text: 'ECharts 入门示例'  
		    },
		    tooltip: {},
		    legend:{   
		    	data:['销量','库存']  //分类按钮 
		    },
		    xAxis: {
		        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']  //数据文本
		    },
		    yAxis: {},
		    series: [	 //数据值
		    	{
		        name: '销量',
		        type: 'bar',
		        data: sales
		    	},
		    	{
		        name: '库存',
		        type: 'bar',
		        data: inventorys
		    	}
		    ]
		}
	}
	//点击时进行数据更新
	update = ()=>{
		//将原有销量数据都+1 库存数据都-1 
		const sales = this.state.sales.map(sale=>sale+1)
		const inventorys = this.state.inventorys.map(inventory=>inventory-1)
		this.setState({
			sales,
			inventorys
		})
	}
	render(){

		return(
			<div className="bar">
				<Card
				 	title={
				 		<Button type="primary" onClick={this.update}>更新</Button>
				 	}
					style={{height:'100%'}}
				>
				</Card>
				<Card title="柱状图一">
					<ReactEcharts option={this.getOption()} style={{height:300}} />
				</Card>
			</div>
		)
	}
}