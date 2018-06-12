import 'jquery'
import Fastclick from 'fastclick'
import {
    rootDir
} from '../../config';

$(function () {
    $('.loading_wrap').hide()


    window.yfd = {
        api: new API({
            rootdir: rootDir
        }),
        //渲染数据到html上，用到了art-template模板引擎，用于一次性渲染
        render(tmpId, dom, data) {
            const html = template(tmpId, data)
            $(dom)[0].innerHTML = html
        },
        //渲染数据到html上，用到了art-template模板引擎，用于下拉加载更多
        append(tmpId, dom, data) {
            const html = template(tmpId, data)
            const parser = new DOMParser();
            let i = 0
            const doc = parser.parseFromString(html, "text/html");
            const node = doc.getElementsByTagName('li');
            Array.from(node).forEach(v => {
                $(dom)[0].append(v)

                console.log(i++);
            })
        },
        //getRows时使用
        getLists(res) {
            return res.data.map(v => {
                return v
            })
        },
        //使用getRow获取多条单个信息时使用
        getListArr(res) {
            return res.map(v => {
                return v.data[0]
            })
        },
        //getRow时使用
        getList(res){
            return res.data[0]
        }
    }

    //解决移动端点透问题
    FastClick.attach(document.body);

    //加载公共首尾部分

    $('.footerWrap').load('default/footer/index.html')

    const loadHeader = function () {
        return new Promise((resolve, reject) => {
            $('.headerWrap').load('default/header/index.html')
            resolve()
        })
    }
    loadHeader().then(() => {
        // $("#menu").mmenu({
        //     "offCanvas": {
        //         "position": "top",
        //         "zposition": "top"
        //     },
        //     "autoHeight": true
        // });
    })

    //异步加载seo
    yfd.api.getSeo().then(res => {
        const data = res.data[0]
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
})