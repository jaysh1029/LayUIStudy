# html、js、css加载说明
 * css加载不影响html渲染
 * 执行script标签时，会停止后面html的渲染以及其他资源的下载，待js加载完成后才继续渲染html
 * 旧版本的浏览器js文件的下载也会阻止html渲染和其它资源的下载(包括其它js、css、img等外部资源)，从IE8、firefox3.5、safari4和chrome2开始允许js文件并行下载，同时不阻塞其它资源下载
 
 #  js defer和async加载
* 添加defer属性后，js的加载和html的渲染会异步进行，此时js文件会在所有元素解析完成之后执行，并在DOMContentLoaded事件触发之前完成
* 添加async属性后，js的加载和html的渲染会异步进行，但js文件会在加载完成后立即执行，即使前面的脚本还没有执行
* 异步加载的js禁用`document.write`方法

![js加载过程](https://img-blog.csdn.net/20170312211310717?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZ3BteQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

绿色：html加载
蓝色：js记载
红色：js执行

## 脚本执行顺序
**正常情况下**(注意还有不正常情况)，从上到下执行，即使是并行下载的js文件也是这样

## html脚本引入方式
1. 正常引入(通过script标签，含代码和外部脚本)
2. 利用`document.write`写入script标签
3. 动态脚本技术：利用DOM创建script
4. Ajax获取的脚本，再创建script元素添加到DOM中
5. 直接把js代码写入元素事件处理程序中或直接作为URL的主体
> 注：以上不考虑requirejs或seajs等模块加载器

> 以下是详细情况：
> 

> ### 1.正常引入脚本(从上到下执行)
>> 正常使用script引入的代码，不管是否并行下载js文件，都会按照从上到下的顺序执行
> ### 2.利用`document.write`写入脚本
> 文档流关闭前，会将内容写入脚本所在位置结束之后的紧邻位置，浏览器执行完当前代码，会接着解析`document.write`写入的内容
> > 注意：`document.write`若在head标签中的script里面写入html元素，如div等，则这段内容会输出到body的起始位置，而不是当前位置
> #### 以下分情况讨论
> 
> 为了更好的描述，特加入以下名词解释说明：
> 
>>1.一类代码：不使用`document.write`写入的代码
>>>```
>>> //示例：
>>>
>>>alert('我是一类代码');
>>>```
>>
>> 2.二类代码：使用`document.write`写入的内部脚本
>>>```
>>> //示例：
>>>document.write('<script>alert("我是二类代码")<\/script>')
>>>```
>> 
>> 3.三类代码：使用document.write写入的外部脚本
>>>```
>>> //示例：
>>>document.write('<script src="http://www.xxx.com/1.js"><\/script>')
>>>```
>> #### 最高优先级：不管什么情况都是按照script引入顺序执行
>> #### a.同一个script标签写入外部脚本(三类代码)>>> 
>>> 优先级： 三类代码 < 一类代码 (然后三类按照顺序执行)
>>> ``` 
>>> <script src='http://www.xxx.com/1.js?delay=2' ></script> //1
>>><script>
>>>     document.write('<script src="http://www.xxx.com/2.js"><\/script>');//2
>>>     document.write('<script src="http://www.xxx.com/1.js"><\/script>');//3
>>>     alert("我是内部脚本");//4
>>></script> 
>>>// 执行顺序为 1 4 2 3
>>>```
> > #### b.同一个script标签只写入内部脚本(二类代码)
>>> 优先级：二类代码 = 一类代码 (从上到下按顺序执行)
>>>
>>>```
>>><script src='http://www.xxx.com/1.js'></script> //1
>>><script>
>>>     document.write('<script>alert("我是docment.write写入的内部脚本")<\/script>');//2
>>>     alert("我是内部脚本");//3
>>>     document.write('<script>alert("我是docment.write写入的内部脚本2222")<\/script>');//4
>>>     document.write('<script>alert("我是docment.write写入的内部脚本3333")<\/script>');//5
>>> </script>
>>>// 执行顺序为 1 2 3 4 5
>>>```
>>>
> > #### c.同一个script标签 同时写入内部脚本和外部脚本
>>> IE9及以下浏览器：
>>>> 优先级： 一类代码 = 二类代码 > 三类代码
>>>
>>> 其他浏览器：
>>>>
>>> 第一个三类代码之前的优先级：一类代码 = 二类代码
>>> 第一个三类代码及之后的优先级：一类代码 > 二类代码 = 三类代码
>>>
>>>```
>>><script src='http://www.xxx.com/1.js'></script> //1
>>><script type="text/javascript">
>>>     document.write('<script>alert("我是docment.write写入的内部脚本")<\/script>');//2
>>>     alert("我是内部脚本");//3
>>>     document.write('<script src="http://www.xxx.com/1.js"><\/script>');//4
>>>     document.write('<script>alert("我是docment.>>>write写入的内部脚本2222")<\/script>');//5
>>>     document.write('<script src="http://www.xxx.com/1.js"><\/script>');//6
>>>     document.write('<script>alert("我是docment.>>>write写入的内部脚本3333")<\/script>');//7
>>>     alert("我是内部脚本2222");//8
>>></script>
>>>//IE9及以下浏览器执行顺序：1 2 3 5 7 8 4 6
>>>//其他浏览器执行顺序：1 2 3 8 4 5 6 7
>>>```
> ### 3.动态DOM添加
> * 动态DOM添加的代码不会立即执行
> * 目的在于创建无阻塞脚本
> * 不保证按照添加的顺序执行，可以通过回调函数来使用其中的功能
>>```
>>function loadScript(url,callback){
>>    var script = document.createElement("script");
>>    script.type = "text/javascript";
>>    //绑定加载完毕的事件
>>    if(script.readyState){
>>        script.onreadystatechange = function(){
>>            if(script.readyState === "loaded" || script.readyState === "complete"){
>>                callback&&callback();
>>            }
>>        }
>>    }else{
>>        script.onload = function(){
>>            callback&&callback();
>>        }
>>    }
>>    script.src = url;
>>    document.getElementsByTagName("head")[0].appendChild(script)>>;
>>}
>>
>>```
> ### 4.通过Ajax注入脚本
> * Ajax注入脚本目的同DOM动态添加相同：无阻塞脚本加载
> * 通过XMLHttpRequest，异步获取
> * 如果是异步加载 无法确定脚本执行顺序
> * 如果是同步加载，脚本按照加载顺序执行






