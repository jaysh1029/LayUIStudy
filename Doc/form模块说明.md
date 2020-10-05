#  layfilter属性

 主要用在 `from.on` 方法监听带有`layfilter`属性元素的事件

 如 `switch`  `submit` 

# form 获取/设置表单所有元素的值

`form.val`  参数是`form`元素的`layfilter`属性值

 # 手动渲染

 `form`表单 如果有动态更新元素 需要手动渲染 `render`

 日期组件 初始化需要`render`渲染

 # 编辑器  layedit

 需要使用build初始化  如 `layedit.build("lay_demo_editor")`


 # 表单验证 form.verify

 `form.verify` 对应 每个表单元素的 `lay-verify`属性 
 
 比如内置的 `required` `email` `phone` `date` `url`  `identity` `pass`也可以是用|分隔的组合 如`required|phone`

 支持自定义属性  然后在参数中配置规则

