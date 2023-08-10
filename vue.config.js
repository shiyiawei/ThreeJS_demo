const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  pages: {
    welcome: {
      entry: 'src/module/welcome-page.js',
      template: 'src/module/welcome-page.html',
            filename: 'welcome-page.html'
    },
    front: {
      // 入口文件，相当于单页面的 main.js
      entry: 'src/module/front-web.js',
      // 模板文件
      template: 'src/module/front-web.html',
      // 编译后 dist 目录下输出的文件，可以包含子目录
      filename: 'front-web.html'
    },
    model: {
      entry: 'src/module/show-tab.js',
      template: 'src/module/show-tab.html',
      filename: 'show-tab.html'
    }
  }
}
