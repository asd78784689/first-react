//进行local数据存储管理的工具模块
import store from 'store'
const USER_KEY = 'user_key'


// export default{
// 	//这是使用localStorage进行保存的
// 	//保存user
// 		saveUser(user) {
// 			//将user对象转化为json格式在进行保存
// 			localStorage.setItem(USER_KEY,JSON.stringify(user))
// 		}
// 	//读取user
// 		getUser(){
// 			// 从json转回对象再返回
// 			//！！如果获取不到数据 则说明是空 那么就用'{}'的字符串形式进行转化再返回
// 			//一定要加上''不然转化会出错！
// 			return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
// 		}
// 	//删除user
// 		removeUser(){
// 			localStorage.removeItem(USER_KEY)
// 		}
// }

export default{
	//使用store插件的做法

	saveUser(user){
		//localStorage只能保存string 传对象时会调用toString()并保存
		//所以通常是将对象转化为json串再进行保存

		//使用store的话 内部会自动转换为json再进行保存
		store.set(USER_KEY,user)
	},

	getUser(){
		//如果存在就返回 没有就返回空对象 就不用想localStorage中自己进行转化和判断
		return store.get(USER_KEY) || {}
	},

	removeUser(){
		store.remove(USER_KEY)
	},

}