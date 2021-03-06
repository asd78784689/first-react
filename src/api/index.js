// 包含多个接口请求函数的模块 返回值均为promise
import ajax from './ajax'
import jsonp from 'jsonp'

const BASE = '/api'

//这些都是根据接口文档定义的接口请求
// 分别暴露接口函数 
//登录 
export const reqLogin = (username,password) => ajax( BASE + '/login',{username,password},"POST")
//相当于
	// export function reqLogin(username,password){ajax('/login',{username,password},"POST")}

//添加用户
export const reqAddUser = (user) => ajax( BASE + '/manage/user/add',user,"POST")

// 通过jsonp请求获取天气信息
export function reqWeather(city){
	const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
	return new Promise((resolve,reject)=>{
		jsonp(url,{param:'callback'},(error,response)=>{
			if(!error && response.status === 'success'){
				const {dayPictureUrl,weather} = response.results[0].weather_data[0]
				resolve({dayPictureUrl,weather})
			}else{
				//百度的免费天气接口有一天调用次数限制
				alert('获取天气信息失败')
			}
		})
	})
}

//获取一级或某个二级分类列表
export const reqCategorys = (parentId) => ajax( BASE + '/manage/category/list',{parentId})

//添加分类 二级菜单的parentId便是一级的_id值
export const reqAddCategory = (parentId,categoryName) => ajax( BASE + '/manage/category/add',{parentId,categoryName},"POST")

//更新品类名称
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax( BASE + '/manage/category/update',{
	categoryId,categoryName
},"POST")

// 根据分类ID 获取分类
export const reqCategory = (categoryId) => ajax( BASE + '/manage/category/info',{categoryId})

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax( BASE + '/manage/product/list',{pageNum,pageSize})

//根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({pageNum,pageSize,searchType,searchName}) => ajax( BASE + '/manage/product/search',{pageNum,pageSize,[searchType]:searchName})

//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax( BASE + '/manage/product/'+(product._id ? 'update' : 'add'),product,"POST")

//对商品进行上架/下架处理
export const reqUpdateProductStatus = (productId,status) => ajax( BASE + '/manage/product/updateStatus',{productId,status},'POST')

//删除图片
export const reqDeleteImg = (name) => ajax( BASE + '/manage/img/delete',{name},"POST")

// 添加角色
export const reqAddRole = (roleName) => ajax( BASE + '/manage/role/add', {roleName}, 'POST')
// 获取角色列表
export const reqRoles = () => ajax( BASE + '/manage/role/list')
// 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax( BASE + '/manage/role/update', role, 'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax( BASE + '/manage/user/'+(user._id ? 'update' :'add'), user, 'POST')
// 获取用户列表
export const reqUsers = () => ajax( BASE + '/manage/user/list')
// 删除用户
export const reqDeleteUser = (userId) => ajax( BASE + '/manage/user/delete', {userId}, 'POST')