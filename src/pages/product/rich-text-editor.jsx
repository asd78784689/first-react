import React,{Component} from 'react'
import PropTypes from 'prop-types'  //prop-types 第三方包(需要npm install )
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';  //富文本编辑器
import draftToHtml from 'draftjs-to-html';  //
//提供将react-draft-wysiwyg生成的HTML转换回draftJS ContentState的选项，可以用来初始化编辑器。
import htmlToDraft from 'html-to-draftjs';  
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


//用来指定商品详情的富文本编辑器组件
export default class RichTextEditor extends Component{
	static propTypes = {
		detail: PropTypes.string
	}
	
	constructor (props) {
		super(props)
		// 根据传入的 html 文本初始显示
		const detail = this.props.detail
		let editorState
		if(detail) { // 如果传入才需要做处理
			//将传入值进行转回富文本编辑器所需的数据 用于做初始化的值
			const blocksFromHtml = htmlToDraft(detail)
			const { contentBlocks, entityMap } = blocksFromHtml
			const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
			editorState = EditorState.createWithContent(contentState)
		} else {
			editorState = EditorState.createEmpty()   //创建一个没有内容的编辑对象
		}
		// 初始化状态
		this.state = {
			editorState
		}
	}
	//每次编辑器状态发生变化时都会调用该函数
	onEditorStateChange = (editorState) => {
		this.setState({
			editorState,
		})
	}
	//得到输入的富文本数据
	getDetail = () => {
		//draftToHtml 得到一个html数据
		//
		return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
	}
	//在编辑器中上传本地图片时的回调
	uploadImageCallBack = (file) =>{
		return new Promise(
			(resolve,reject) =>{
				const xhr = new XMLHttpRequest()
				xhr.open('POST','/manage/img/upload') //将本地图片上传到服务器中
				const data = new FormData()
				data.append('image',file)
				xhr.send(data)
				xhr.addEventListener('load',()=>{
					const response = JSON.parse(xhr.responseText)
					const url = response.data.url  //得到图片在服务器中的url
					resolve({data:{link:url}})
				})
				xhr.addEventListener('error',()=>{
					const error = JSON.parse(xhr.responseText)
					reject(error)
				})
			}
		)
	}
	render(){
		const { editorState } = this.state;
		//editorStyle 设置下方文本框的样式 editorState编辑器的状态
		//onEditorStateChange 编辑器状态发生改变时触发
		return(
			<Editor
				editorState={editorState}
				editorStyle={{height: 250, border: '1px solid #000', padding: '0 30px'}}
				onEditorStateChange={this.onEditorStateChange}
				toolbar={{
					image:{uploadCallback:this.uploadImageCallBack,alt:{present:true,mandatory:true}}
				}}
			/>
		)
	}
}