/*!

 @Name: layui
 @Description：经典模块化前端 UI 框架
 @Homepage: www.layui.com
 @Author: 贤心
 @License：MIT

 */

;
! function (win) {
    "use strict";

    var doc = document,
        config = {
            modules: {} //记录模块物理路径
            ,
            status: {} //记录模块加载状态
            ,
            timeout: 10 //符合规范的模块请求最长等待秒数
                ,
            event: {} //记录模块自定义事件
        }

        ,
        Layui = function () {
            this.v = '2.5.6'; //版本号
        }

        //获取layui所在目录(绝对路径)
        //比如layui.js路径为http://localhost:8101/lib/layui/layui.js
        // 则getPath 返回路径为 http://localhost:8101/lib/layui/
        ,
        getPath = function () {

            //document.currentScript 这个IE不支持 返回当前正在运行的script元素 
            // 不能作为回调函数或事件处理函数调用，只在脚本被解析后首次运行有效
            //document.scripts  这个几乎所有的浏览器都支持 返回所有script元素集合
            var jsPath = doc.currentScript ? doc.currentScript.src : function () {
                var js = doc.scripts,
                    last = js.length - 1,
                    src;
                for (var i = last; i > 0; i--) {
                    if (js[i].readyState === 'interactive') {
                        src = js[i].src;
                        break;
                    }
                }
                return src || js[last].src;
            }();
            return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
        }()

        //异常提示
        ,
        error = function (msg) {
            win.console && console.error && console.error('Layui hint: ' + msg);
        }

        ,
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]'

        //内置模块
        ,
        modules = {
            layer: 'modules/layer' //弹层
                ,
            laydate: 'modules/laydate' //日期
                ,
            laypage: 'modules/laypage' //分页
                ,
            laytpl: 'modules/laytpl' //模板引擎
                ,
            layim: 'modules/layim' //web通讯
                ,
            layedit: 'modules/layedit' //富文本编辑器
                ,
            form: 'modules/form' //表单集
                ,
            upload: 'modules/upload' //上传
                ,
            transfer: 'modules/transfer' //上传
                ,
            tree: 'modules/tree' //树结构
                ,
            table: 'modules/table' //表格
                ,
            element: 'modules/element' //常用元素操作
                ,
            rate: 'modules/rate' //评分组件
                ,
            colorpicker: 'modules/colorpicker' //颜色选择器
                ,
            slider: 'modules/slider' //滑块
                ,
            carousel: 'modules/carousel' //轮播
                ,
            flow: 'modules/flow' //流加载
                ,
            util: 'modules/util' //工具块
                ,
            code: 'modules/code' //代码修饰器
                ,
            jquery: 'modules/jquery' //DOM库（第三方）

                ,
            mobile: 'modules/mobile' //移动大模块 | 若当前为开发目录，则为移动模块入口，否则为移动模块集合
                ,
            'layui.all': '../layui.all' //PC模块合并版
        };

    //记录基础数据
    Layui.prototype.cache = config;

    /**      
     * @Author: 史林枫 
     * @Date: 2020-04-01 17:59:54 
     * @Param deps 依赖的模块
     * @Param factory 定义的模块代码
     * @Desc: 定义模块
     *  1. deps 是依赖的模块
     *  2. factory 是回调函数
     * 加载过程：
     * 1.判断deps是否是function 如果是就是不依赖任何模块，deps就是factory,即回调函数
     * 2.不管是依赖的模块，还是新定义的模块，最后都要调用内部的callback，将输出的对象绑定到layui对象上，并设置config缓存和状态标识
     * 3.factory函数就是定义模块的代码
     * 4.factory接受一个函数，这个函数一般名称为exports 这个主要是用来暴露当前模块接口，并将接口绑定到layui对象上
     */
    Layui.prototype.define = function (deps, factory) {
        var that = this,
            type = typeof deps === 'function',

            //这里的回调函数可以是use加载依赖模块时的回调，也是define定义新输出函数的回调
            //目的是将模块绑定到layui对象，并设置config相关缓存
            //其中会调用到factory这个函数，
            callback = function () {

                /** 
                 * @Author: 史林枫 
                 * @Date: 2020-09-16 08:42:33 
                 * @Desc: 将暴露的接口对象 绑定到layui对象，并设置config缓存说明这个模块已加载 
                 */
                var setApp = function (app, exports) {
                    layui[app] = exports;
                    config.status[app] = true;
                };

                //绑定对象到layui 设置状态缓存
                //执行factory函数就是定义模块的代码 代码内容执行完之后 
                //调用function 并传入2个参数 通过setApp 将模块绑定到layui对象上并设置状态缓存           
                typeof factory === 'function' && factory(function (app, exports) {

                    setApp(app, exports);

                    //不知道为何设置这个函数 目前没有发现那个地方用到这个callback
                    //这里可能是在执行依赖模块后 将当前app的回调函数保存起来，最后再统一执行
                    //但目前没有发现调用config.callback的代码
                    //这里只是保存了当前模块的回调函数 估计在外部可能会用 目测可能是模块有变化 需要动态更新缓存用的，相当于重新加载模块
                    config.callback[app] = function () {
                        factory(setApp);
                    }
                });
                return this;
            };

        type && (
            factory = deps,
            deps = []
        );

        //如果使用模块化加载，并且mobile模块已经加载 则调用回调函数       
        //这个情况有待观察 可能是移动端需要执行的
        if ((!layui['layui.all'] && layui['layui.mobile'])) {
            return callback.call(that);
        }

        //加载依赖模块，并执行回调函数
        that.use(deps, callback);
        return that;
    };

    /** 
     * @Author: 史林枫 
     * @Date: 2020-04-06 09:01:57 
     * @Param: apps 模块名称可以是数组或字符串，但不能包含目录，如果是目录用extend来建立别名
     * @Param: callback 模块加载完毕后的回调函数，返回一个exports参数，用于输出该模块接口
     * @Param: exports 输出模块集合，作为回调函数的参数(这里可能是为了加入更多外部对象，因为内部的对象都绑在了layui对象上了)
     * @Desc:  按照apps参数指定的模块 去递归加载相应的js模块
     * @Desc: 所有模块加载完成后执行callback回调，开始使用这些模块
     * @Desc: 只有加载的js是用layui.define定义的模块 才是符合规范的模块
     */

    Layui.prototype.use = function (apps, callback, exports) {
        var that = this,
            type = typeof apps === 'function', //这段代码是我新增的
            //dir是layui.js的所在目录
            dir = config.dir = config.dir ? config.dir : getPath,
            head = doc.getElementsByTagName('head')[0];

        //这段代码是我新增的 这样如果用户只想用layui对象的基本功能执行回调函数，也可以了
        type && (
            callback = apps,
            apps = []
        );
        //确保apps参数是一个数组
        apps = typeof apps === 'string' ? [apps] : apps;

        //如果页面已经存在 jQuery 1.7+ 库且所定义的模块依赖 jQuery，则不加载内部 jquery 模块
        if (window.jQuery && jQuery.fn.on) {
            //如果依赖模块apps中包含jquery，则删除这个模块 
            that.each(apps, function (index, item) {
                if (item === 'jquery') {
                    apps.splice(index, 1);
                }
            });
            layui.jquery = layui.$ = jQuery;
        }

        /** 
         * @Author: 史林枫 
         * @Date: 2020-09-16 10:22:45 
         * @Desc: 模块中的第一个模块名称，每次加载完之后就从apps中删除一个 
         */
        var item = apps[0],
            timeout = 0;
        exports = exports || [];

        /** 
         * @Author: 史林枫 
         * @Date: 2020-09-16 10:23:27 
         * @Desc: 静态资源host 如 //www.xxx.com/ 
         */
        config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0];

        /** 
         * @Author: 史林枫 
         * @Date: 2020-09-16 11:03:08 
         * @Desc: 加载完毕的回调函数
            这个加载完成后，还要等待define函数执行，设置config.status[item]之后才算结束
            然后执行内部回调函数 onCallback 继续递归加载或结束 
         */
        function onScriptLoad(e, url) {
            var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
            if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
                config.modules[item] = url;
                head.removeChild(node);
                (function poll() {

                    if (++timeout > config.timeout * 1000 / 4) {
                        return error(item + ' is not a valid module');
                    };
                    config.status[item] ? onCallback() : setTimeout(poll, 4);
                }());
            }
        }

        /** 
         * @Author: 史林枫 
         * @Date: 2020-09-16 11:02:14 
         * @Desc: 回调函数，如果是多个模块则递归加载，否则就意味着所有模块都加载完了，开始执行callback函数
         * @Desc: 这个回调函数中的this 被指代为layui对象，调用的时候是用call和apply执行的
         * @Desc: 如果回调中有参数的话，这个参数就是加载后的对象集合 可以直接使用 
         */
        function onCallback() {
            exports.push(layui[item]);
            apps.length > 1 ?
                that.use(apps.slice(1), callback, exports) :
                (typeof callback === 'function' && callback.apply(layui, exports));
        }

        //如果引入了完整库（layui.all.js），内置的模块则不必再加载
        // 只需执行回调函数即可
        if (apps.length === 0 ||
            (layui['layui.all'] && modules[item]) ||
            (!layui['layui.all'] && layui['layui.mobile'] && modules[item])
        ) {
            return onCallback(), that;
        }

        //获取加载的模块 URL
        //如果是内置模块，则按照 dir 参数拼接模块路径 dir 为layui.js所在路径
        //如果是扩展模块，则判断模块路径值是否为 {/} 开头，
        //如果路径值是 {/} 开头，则模块路径就是modules[item].js 后续会把{/}删除，得到独立的路径
        //否则，则按照 config.base 参数拼接模块路径 这里的base是在网页中配置的值 一般是layui.js所在的目录
        var url = (modules[item] ? (dir + 'lay/') :
            (/^\{\/\}/.test(that.modules[item]) ? '' : (config.base || ''))
        ) + (that.modules[item] || item) + '.js';

        url = url.replace(/^\{\/\}/, ''); //去掉开头的 {/}

        //如果扩展模块（即：非内置模块）对象已经存在，则不必再加载
        if (!config.modules[item] && layui[item]) {
            config.modules[item] = url; //并记录起该扩展模块的 url
        }

        /*
            首次加载模块
            创建script 监听js加载事件，执行回调函数
            若非首次加载，就是config.modules[item]已经加载但还没有加载完成时，系统会等待其加载完成 
            然后看config.status[item]是否为true，true则完全加载完成，之后执行内部的回调函数onCallback
        */
        if (!config.modules[item]) {
            var node = doc.createElement('script');

            node.async = true;
            node.charset = 'utf-8';
            node.src = url + function () {
                var version = config.version === true ?
                    (config.v || (new Date()).getTime()) :
                    (config.version || '');
                return version ? ('?v=' + version) : '';
            }();

            head.appendChild(node);
            // attachEvent 是IE专属监听事件的方法    
            if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
                node.attachEvent('onreadystatechange', function (e) {
                    onScriptLoad(e, url);
                });
            } else {
                //非IE监听事件 绑定 IE不支持load事件
                node.addEventListener('load', function (e) {
                    onScriptLoad(e, url);
                }, false);
            }

            config.modules[item] = url;
        } else { //缓存
            (function poll() {
                if (++timeout > config.timeout * 1000 / 4) {
                    return error(item + ' is not a valid module');
                };
                (typeof config.modules[item] === 'string' && config.status[item]) ?
                onCallback(): setTimeout(poll, 4);
            }());
        }
        return that;
    };

    //获取节点的style属性值
    Layui.prototype.getStyle = function (node, name) {
        var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
        return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
    };

    //css外部加载器
    Layui.prototype.link = function (href, fn, cssname) {
        var that = this,
            link = doc.createElement('link'),
            head = doc.getElementsByTagName('head')[0];

        if (typeof fn === 'string') cssname = fn;

        var app = (cssname || href).replace(/\.|\//g, ''),
            id = link.id = 'layuicss-' + app,
            timeout = 0;

        link.rel = 'stylesheet';
        link.href = href + (config.debug ? '?v=' + new Date().getTime() : '');
        link.media = 'all';

        if (!doc.getElementById(id)) {
            head.appendChild(link);
        }

        if (typeof fn !== 'function') return that;

        //轮询css是否加载完毕
        /** 
         * @Author: 史林枫 
         * @Date: 2020-09-16 16:12:10 
         * @Desc: 下面的 1989 width属性是在要加载的css文件中设置的 id要跟这里调用的一致
         */
        (function poll() {
            console.log("link");
            if (++timeout > config.timeout * 1000 / 100) {
                return error(href + ' timeout');
            };
            parseInt(that.getStyle(doc.getElementById(id), 'width')) === 1989 ? function () {
                fn();
            }() : setTimeout(poll, 100);
        }());

        return that;
    };

    //存储模块的回调
    config.callback = {};

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-02 09:06:48 
     * @Desc: 重新执行模块的工厂函数，相当于重新加载模块
     * @Desc: 若layui中包含模块，并且config.callback含有此模块的函数，则返回这个函数 
     * @Desc: 这个函数好像没怎么用过，因为用use和define加载模块的时候已经执行过了
     */
    Layui.prototype.factory = function (modName) {
        if (layui[modName]) {
            return typeof config.callback[modName] === 'function' ?
                config.callback[modName] :
                null;
        }
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-02 09:09:23 
     * @Desc: css内部加载器 
     * @Desc:  加载layui自带的css 里面调用layui.link方法
     */
    Layui.prototype.addcss = function (firename, fn, cssname) {
        return layui.link(config.dir + 'css/' + firename, fn, cssname);
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-02 09:11:41 
     * @Desc: 图片预加载 
     * @Desc: 创建Image对象，设置url 加载完成后执行callback，出错执行error 
     */
    Layui.prototype.img = function (url, callback, error) {
        var img = new Image();
        img.src = url;
        if (img.complete) {
            return callback(img);
        }
        img.onload = function () {
            img.onload = null;
            typeof callback === 'function' && callback(img);
        };
        img.onerror = function (e) {
            img.onerror = null;
            typeof error === 'function' && error(e);
        };
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-02 09:12:37 
     * @Desc: 全局配置 用外部options 覆盖内部config的相关键值 
     * @Desc: 修改内部config对象
     */
    Layui.prototype.config = function (options) {
        options = options || {};
        for (var key in options) {
            config[key] = options[key];
        }
        return this;
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-02 09:16:07 
     * @Desc: 复制内部的modules对象 
     * @Desc: 这里面都是内部模块 形如：layer: 'modules/layer'
     */
    Layui.prototype.modules = function () {
        var clone = {};
        for (var o in modules) {
            clone[o] = modules[o];
        }
        return clone;
    }();

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-05 08:41:06 
     * @Desc: 拓展模块 将options中的模块放到内部modules对象里面(只记录一个名称和路径) 
     */
    Layui.prototype.extend = function (options) {
        var that = this;

        //验证模块是否被占用
        options = options || {};
        for (var o in options) {
            if (that[o] || that.modules[o]) {
                error('\u6A21\u5757\u540D ' + o + ' \u5DF2\u88AB\u5360\u7528');
            } else {
                that.modules[o] = options[o];
            }
        }

        return that;
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-05 11:40:47 
     * @Desc: location.hash 路由解析 返回一个路由的数据对象 传入的hash值必须以#开头
     * @Desc:  比如 hash = #/home/homepage1?name=tom 最后被转化为：
     * @Desc: data: {path:["home", "homepage1?name=tom"],search:{},hash:"",href:"/home/homepage1?name=tom"}
     * @Desc: 如果这里hash 是 /#/home/homepage1?name=tom (比前面多一个/)
     * @Desc: 此时 data.hash = #/home/homepage1?name=tom
     */
    Layui.prototype.router = function (hash) {
        // 以链接为例： http://www.xxx.com/start/#/home/homepage1

        var that = this,
            hash = hash || location.hash,
            data = {
                path: [],
                search: {},
                hash: (hash.match(/[^#](#.*$)/) || [])[1] || ''
            };
        //data.hash中存放全部hash值
        //如果 hash中不含有#/ 就直接返回，不再处理
        if (!/^#\//.test(hash)) return data; //禁止非路由规范
        hash = hash.replace(/^#\//, ''); //若 hash以#/开头，则替换为空
        data.href = '/' + hash; // 在hash开头加上/

        /*
         将hash中除第一个，以#开头的内容全部替换掉
         比如 hash=#/home/homepage1#top
         替换后为#/home/homepage1
         但这里没什么用，可能会考虑到hash中有多个#的问题，系统只保留第一个后面的
         比如 hash只原本为 #/test/test/test/#/test/  到这里已经被处理为
         /test/test/test/#/test/   到下面一句处理之后就会变成 /test/test/test/
        */
        hash = hash.replace(/([^#])(#.*$)/, '$1').split('/') || [];


        //提取 Hash 结构 
        // 这里把hash中的参数放置到data.search中，非url参数 放入path中，作为路由
        //这里是为了匹配这种情况 #/action=actionName  就会把action:actionName 放到search中
        that.each(hash, function (index, item) {
            /^\w+=/.test(item) ? function () {
                item = item.split('=');
                data.search[item[0]] = item[1];
            }() : data.path.push(item);
        });

        return data;
    };

    /** 

     * @Author: 史林枫 
     * @Date: 2020-04-05 20:39:42 
     * @Desc: URL 解析 将一个url 分解成 路径数组，参数数组，hash结构 
     * @Desc: 如 URL：https://www.baidu.com/s/admin#/home/page/login?wd=test&ws=abc
     * @Desc: 会被解析为 {
     * "pathname":["s","admin#","home","page","login"],
     * "search":{"wd":"test","ws":"abc"},
     * "hash":{"path":["home","page","login?wd=test&ws=abc"],"search":{},"hash":"","href":"/home/page/login?wd=test&ws=abc"}}
     */
    Layui.prototype.url = function (href) {
        var that = this,
            data = {
                //提取 url 路径 以/开始的部分
                pathname: function () {
                        var pathname = href ?

                            function () {
                                var pathUrl = (href.match(/\.[^.]+?\/.+/) || [])[0] || '';
                                console.log(pathUrl);
                                return pathUrl.replace(/^[^\/]+/, '').replace(/\?.+/, '');
                            }() :
                            location.pathname;
                        console.log(pathname);
                        return pathname.replace(/^\//, '').split('/');
                    }()

                    //提取 url 参数 以?开始的部分
                    ,
                search: function () {
                        var obj = {},
                            search = (href ?
                                ((href.match(/\?.+/) || [])[0] || '') :
                                location.search
                            ).replace(/^\?+/, '').split('&'); //去除 ?，按 & 分割参数

                        //遍历分割后的参数
                        that.each(search, function (index, item) {
                            var _index = item.indexOf('='),
                                key = function () { //提取 key
                                    if (_index < 0) {
                                        return item.substr(0, item.length);
                                    } else if (_index === 0) {
                                        return false;
                                    } else {
                                        return item.substr(0, _index);
                                    }
                                }();
                            //提取 value
                            if (key) {
                                obj[key] = _index > 0 ? item.substr(_index + 1) : null;
                            }
                        });

                        return obj;
                    }()

                    //提取 Hash
                    ,
                hash: that.router(function () {
                    return href ?
                        ((href.match(/#.+/) || [])[0] || '') :
                        location.hash;
                }())
            };

        return data;
    };

    //本地持久性存储
    Layui.prototype.data = function (table, settings, storage) {
        table = table || 'layui';
        storage = storage || localStorage;

        if (!win.JSON || !win.JSON.parse) return;

        //如果settings为null，则删除表
        if (settings === null) {
            return delete storage[table];
        }

        settings = typeof settings === 'object' ?
            settings : {
                key: settings
            };

        try {
            var data = JSON.parse(storage[table]);
        } catch (e) {
            var data = {};
        }

        if ('value' in settings) data[settings.key] = settings.value;
        if (settings.remove) delete data[settings.key];
        storage[table] = JSON.stringify(data);

        return settings.key ? data[settings.key] : data;
    };

    //本地会话性存储
    Layui.prototype.sessionData = function (table, settings) {
        return this.data(table, settings, sessionStorage);
    }

    //设备信息
    Layui.prototype.device = function (key) {
        var agent = navigator.userAgent.toLowerCase()
            //mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/78.0.3904.108 safari/537.36
            //获取版本号
            ,
            getVersion = function (label) {
                var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
                label = (agent.match(exp) || [])[1];
                return label || false;
            }

            //返回结果集
            ,
            result = {
                os: function () { //底层操作系统
                    if (/windows/.test(agent)) {
                        return 'windows';
                    } else if (/linux/.test(agent)) {
                        return 'linux';
                    } else if (/iphone|ipod|ipad|ios/.test(agent)) {
                        return 'ios';
                    } else if (/mac/.test(agent)) {
                        return 'mac';
                    }
                }(),
                ie: function () { //ie版本
                    return (!!win.ActiveXObject || "ActiveXObject" in win) ? (
                        (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
                    ) : false;
                }(),
                weixin: getVersion('micromessenger') //是否微信
            };

        //任意的key
        if (key && !result[key]) {
            result[key] = getVersion(key);
        }

        //移动设备
        result.android = /android/.test(agent);
        result.ios = result.os === 'ios';
        result.mobile = (result.android || result.ios) ? true : false;

        return result;
    };

    //提示
    Layui.prototype.hint = function () {
        return {
            error: error
        }
    };

    //遍历
    Layui.prototype.each = function (obj, fn) {
        var key, that = this;
        if (typeof fn !== 'function') return that;
        obj = obj || [];
        if (obj.constructor === Object) {
            for (key in obj) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        } else {
            for (key = 0; key < obj.length; key++) {
                if (fn.call(obj[key], key, obj[key])) break;
            }
        }
        return that;
    };

    //将数组中的对象按其某个成员排序
    Layui.prototype.sort = function (obj, key, desc) {
        var clone = JSON.parse(
            JSON.stringify(obj || [])
        );

        if (!key) return clone;

        //如果是数字，按大小排序，如果是非数字，按字典序排序
        clone.sort(function (o1, o2) {
            var isNum = /^-?\d+$/,
                v1 = o1[key],
                v2 = o2[key];

            if (isNum.test(v1)) v1 = parseFloat(v1);
            if (isNum.test(v2)) v2 = parseFloat(v2);

            if (v1 && !v2) {
                return 1;
            } else if (!v1 && v2) {
                return -1;
            }

            if (v1 > v2) {
                return 1;
            } else if (v1 < v2) {
                return -1;
            } else {
                return 0;
            }
        });

        desc && clone.reverse(); //倒序
        return clone;
    };

    //阻止事件冒泡
    Layui.prototype.stope = function (thisEvent) {
        thisEvent = thisEvent || win.event;
        try {
            thisEvent.stopPropagation()
        } catch (e) {
            thisEvent.cancelBubble = true;
        }
    };

    /** 
     * @Author: 史林枫 
     * @Date: 2020-09-16 17:18:21 
     * @Desc: 自定义模块事件 这里只是监听 不执行
     */
    Layui.prototype.onevent = function (modName, events, callback) {
        if (typeof modName !== 'string' ||
            typeof callback !== 'function') return this;

        return Layui.event(modName, events, null, callback);
    };

    //
    /** 
     * @Author: 史林枫 
     * @Date: 2020-09-16 17:17:42 
     * @Param modName  如 admin 这是自己定义的模块名称
     * @Param events 如 tabsPage(setMenustatus) tabsPage({*}) 调用的是模块内定义的事件
     * @Param params 参数
     * @param fn 回调函数 fn有值 则是监听事件，若fn没有值，则是执行事件
     * @Desc:  执行自定义模块事件
     */
    Layui.prototype.event = Layui.event = function (modName, events, params, fn) {
        var that = this,
            result = null,
            filter = events.match(/\((.*)\)$/) || [] //提取事件过滤器字符结构，如：select(xxx) 提取的是(xxx)
            ,
            eventName = (modName + '.' + events).replace(filter[0], '') //获取事件名称，如：form.select admin.on
            ,
            filterName = filter[1] || '' //获取过滤器名称,，如：xxx
            ,
            callback = function (_, item) {
                var res = item && item.call(that, params);
                res === false && result === null && (result = false);
            };

        //添加事件
        //fn 有值 就只是添加一个事件到config.event对象中 不执行 这里仅仅是监听
        if (fn) {
            config.event[eventName] = config.event[eventName] || {};

            //这里不再对多次事件监听做支持，避免更多麻烦
            //config.event[eventName][filterName] ? config.event[eventName][filterName].push(fn) : 
            config.event[eventName][filterName] = [fn];
            return this;
        }
        
        //fn 没有传值 就是代表要执行事件
        //执行事件回调
        layui.each(config.event[eventName], function (key, item) {
            //执行当前模块的全部事件
            if (filterName === '{*}') {
                layui.each(item, callback);
                return;
            }

            //执行指定事件 这里其实只是执行了一个事件，因为框架不再支持多次事件监听
            //即 一个filterName 只绑定一个事件
            key === '' && layui.each(item, callback);
            (filterName && key === filterName) && layui.each(item, callback);
        });

        return result;
    };

    win.layui = new Layui();

}(window);

/** 
 * @Author: 史林枫 
 * @Date: 2020-09-16 13:25:04 
 * @Desc: 自由加载第三方模块  注意：如果多次调用loadLib 使用同一个扩展，可能会出错 最好是在一个loadLib中的callback中实现所有相关方法
 * @Other 我对贤心说：感谢你开源了layui框架，但不能因为这 就要把所有的第三方组件都绑定到layui.define名下 这给使用者造成了极大困扰
 *  这是变相浪费了用户的时间 因此我开了一个口子，让第三方组件自由加载
 */
layui.loadLib = function (deps, extendModules, bind, callback) {
    deps = deps || [];
    deps = typeof deps === 'string' ? [deps] : deps;

    var type = typeof bind === 'function';
    type ? (
        callback = bind,
        bind = {},
        deps[0] == 'jquery' && (bind = {
            "$": "$",
            "jQuery": "$"
        })
    ) : (bind = bind || {});


    function loadThridLib() {
        var lib = [];
        var index = 0;
        for (var key in extendModules) {
            lib[index++] = key;
            if (layui[key] || layui.modules[key]) {
                delete extendModules[key];
            }
            layui.cache.status[key] = true;
        }
        layui.extend(extendModules).use(lib, callback);
    }

    if (deps.length == 0) {
        loadThridLib();
        return;
    }

    layui.use(deps, function () {
        for (var key in bind) {
            if (!window[key]) {
                window[key] = layui[bind[key]];
            }
        }
        loadThridLib();
    });

}