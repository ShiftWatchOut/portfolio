---
title: 我不知道的 Promise
date: 2021/11/28
description: 由一道面试题引发的对 Promise 的探索
tag: JS
author: ShiftWatchOut
---

# 我不知道的 Promise

### 起因

之前面试的时候遇到一道面试题，大体是这样：

> 改造如下代码，使其按顺序输出 `1执行完成 2执行完成 3执行完成 4执行完成 5执行完成 hello I'm the last` ：

```
(() => {
    const arr = [0, 1, 2, 3, 4]

    const runArr = (value) => new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, Math.ceil(Math.random() * 10) * 100);
    }).then((res) => {
        console.log(`${res}执行完成`)
    })

    console.log("hello I'm the last")
})()
```

其实很简单，函数前写上 `async` ，用上 `for...of` ，在里面 `await runArr` 运行每个元素就可以实现了。但好死不死，我在面试当天看到一个使用数组的 `reduce` 方法顺序执行 `Promise` 的方法，想要让面试官眼前一亮，于是就按照 [MDN 里的方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#%E6%8C%89%E9%A1%BA%E5%BA%8F%E8%BF%90%E8%A1%8Cpromise) 写出了下面的代码：

```
(async () => {
    const arr = [0, 1, 2, 3, 4]

    const runArr = (value) => new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, Math.ceil(Math.random() * 10) * 100);
    }).then((res) => {
        console.log(`${res}执行完成`)
    })
    await arr.map(runArr).reduce((acc, curr) => acc.then(curr), Promise.resolve(123))

    console.log("hello I'm the last")

})()
```

当时好像是唬住面试官了，把我自己也给唬住了，觉得这指定能按照要求来输出。可当我回家试验之后，才发现上面这种写法有所不对：老是将最后一句输出在最前列，而且并没有按照顺序输出 1、2、3、4、5 执行完成。我才意识到出大问题。

### 问题在哪

```
/**
 * Runs promises from array of functions that can return promises
 * in chained manner
 *
 * @param {array} arr - promise arr
 * @return {Object} promise object
 */
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}

// promise function 1
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

// promise function 2
function p2(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
}

// function 3  - will be wrapped in a resolved promise by .then()
function f3(a) {
 return a * 3;
}

// promise function 4
function p4(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 4);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10)
  .then(console.log);   // 1200
```
难道是文档给的例子（如上）有误？可是将语言切换到英文也是同样的例子， MDN 是中外开发者都在使用的网站，不会存在内容有问题却没人指出。那我们就来看一下我写的部分和实际代码有什么差别。

reducer 函数部分十分简单，给 thenable 的 accumulator 的 then 方法中传入后一个函数。虽然我自己照着 MDN 示例写的这个 reducer 一模一样，但是，后来发现我忽略了一个地方：例子上 accumulator 为什么是 thenable 的？

在例子中有一个函数 `f3` 并没有返回一个 Promise ，但是 `promiseChain` 却不会断掉，一直是 thenable 的。最初看到例子，没有过多思考，以为是一个已然定义好的 Promise 数组便可以直接借用官网的例子。但是忽略了 Promise 里面的内容，是在它一开始定义时就执行的，然鹅例子中的数组，是一个函数数组，直到前一步 `promiseChain` 执行完毕，才会运行到 `then` 里面的下一个函数，直到这时，新的 Promise 才会被定义。由于函数是被传入 `then` 方法的，其结果必定也是 thenable 的。

```
const runArr = (value) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(value)
    }, value * 100); // 实际上从定义的那一刻开始计时，0、1、2、3、4打印之间的间隔为 100 ms
}).then((res) => {
    console.log(`${res}执行完成`)
})
```

为了验证 Promise 是在其定义之时就开始运行的，我将 `runArr` 方法里的实际改成有规律的值，如果按照我之前的想法，每一行打印出现的时间间隔应该是递增的，但实际打印出现的时间间隔，却是完全一致的。找到了问题所在，就应该针对这个问题提出解决方案，也即上一个 Promise 执行完成，才定义新的 Promise。因此，只需要将 reduce 的那一行修改一下。

```
await arr.reduce((acc, curr) => acc.then(() => runArr(curr)), Promise.resolve(123))
```

数组遍历加上异步啊，这中间的弯弯绕绕真是打脑壳，自己看例子的时候也没太上心。下一步是该研究一下 async/await ，宏任务、微任务， event loop 了。