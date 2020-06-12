import React,{Component} from 'react'
import {Card,Statistic,DatePicker,Timeline  } from 'antd'
import moment from 'moment';
import { ArrowUpOutlined, ArrowDownOutlined,QuestionCircleOutlined,UndoOutlined  } from '@ant-design/icons';
import Line from './line'
import Bar from './bar'
import './home.less'


const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
// 首页路由

export default class Home extends Component{
	state = {
		isVisited:true
	}
	handleChange = (isVisited)=>{
		return ()=>this.setState({isVisited})
	}
	render(){
		const {isVisited} = this.state
		return(
			<div className="home">
				<Card style={{width:'100%'}} className="homeCard" bordered={false}>
					<Card title='商品总量'  extra={<QuestionCircleOutlined />}  style={{width:'15%',height:'200px',marginRight:'15%'}}>
			          <Statistic
			            value={1128163}
			            valueStyle={{ fontWeight: 'bold' }}
			            precision={0}
			            suffix="个"
			          />
			          <Statistic
			            value={'周同比15%'}
			            precision={0}
			            valueStyle={{ fontWeight: 'normal',fontSize:'16px'}}
			            suffix={<ArrowDownOutlined style={{color:'#cf1322'}} />}
			          />
			          <Statistic
			            value={'日同比10%'}
			            precision={0}
			            valueStyle={{ fontWeight: 'normal',fontSize:'16px' }}
			            suffix={<ArrowUpOutlined  style={{color:'#3f8600'}} />}
			          />
			        </Card>
			        <Line />
				</Card>
				<Card 
					className="home-menu"
					style={{width:'80%',marginLeft:'10%'}}
					title={
						<div>
							<span 
								className={isVisited ? 'home-menu-active home-menu-visited':'home-menu-visited'}
								onClick={this.handleChange(true)}
							>
							访问量
							</span>
							<span 
								className={isVisited ? '':'home-menu-active'}
								onClick={this.handleChange(false)}
							>
							销售量
							</span>
						</div>
					}  
					extra={
						<RangePicker
					      defaultValue={[moment('2020/01/09', dateFormat), moment('2020/06/06', dateFormat)]}
					      format={dateFormat}
				    	/>
				    } 
				>
					<Card title='访问趋势'  extra={<UndoOutlined  />}  style={{width:'65%',float:'left'}}>
			          <Bar />
			        </Card>
			        <Card title='任务'  extra={<UndoOutlined  />}  style={{width:'330px',float:'right'}}>
			          <Timeline>
					    <Timeline.Item color="green">新版本迭代会</Timeline.Item>
					    <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
					    <Timeline.Item color="red">
					      <p>联调接口</p>
					      <p>功能验收</p>
					    </Timeline.Item>
					    <Timeline.Item>
					    	<p>登录功能设计</p>
					      	<p>权限验证</p>
					      	<p>页面排版</p>
					    </Timeline.Item>
					  </Timeline>
			        </Card>
				</Card>
			</div>
		)
	}
}