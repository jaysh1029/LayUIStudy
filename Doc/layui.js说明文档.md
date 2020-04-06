>使用layui框架，首先加载layui.js
>
>>js解析完成之后，window对象多了一个属性，即layui对象
这个对象指向Layui类的实例
>
>只要调用use 就会加载jquery库
>
>define方法里面也会自动调用use

# layui.js 核心对象

## 公有对象/类：

### Layui   类：
    v：             版本号(属性)
    cache：         指向config(属性)
    define：        定义并加载模块
    use:            加载模块
    getSyle:        获取html节点style属性的某个属性值
    link：          加载外部css
    factory：       重新执行模块的工厂函数
    css：           css内部加载器，加载内部css(利用link)
    img：           图片预加载
    config：        全局配置，主要用来修改内部的config对象
    modules：       所有模块(复制内部modules对象)
    extend：        拓展模块
    router：        路由解析
    url：           url解析
    data：          本地存储
    sessionData:    本地会话存储
    device：        设备信息
    hint：          错误提示(控制台)
    each：          遍历
    sort：          数组排序(按照某个成员)
    stope:          阻止事件冒泡
    onevent：       自定义模块事件
    event:          执行自定义模块事件



### 私有对象：
    doc：   document对象
    win:    window对象
    config：对象(主要用来缓存)
        modules:    记录模块物理路径
        status:     记录模块加载状态
        timeout：   模块的加载超时时间(秒)
        event：     模块自定义事件
        callback:   存储模块的回调函数
        dir：       layui.js的绝对路径(所在目录)

    getPath:
        获取layui.js的绝对路径

    error:
        在控制台提示错误

    isOpera:
        是否是Opera浏览器

    modules：   内置模块 key/value格式存储 模块相对路径
        layer       弹层
        laydate     日期
        laypage     分页
        laytpl      模板引擎
        layim       web通讯
        layedit     编辑器
        form        表单
        upload      上传
        transfer    上传
        tree        树结构
        table       表格
        element     节点操作
        rate        评分
        colorpicker 颜色选择器
        slider      滑块
        carousel    轮播
        flow        流加载
        util        工具块
        code        代码样式
        jquery      jquery第三方库
        mobile      移动模块(若当前为开发目录，则为移动模块入口，否则为移动模块集合)
        layui.all   PC模块合并版



