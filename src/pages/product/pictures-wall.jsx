import React, { Component } from 'react';
import { Upload,Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import {reqDeleteImg} from '../../api/index'
import {BASE_IMG_URL,UPLOAD_IMG_NAME} from '../../utils/constants'
// 后台管理的路由组件

//将文件进行base64编码
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class PicturesWall extends Component{
	state = {
	    previewVisible: false,
	    previewImage: '',
	    previewTitle: '',
	    fileList: [
	      
	    ],
	};


	constructor(props){
		super(props)
		// console.log(props.imgs)
		// console.log(this.props.imgs)
		//定义一个方法 循环创建 imgs传过来的img数据
		//设置为state中的fileList
		// fileList: [
		    //   {
		    //     uid: '-1',   //负数最好
		    //     name: 'image.png',
		    //     status: 'done',
		    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
		    //   },
		    // ]
		
	}
	componentDidMount(){
		const imgsData = this.props.imgs
		if(imgsData && imgsData.length>0){
			this.setFileList(imgsData)
		}
	}
	//设置FileList
	setFileList = (data)=>{
		let fileList = []
		data.forEach((item,index)=>{
			let obj = {
				uid:`-${index+1}`,
				name:`${item}`,
				status:'done',
				url:`${BASE_IMG_URL}${item}`
			}
			fileList.push(obj)
		})
		// console.log(fileList)
		this.setState({fileList})
	}
	
	//对话框中点击遮罩层或右上角叉或取消按钮的回调 将previewVisible设为false让对话框不可见
	handleCancel = () => this.setState({ previewVisible: false });
	//上传图片时点击文件链接或预览图标时的回调	
	handlePreview = async file => {
		//如果图片url和preview存在那么获取其base64后的图片
		if (!file.url && !file.preview) {
		  file.preview = await getBase64(file.originFileObj);
		}
		//将previewImage设为图片url/preview 
		//让对话框可见 
		//让previewTitle设为文件的name或者通过获取url最后的'/'后的字符提取出来
		this.setState({
		  previewImage: file.url || file.preview,
		  previewVisible: true,
		  previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
		});
	};
	//上传文件改变时的状态
	handleChange = async ({file,fileList }) => {
		// console.log('handleChange()',file.status,fileList.length,file) 
		
		//上传成功将file中的信息进行修正(name,url)
		if(file.status === 'done'){
			// console.log('done')
			const result = file.response
			if(result.status === 0){
				message.success('上传图片成功！')
				const {name,url} = result.data
				//改动文件列表中的对应文件再去进行保存
				file = fileList[fileList.length-1]
				file.name = name;
				file.url = url;   
				// console.log(file)
			}else{
				message.error('上传图片失败!')
			}
		}else if(file.status === 'removed'){
			//触发删除事件 对服务器进行删除图片的操作
			const name = file.name
			const result = await reqDeleteImg(name)
			if(result.status === 0){
				//删除成功
				message.success('删除图片成功！')
			}else{
				//删除成功
				message.error('删除图片失败！')
			}
		}

		this.setState({ fileList })
	};

	//获取所有已上传图片文件名的数组
	getImg = ()=>{ 
		return this.state.fileList.map(file =>file.name)
	}

	render(){
		const { previewVisible, previewImage, fileList, previewTitle } = this.state;
	    const uploadButton = (
	      <div>
	        <PlusOutlined />
	        <div className="ant-upload-text">Upload</div>
	      </div>
	    );
	    //完成上传图片功能 完成整个添加/更新组件 以及其他几个组件 
	    //accept 限制只接收图片格式
		return(
			<div className="clearfix">
		        <Upload
		          accept="image/*"
		          action="/manage/img/upload"  //上传接口url
		          name={UPLOAD_IMG_NAME} //请求参数名
		          listType="picture-card"
		          fileList={fileList}
		          onPreview={this.handlePreview}
		          onChange={this.handleChange}
		        >
		          {fileList.length >= 3 ? null : uploadButton}
		        </Upload>
		        <Modal
		          visible={previewVisible}
		          title={previewTitle}
		          footer={null}
		          onCancel={this.handleCancel}
		        >
		          <img alt="example" style={{ width: '100%' }} src={previewImage} />
		        </Modal>
	      	</div>
		)
	}
}