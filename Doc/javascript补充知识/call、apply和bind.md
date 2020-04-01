# 关于this
1. 默认情况this指向全局对象 window
2. 使用对象调用函数时，一般this就是这个对象

> 参考链接：[call、apply和bind](https://www.jianshu.com/p/bc541afad6ee)





# call 和 apply 功能一样
功能：改变函数体内部this的指向

## 原型：
```
function.call(thisArg, arg1, arg2, ...)

func.apply(thisArg, [argsArray])

// 这里的thisArg 就是指定的this 在func内部的this 由这个thisArg代替
//如果 thisArg为null 则使用全局对象
//返回调用函数func的返回值
```
> 区别：
>> call接受参数是参数列表(可变参数)
>>
>> apply接受的参数是数组

## 示例

```
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {

  Product.call(this, name, price);
  // 如果使用apply 可以使用下面的代码
  //Product.apply(this, [name, price]);
  this.category = 'food';
}

console.log(new Food('cheese', 5).name);
// expected output: "cheese"

```

> 参考链接：
> 
> 1. [apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply "apply")  
> 
> 2. [call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call "call方法说明")


# bind
> 创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用
> bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数 原函数this不改变

## 示例

```
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}

const unboundGetX = module.getX;
// 这个方法在全局范围调用,里面的this指向window
console.log(unboundGetX()); 
//输出结果：undefined

//使用bind函数后 方法就与module绑定好了
const boundGetX = unboundGetX.bind(module);

console.log(boundGetX());
// 输出结果： 42

```

```
var obj = {
    name: 'Dot'
}

function printName() {
    console.log(this.name)
}

var dot = printName.bind(obj)
console.log(dot) // function () { … }
dot()  // Dot

```
> 参考链接：
> [bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

# 三者区别
> bind 是返回对应函数，便于稍后调用；
> 
> apply 、call 则是立即调用