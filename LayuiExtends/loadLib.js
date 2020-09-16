
/** 
 * @Author: 史林枫 
 * @Date: 2020-09-16 13:12:14 
 * @Desc: 加载第三方类库 注意：如果多次调用loadLib 使用同一个扩展，可能会出错 最好是在一个loadLib中的callback中实现所有相关方法
 * @Param deps 依赖的类库 如jquery 这个deps主要是layui封装的内部模块
 * @Param extendModules 第三方类库的扩展配置，主要是指定类库所在目录 
 *      如 1. {'cookies':'lib/extend/jquery.cookies'}//相对layui.js的路径
 *         2. {'cookies':'{/}static/lib/extend/jquery.cookies'} //绝对路径
 * @Param bind 需要绑定到window对象上的属性集合 如{'$','$','jQuery':'jquery'} 
 *          若deps中第一个是jquery 则这个就是bind的默认值 这里会将layui对应的属性绑定到window的属性上
 *          若window对象已经有这个属性值 则不绑定 
 * @Param callback 所有类库加载完成后执行的函数 这时候所有的依赖都已经加载完成
 * @Remark 这只能解决单层依赖，如果是依次多层依赖，那就干脆在layui之前引用第三方js即可 没有必要折磨自己
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
            if(layui[key]||layui.modules[key]){
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
            if(!window[key]){
                window[key] = layui[bind[key]];
            }            
        }
        loadThridLib();
    });
    
}