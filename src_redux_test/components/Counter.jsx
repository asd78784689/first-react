// 应用的根组件
import React,{Component} from 'react'
import PropTypes from 'prop-types'   
//UI组件 主要做显示与用户交互 代码中没有任何redux相关的代码
export default class Counter extends Component {
	//count 要传递为一个number 
	static propTypes = {
		count : PropTypes.number.isRequired,
		increment:PropTypes.func.isRequired,
		decrement:PropTypes.func.isRequired,
		incrementAsync:PropTypes.func.isRequired,
	}

	constructor(props){
		super(props)
		this.numberRef = React.createRef()
	}	
	//加
	increment = ()=>{
		const number = this.numberRef.current.value * 1
		this.props.increment(number)
	}
	//减
	decrement = ()=>{
		const number = this.numberRef.current.value * 1
		this.props.decrement(number)
	}
	//如果是奇数才执行
	incrementIfOdd = ()=>{
		const number = this.numberRef.current.value * 1
		if(this.props.count %2 === 1){
			this.props.increment(number)
		}
	}
	//异步
	incrementAsync = ()=>{
		const number = this.numberRef.current.value * 1
		this.props.incrementAsync(number)
	}

	render(){
		const count = this.props.count
		return(
			<div>
				<p>click {count} times</p>
				<div>
					<select ref={this.numberRef}>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
					</select> &nbsp;&nbsp;
					<button onClick={this.increment}>+</button> &nbsp;&nbsp;
					<button onClick={this.decrement}>-</button> &nbsp;&nbsp;
					<button onClick={this.incrementIfOdd}>increment if odd</button> &nbsp;&nbsp;
					<button onClick={this.incrementAsync}>increment async</button> &nbsp;&nbsp;

				</div>
			</div>
		)
	}
}