const fs = require('fs');
const path = require("path");

/*************************
 ******* 入口文件名 ********
 *************************/
const fileName = [
    'index', 'about'
];
const mkdir = ['entry', 'sass', 'pages']; //创建入口目录、scss文件目录、页面文件目录
const entryData = "import \'jquery\'\nimport 'sass/layout.scss'\nimport './common.js'"; // 入口文件写入初始内容
const scssDate = "@import '../default/footer/index.scss';\n@import '../default/header/index.scss';\n@import '../default/styles/reset.scss';"; //scss文件写入初始内容
const htmlData = fs.readFileSync(rootDir(`../template.html`)); //返回模板HTML内容
const commonJsData = `import 'jquery'
import Fastclick from 'fastclick'

$(function () {
    //结局移动端点透问题
    FastClick.attach(document.body);

    //加载公共首尾部分
    $('#headerWrap').load('default/header/index.html')
    $('#footerWrap').load('default/footer/index.html')

    //异步加载seo
    const api = $.get('http://test2.yfd.com.cn/demo/tools/yufei.ashx?action=get_seo_list')
    api.done().then(res => {
        const data = JSON.parse(res).data[0]
        console.log(data);
        setSeo(data.seo_title, data.keywords, unescape(data.description))
    })

    const setSeo = function (title, keywords, description) {
        let h = document.head,
            c = h.querySelector('meta[charset]'),
            t = h.getElementsByTagName('title')[0],
            k = h.querySelector('meta[name="keywords"]'),
            d = h.querySelector('meta[name="description"]'),
            a = h.querySelector('meta[name="author"]');
        if (!c) {
            c = document.createElement('meta');
            c.setAttribute('charset', 'utf-8');
            h.insertBefore(c, h.firstChild);
        }
        t = t ? t : document.createElement('title'), t.innerHTML = title;
        k = k ? k : document.createElement('meta'), k.name = 'keywords', k.content = keywords;
        d = d ? d : document.createElement('meta'), d.name = 'description', d.content = description;
        a = a ? a : document.createElement('meta'), a.name = 'author', a.content = '技术支持：雨飞设计www.yfd.com.cn';
        h.insertBefore(a, h.childNodes[2]);
        h.insertBefore(d, a);
        h.insertBefore(k, d);
        h.appendChild(t);
    }
})` 

//创建目录
mkdir.forEach((v) => {
    fs.mkdirSync(`src/${v}`);
});

//js,scss中写入内容
fs.writeFileSync(rootDir('sass/layout.scss'), scssDate); //创建scss文件并写入初始内容
fs.writeFileSync(rootDir('entry/common.js'),commonJsData)
fileName.forEach((v) => {
    fs.writeFileSync(rootDir(`entry/${v}.js`), entryData); //创建入口文件并写入初始内容
    
    fs.writeFileSync(rootDir(`sass/${v}.scss`),''); //创建scss文件并写入初始内容
    fs.appendFileSync(rootDir(`sass/layout.scss`), `\n@import '${v}.scss';`); //创建主scss文件并写入其它页面scss文件
    fs.writeFile(rootDir(`pages/${v}.html`), htmlData, (err) => {
        if (err) {
            throw err;
        } else {
            console.log(`${v}.html、${v}.js、${v}.scss构建完成,下一步开启devSever服务器`);
        }
    }); //根据入口文件数量批量创建HTML
});

function rootDir(src) {
    return path.join(__dirname, '../src', src);
}