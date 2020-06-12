import React,{Component} from 'react'
import { Card,Button, } from 'antd';
import ReactEcharts from 'echarts-for-react'

// 饼状图路由

export default class Pie extends Component{
	state = {
		sales:[
			{
				value:5,name:'衬衫'
			},{
				value:20,name:'羊毛衫'
			},{
				value:16,name:'雪纺衫'
			},{
				value:10,name:'裤子'
			},{
				value:10,name:'高跟鞋'
			},{
				value:20,name:'袜子'
			}], 		//销量
		inventorys:[
			{
				value:15,name:'衬衫'
		},{
				value:30,name:'羊毛衫'
		},{
				value:46,name:'雪纺衫'
		},{
				value:20,name:'裤子'
		},{
				value:20,name:'高跟鞋'
		},{
				value:40,name:'袜子'
		}]	//库存
	}
	//返回柱状图的配置对象
	getOption = ()=>{
		const {sales,inventorys} = this.state
		return {
			title: [
				{
		       		text: 'ECharts 入门示例'  
		    	},{
		    		subtext: '销量',
			        left: '16.67%',
			        top: '85%',
			        textAlign: 'center',
			        subtextStyle:{
			        	fontSize:16
			        }
		    	},{
		    		subtext: '库存',
			        left: '50%',
        			top: '85%',
			        textAlign: 'center',
			        subtextStyle:{
			        	fontSize:16
			        }
		    	}
		    ],
		    series: [	 //数据值
		    	{
			        name: '销量',
			        type: 'pie',		//图表类型
			        radius: '50%',
	            	center: ['50%', '50%'],
			        data: sales,
			        label: {
			            position: 'outer',
			            alignTo: 'none',
			            bleedMargin: 5
			        },
			        left:0,
			        right: '66.6667%',
			        top: 0,
			        bottom: 0
		    	},
		    	{
			        name: '库存',
			        type: 'pie',
			        radius: '55%',
	            	center: ['50%', '50%'],
			        data: inventorys,
			        label: {
			            position: 'outer',
			            alignTo: 'none',
			            bleedMargin: 5
			        },
			        left:'33.3333%',
			        right: '33.3333%',
			        top: 0,
			        bottom: 0
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
			<div className="pie">
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