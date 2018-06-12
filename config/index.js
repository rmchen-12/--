module.exports = {
    rootDir: 'http://test2.yfd.com.cn/demo/',

    //开发环境配置
    dev: {
        // 服务器配置,官方文档（https://webpack.js.org/configuration/dev-server/）
        // 主机名(调响应式需要改为本机IP地址才能在手机端访问)
        // 查看本机IP地址(window系统)：
        // 1. 快捷键：win + r打开运行窗口
        // 2. 输入cmd回车打开命令行窗口
        // 3. 在命令行窗口输入：ipconfig回车查看IPV4地址即可
        host: 'localhost',
        // host: '192.168.1.103',
        port: 8081,
        autoOpenBrowser: true, //自动打开浏览器

        //Source Maps配置
        //官方文档（https://webpack.js.org/configuration/devtool/#development）
        //中文解释参考（https://segmentfault.com/a/1190000004280859）
        devtool: 'cheap-module-eval-source-map',
    },

    //生产环境配置
    build: {
        //Source Maps配置
        //官方文档（https://webpack.js.org/configuration/devtool/#development）
        //中文解释参考（https://segmentfault.com/a/1190000004280859）
        devtool: 'source-map',

        // 打包代码分析配置
        bundleAnalyzerReport: false
    }
}