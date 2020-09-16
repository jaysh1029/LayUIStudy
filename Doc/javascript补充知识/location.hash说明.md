# location.hash

hash是指url 从#开始的部分

## #的含义
锚点：
#代表网页中的一个位置 右面的字符就是改位置的标识符

## HTTP请求不包括#
#是用来指导浏览器动作的，对服务器端完全无用

## #后的字符
这些字符都会解读为位置标识符，不会被发送到服务端，如果需要发送，则需要做url编码

## 改变#不触发网页重载
改变#后的部分，浏览器不会重新加载网页

## 改变#会改变浏览器的访问历史
改变#后的部分，会增加浏览器的访问记录，可以使用前进和后退按钮 

这对于ajax程序特别有用，可以用不同的#值，表示不同的访问状态，可以用来做url路由

IE6和IE7 不支持这种特性
## 使用location.hash 可以读取或写入#值
读取时：可以用来判断网页状态是否改变

写入时：会在不重载网页的前提下，创造一条访问历史记录

## onhaschange事件

此为HTML5新增，当#值发生变化时，就会触发这个事件。

浏览器支持情况：
IE8+、Firefox 3.6+、Chrome 5+、Safari 4.0+支持该事件

有三种形式
1. window.onhaschange = func;
2. <body onhaschange="func()">
3. window.addEventListener("haschange",func,false); 

tips: **对于不支持onhaschange的浏览器，可以用setInterval监控location.hash的变化**

## Google抓取#的机制
默认情况，google会忽视URL的#部分

google还规定，如果你希望Ajax生成的内容被抓取，可以在URL中使用#!

比如 http://www.xxx.com/#!/username

google 会自动抓取下面这个链接

 http://www.xxx.com/?_escaped_fragment_=/username

