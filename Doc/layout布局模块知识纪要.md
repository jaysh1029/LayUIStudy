# 栅格系统/后台布局

## layui-container
将栅格放入 layui-container容器中，以便在设备中固定宽度

## layui-fluid 

栅格或其他元素放入 layui-fluid 宽度将不会固定， 而是100%适应

## xs sm md lg  每列相等，共12列

xs 超小屏(手机) <768px auto
sm 小屏(平板) >=768px 750px
md 中屏(桌面) >=992px 970px
lg 大屏(桌面) >=1200px 1170px

## 列间距 layui-col-space1  列间距 最大支持30px


## 间距大于30px的 使用偏移 layui-col-md-offset3 向右偏移3列

## 栅格可以无限嵌套

## 兼容IE8/9

```
<!-- 让IE8/9支持媒体查询，从而兼容栅格 -->
<!--[if lt IE 9]>
  <script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
  <script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
```

