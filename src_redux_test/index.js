// 入口js
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import App from './containers/App'
//通过import 获取到由redux创建的store对象
import store from './redux/store'
//通过redux的Provider组件 让 App 中的所有组件都可得到state数据 并会在更新state时候重新渲染 就不用subscribe()
ReactDOM.render((<Provider store={store}><App /></Provider>),document.getElementById('root'));
