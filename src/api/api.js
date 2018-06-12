(function (global, factory) {

    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        global.API = factory();
    }

})(typeof window !== 'undefined' ? window : this, function () {

    'use strict';

    var
        // access数据库请求文件名
        ACCESS_FILENAME = 'yufei.ashx',

        // sql数据库请求文件名
        SQL_FILENAME = 'yufei_Yf.ashx',

        API = function (options) {
            var defaults = {
                rootdir: '',
                database: 'access',
                fixPath: ['img_url', 'big_img', 'video_src', 'original_path'], 
                decode: ['zhaiyao', 'content'] //需要解密的字段
            };
            this.options = extend(defaults, options || {});
            this.rootdir = this.options.rootdir.replace(/\/$/, '');
            this.database = this.options.database.toLowerCase();
        };

    API.prototype = {
        constructor: API,
        ajax: ajax,

        getUrl: function (fnName) {
            var action = getAction(fnName),
                filename = this.database === 'sql' ? SQL_FILENAME : ACCESS_FILENAME;
            return [this.rootdir, '/tools/', filename, action].join('');
        },

        // 获取单条记录
        getRow: function (options) {
            return request(this, 'getRow', parseOptions(options));
        },

        // 获取多条记录
        getRows: function (options) {
            return request(this, 'getRows', parseOptions(options, 'categoryId'));
        },

        // 获取子菜单
        getSubmenu: function (options) {
            return request(this, 'getSubmenu', parseOptions(options, 'categoryId'));
        },

        // 获取全部省份和城市
        getProvinces: function (options) {
            return request(this, 'getProvinces', options);
        },

        // 获取整站SEO
        getSeo: function (options) {
            return request(this, 'getSeo', options);
        },

        // 获取相册
        getAlbum: function (options) {
            return request(this, 'getAlbum', parseOptions(options));
        },

        // 获取所有店铺列表
        getStores: function (options) {
            return request(this, 'getStores', options);
        },

        // 提交留言反馈
        postMsg: function (options) {
            return request(this, 'postMsg', options);
        },

        // 提交订阅邮箱
        postEmail: function (options) {
            return request(this, 'postEmail', options);
        },

        // 关键字搜索
        search: function (options) {
            return request(this, 'search', parseOptions(options, 'keyword'));
        }

    };

    function ajax(options) {

        // 默认配置
        var defaults = {
            url: '',
            method: 'GET',
            timeout: 0,
            data: {},
            dataType: 'json',
            async: true,
            user: null,
            password: null,
            sendBefore: null,
            success: null,
            error: null,
            completed: null,
            fixPath: '',
            basePath: '',
            decode: ''
        };

        // 用户配置
        options = extend(defaults, options || {});

        var method = options.method.toUpperCase(),
            url = options.url,
            async = options.async,
            user = options.user,
            password = options.password,
            timeout = +options.timeout,
            need = needQueryStr(method),
            queryStr = need ? toQueryStr(options.data) : null,
            fixPath = options.fixPath,
            basePath = options.basePath,
            decode = options.decode,
            xhr = new XMLHttpRequest();

        // 监听请求进度
        xhr.onreadystatechange = readyStateChangeFn;

        // 执行请求前的回调函数
        isFunction(options.sendBefore) && options.sendBefore();

        // 发起请求
        xhr.open(method, url, async, user, password);

        // 超时中断请求
        timeout && setTimeout(function () {
            xhr.abort();
        }, timeout);

        // 设置请求头
        need && xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=uft-8;');

        // 发送请求体
        xhr.send(queryStr);

        // 判断是否需要发送请求头(体)
        function needQueryStr(methodName) {
            return methodName === 'POST' || methodName === 'PUT';
        }

        // 请求成功回调函数
        function okCall(res) {
            isFunction(options.success) && options.success(res);
            isFunction(options.completed) && options.completed(res);
        }

        // 请求失败回调函数
        function errCall(res) {
            isFunction(options.error) && options.error(res);
            isFunction(options.completed) && options.completed(res);
        }

        // 请求进度事件
        function readyStateChangeFn() {
            if (xhr.readyState !== 4) {
                return;
            }
            var status = xhr.status,
                ok = status >= 200 && status < 300 || status === 304,
                response;
            if (!ok) {
                errCall(xhr);
                return;
            }
            if (options.dataType === 'json') {
                try {
                    response = JSON.parse(xhr.responseText);
                    fixPath && robot('fixPath', response, fixPath, basePath);
                    decode && robot('decode', response, decode);
                    okCall(response);
                } catch (err) {
                    errCall(xhr);
                }
            } else {
                okCall(xhr.responseText);
            }
        }
    }

    function request(api, fnName, options) {
        return new Promise(function (resolve, reject) {
            ajax(extend(megerOptions(api, fnName, options), {
                success: resolve,
                error: reject
            }));
        });
    }

    function toQueryStr(data) {
        var result = [],
            key, obj = data || {},
            encode = encodeURIComponent;
        for (key in obj) {
            obj.hasOwnProperty(key) && result.push(encode(key) + '=' + encode(obj[key]));
        }
        return result.join('&');
    }

    function getAction(methodName) {
        var action = {
            getRow: 'get_model_parms',
            getRows: 'get_list_parms',
            getSubmenu: 'get_category_list',
            getProvinces: 'get_province_city',
            getStores: 'get_address_channelid',
            getAlbum: 'get_album_list',
            getSeo: 'get_seo_list',
            postMsg: 'submit_feedback',
            postEmail: 'submit_Email',
            search: 'get_list_search'
        };
        return '?action=' + (action[methodName] || '');
    }

    function megerOptions(api, fnName, options) {
        return extend({
            method: 'POST',
            url: api.getUrl(fnName),
            data: options ? options.data || options : {},
            fixPath: api.options.fixPath,
            basePath: api.rootdir,
            decode: api.options.decode,
        }, options || {});
    }

    function parseOptions(options, field) {
        if (isObject(options)) {
            return options;
        }
        var obj = {};
        obj[field || 'id'] = options;
        return obj;
    }

    function robot(fn, response, field, basepath) {
        
        var data = isArray(response.data) ? response.data : [],
            base = basepath || '';
        data.forEach(function (obj) {
            if (!isObject(obj)) {
                return;
            }
            if (isString(field)) {
                setGetter(obj, field, base);
            } else if (isArray(field)) {
                field.forEach(function (item) {
                    setGetter(obj, item, base);
                });
            }
        });

        function setGetter(obj, key, basepath) {
            var val = obj[key];
            if (!val) {
                return;
            }
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                // writable: true,
                get: function () {
                    return fn === 'fixPath' ? basepath + val : unescape(val);
                }
            });
        }
    }

    function extend() {
        var args = [].slice.call(arguments),
            obj = {};
        args.forEach(function (arg) {
            if (!isObject(arg)) {
                return;
            }
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    obj[key] = arg[key];
                }
            }
        });
        return obj;
    }

    function type(obj) {
        return {}.toString.call(obj).replace(/\[object\s(\w+?)]/, '$1');
    }

    function isNumber(obj) {
        return 'Number' === type(obj);
    }

    function isString(obj) {
        return 'String' === type(obj);
    }

    function isArray(obj) {
        return 'Array' === type(obj);
    }

    function isObject(obj) {
        return 'Object' === type(obj);
    }

    function isFunction(obj) {
        return 'Function' === type(obj);
    }

    return API;

});