---
title: 用生成器函数写一个对象上的遍历器
date: 2021/8/17
description: 从知识星球搬过来留存一下
tag: 前端, JS
author: ShiftWatchOut
---

# 用生成器函数写一个对象上的遍历器

借着头天有朋友分享了遍历器对象，我来发散一下。

先复习一下，遍历器是对象实例上的一个叫 `[Symbol.iterator]` 的方法，这个方法返回一个带有 next 方法的对象，next 方法返回的是 `{ value: any /* 当前遍历到的值 */, done: boolean /* 是否遍历完成 */ }`，使用 `for...of` 循环时，会自动调用这个方法。

其中这个返回 `{value，done}` 的 `next` 方法，很容易让我们想到 es6 的一个新东西，叫生成器函数（Generator Function）。它的语法是下面这样，在 `function` 关键字和函数名直接加个`*`，内部可以把 `yield` 关键字放到表达式前面：

```
function* helloGen() {
	yield 'hello'; // yield 即产出
	yield "world";
	return 'end';
}
```

![图①](/images/zsxq_generator_1.png)

使用方法如图 ①，可以看到生成器函数返回了一个对象，手动调用它的 next 方法按顺序返回了 `{ value，done }` 结构的对象，恰好与我们刚刚复习的结构相吻合，我们可以把生成器函数放到 `for...of` 循环的 `of` 后面，放在拓展运算符后面。结果如图 ②（注意：`done` 为 true 的部分是不会被遍历到的）。

![图②](/images/zsxq_generator_2.png)
生成器函数结合 `[Symbol.iterator]`，我们可以很方便地给对象定义一个自己想要的遍历器，例如图 ③，我把属性 1，2，3，4 的值倒过来放入了数组。

![图③](/images/zsxq_generator_3.png)
