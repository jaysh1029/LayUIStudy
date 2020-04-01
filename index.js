layui.config({
    version: '2.5.6',
    debug: true
}).use(['layer'], function() {
    var layer = layui.layer;

    layer.msg("Hello world!");
});