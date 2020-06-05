const CracoLessPlugin = require('craco-less');
//用于less的编译  
//modifyVars为antd的定制主题配置设置
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          modifyVars: { '@primary-color': '#FFC0CB' },
          javascriptEnabled: true,
        },
      },
    },
  ],
};