layui.config({
    version: '2.5.6',
    debug: true
}).use(['layer'], function() {
    var layer = layui.layer;
    layer.msg("Hello world!");
});

var url = "https://www.baidu.com/s/admin#/home/page/login?wd=test&ws=abc";
console.log(JSON.stringify(layui.url(url)));
console.log(navigator.userAgent.toLowerCase());
