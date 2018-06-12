const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const util = require('util')
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require("./webpack.base.conf");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const siteConfig = require('../config');
module.exports = merge(config, {
    module: {
        rules: [{
            include: rootDir('sass'),
            test: /(\.scss|\.css)$/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader',
                    "postcss-loader",
                    "sass-loader"
                ],
                fallback: 'style-loader',
                publicPath: '../'
            }),
            exclude: /node_modules/
        }, ],
    },

    devtool: siteConfig.build.devtool,
    plugins: [
        // 每次打包前，先清空原来目录中的内容
        new CleanWebpackPlugin(rootDir("../dist"), {
            verbose: false,
            root: rootDir('../')
        }),
        // 官方文档推荐使用下面的插件确保 NODE_ENV
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }),
        // 抽取公共CSS 文件
        new ExtractTextPlugin({
            filename: './css/layout.css',
            allChunks: true,
            ignoreOrder: true
        }),
        //压缩代码
        new ParallelUglifyPlugin({
            cacheDir: rootDir('cache'),
            uglifyJS: {
                output: {
                    comments: false
                },
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                }
            }
        }),

        //启用css代码压缩
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new CopyWebpackPlugin([{
            from: rootDir('assets'),
            to: rootDir('../dist/assets'),
            ignore: ['.*']
        }]),

        new CopyWebpackPlugin([{
            from: rootDir('lib'),
            to: rootDir('../dist/lib'),
            ignore: ['.*']
        }]),

        new CopyWebpackPlugin([{
            from: rootDir('default'),
            to: rootDir('../dist/default'),
            ignore: ['.*']
        }]),
    ]
});

//动态判断是否需要分析报告
if (siteConfig.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    module.exports.plugins.push(new BundleAnalyzerPlugin())
}

// 构建之前删除入口文件的HTML文件
delHtml();
//html构建
pagesBuild();

function delHtml() {
    Object.keys(module.exports.entry).forEach((v) => {
        fs.readFile(rootDir(`/entry/${v}.js`), 'UTF8', (err, data) => {
            let str = `import 'pages/${v}.html'`;
            let reg = new RegExp(str, 'ig');
            let newData = data.replace(reg, '');
            fs.writeFileSync(rootDir(`/entry/${v}.js`), newData);
        });
    });
}

function pagesBuild() {
    Object.keys(module.exports.entry).forEach((key) => {
        if (key === 'common') {
            return
        }
        const htmlPlugin = new HtmlWebpackPlugin({
            filename: `${key}.html`,
            chunks: ['vendor', key],
            template: rootDir(`/pages/${key}.html`),
            hash: false,
            /*     minify: {
                   removeComments: true,
                   collapseWhitespace: true,
                   removeAttributeQuotes: true
                 }*/
        });
        module.exports.plugins.push(htmlPlugin);
    })
}

function rootDir(src) {
    return path.join(__dirname, '../src', src);
}

/* 最终打包文件不需要缓存文件，设置10s后删除，
还不了解cache文件夹在哪个阶段生成，
暂时先用settimeout的方法清除，
如果打包文件时间超过这个时间可能出错,
直接手动删除cache文件好了 */
// let delCache = setTimeout(() => {
//     clearTimeout(delCache)
//     delCache = null

//     const files = fs.readdirSync(rootDir('cache'))
//     files.forEach(v => {
//         fs.unlinkSync(rootDir(`cache/${v}`))
//     })
//     fs.rmdirSync(rootDir('cache'))
// }, 10000);