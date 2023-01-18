const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    // 设置开发服务器端口号
    port:8000
  },

  // webpack相关
  configureWebpack:{
    // 解析
    resolve:{
      // 路径别名
      alias:{

      }
    }
  }
})
