---
title: 近期项目开发总结
date: 2023/4/14
tag: JS, diary, 前端
description: 又是一个项目的开发，记点东西
author: ShiftWatchOut
---

# 随便记点

### 1. 图片缓存

这次获取图片数据在前端尝试了多种方式方式：

1. 放在公共目录，服务启动后，图片地址作为 `Image` 对象的 `src` 属性被请求。
2. 同样放在公共目录，使用 `fetch` 方法请求二进制数据，这样也是可行的
3. 通过打包工具，将图片转为 base64 ，硬编码到 JS 文件中

由于本次可能出现弱网或无网情况，而有个图片的加载失败会导致后续流程无法继续进行，前两种在需要图片时才通过网络加载的方式并不能利用浏览器的缓存机制，请求过一次后再次请求·还需远程服务器返回数据，因此可以把图片直接打包进 JS ，一次性请求了。打包转 base64 照理来说是很早就知道的事情，但没想到可以发挥预加载资源的用途。

### 2. 函数名保留

JS 的 `function` 是一个神奇的对象，能从外部改变内部的 `this` 指向，有 `length` 表明自己期望的参数数量，这跟数组表示自身所含元素还不一样，有 `name` 属性，表明自己叫什么，将函数赋给新的变量也不会改变它，我本来还觉得它可以在运行时获取到自己最新的名字。尽管经过了项目开发，我感觉 `Function.prototype.name` 这个属性还是不一定适合完全用在生产。现代前端应用开发常用打包工具，这次我用的 vite ，它在生产打包时默认将函数名压缩以减小生产打包体积。我设计了一个无网络情况下发起请求、伪造请求成功，并把请求方法和参数缓存到本地、等到网络恢复将存储中的数据重发的请求方式，具体实现和用法如下。为了保证日后代码可复用，我选择了使用函数名而非专属于这个项目的增删改来区分操作类型，开发环境是很直观就能在 `localStorage` 里看到函数名，等到生产环境，肯定就看不到了，好在 vite 科学怪人 rollup、esbuild 这些项目的时候，留了一点我们可配置的余地，现在的版本（vite 4）配置 esbuild 的 [keepNames](https://esbuild.github.io/api/#keep-names) 就可以了。

```js
// requestSaver.ts
interface SerializedRequest {
  methodName: string;
  params: any[];
  index: number;
}

const isNumber = (n: any): n is number => ![undefined, null].includes(n);

export default class RequestSaver {
  static requestMap = new Map<string, CallableFunction>();

  static init(...methods: CallableFunction[]) {
    this.requestMap.clear();
    methods.forEach((method) => this.requestMap.set(method.name, method));
    this.loadStorage();
  }

  static loadStorage() {
    const localSaved = Storage.getItem(this.storageKey);
    if (Array.isArray(localSaved)) {
      this.unResolvedRequest = localSaved.filter((saved) => this.requestMap.has(saved.methodName));
      Storage.removeItem(this.storageKey);
    }
  }

  static async sync() {
    if (this.requestMap.size === 0) {
      console.warn('未注册任何请求，无法进行同步');
    }
    // 请求前先排序，避免二次请求又失败，导致顺序错乱
    this.unResolvedRequest.sort((a, b) => a.index - b.index);
    // 同步时把所有请求放到别的地方，避免重复保存
    const copyRequests = [...this.unResolvedRequest];
    this.unResolvedRequest.length = 0;
    const total = copyRequests.length;
    for (const [idx, cReq] of copyRequests.entries()) {
      const reqMethod = this.requestMap.get(cReq.methodName);
      if (reqMethod) {
        const reqAction = new RequestSaver(reqMethod, cReq.params, cReq.index);
        // eslint-disable-next-line no-await-in-loop
        await reqAction.run();
        window.$message.info(`同步本地操作记录 ${idx + 1} / ${total} 条`);
      }
    }
  }

  static storageKey = 'RequestSaver';

  static save(methodName: string, params: any[], index?: number) {
    if (this.requestMap.has(methodName)) {
      this.unResolvedRequest.push({
        methodName,
        params,
        index: isNumber(index) ? index : this.unResolvedRequest.length,
      });
      Storage.setItem(this.storageKey, this.unResolvedRequest);
    } else {
      console.warn('未曾注册过这个函数');
    }
  }

  static unResolvedRequest: SerializedRequest[] = [];

  method: CallableFunction;

  params: any[];

  index?: number;

  constructor(method: CallableFunction, params: any[], index?: number) {
    this.method = method;
    this.params = params;
    this.index = index;
  }

  /**
   * @param cb  handleError 选择 resolve 时触发的回调，用于本地伪装
   */
  run(cb?: any) {
    if (typeof this.method === 'function') {
      const res = this.method(...this.params);
      return res.catch?.((e: any) => this.handleError(e).then(cb));
    }
    throw new Error(`Method is not callable`);
  }

  handleError = (err: Error) => {
    if (RequestSaver.isNetworkError(err)) {
      RequestSaver.save(this.method.name, this.params, this.index);
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  static isNetworkError(err: Error) {
    return ['timeout', 'network'].some((word) => err.message.toLowerCase().includes(word));
  }
}

// 使用
// 注册请求函数，用于下次打开应用时依然能找到对应的函数进行请求
RequestSaver.init(chemPointAdd, chemPointDelete, chemPointUpdate);
// 同步并进行其他操作
RequestSaver.sync().then(/** 其他操作 */)
// 实际进行一次请求
const reqAction = new RequestSaver(requestFunction, [all, params, inside, array]);
await reqAction.run(() => {
    // 用于请求失败后伪造请求成功的表现
});
```

### 写在最后

这个项目是安卓内嵌 H5，Android Studio 启动得很频繁，很难不想拿它来做更多有用的事情。最近看了 kotlin 的 Compose，由于它语言特性善于写 DSL，写出来的 UI 结构代码跟 JSX 差不多，又由于只能在函数中使用，内部状态和 sideEffect 的[思想](https://developer.android.google.cn/jetpack/compose/mental-model?hl=zh-cn)，跟 React 简直不要太像，又看到它有 KMM 路线规划，以后作为前端也可以写个 kotlin 应用，或许以后真的能实现大前端吧。

除了加载图片，这次一些其他基础也冒出来让我警醒一下，比如使用 `try...catch...finally` 的时候，因为想偷懒，不想处理错误，就把 `catch` 语句块忽略不写，想着反正我 `try` 了，总不能报错了吧，结果 JS 没捕获的错误就一路冒上来了，还是阻塞了后面脚本的运行。又比如像 `Map`、`Array` 这种可迭代的对象，有一些方法会返回 **迭代器对象** ，之前还做过[记录](./zsxq-generator)，然而由于平时经常在 `for-of` 里使用，并且可以在迭代器对象上调用 `forEach`、`map`、`reduce` 这种高阶数组方法，渐渐忘记这玩意不是真正数组，需要进行转换。应用开发过程就像写文章一样平铺直述，感觉自己写出来的代码放到其他通用编程语言里都能跑，以致于忽略了语言自己的特性。

不过这次不光是遗憾自己的遗忘，还是要感谢自己的提前封装，想象一下，临近下班时你的代码还没写完，这次的改动还缺一个数据获取获取，而恰好之前的你封装了一个方法来取这个数据，一调用立马就能激爽下班，真的是“拜托了，另一个我”。
