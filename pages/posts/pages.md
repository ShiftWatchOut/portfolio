---
title: 译 - Next.js Pages
date: 2021/3/18
description: 学习有关 Next.js pages.
tag: 前端, React
author: ShiftWatchOut
---

# Next.js Pages

在 Next.js 中，一个 **page** 是 [React Component](https://reactjs.org/docs/components-和-props.html) 来自 `pages` 文件夹下的 `.js`, `.jsx`, `.ts`, 或 `.tsx` 文件。每一个 page 都基于它的文件名进行路由

**例**：如果你像下面这样新建一个 `pages/about.js` 并导出 React component，你就可以通过 `/about` 访问到它.

```
function About() {
  return <div>About</div>
}

export default About
```

### 动态路由的 Pages

Next.js 支持动态路由。例如，你创建一个 `pages/posts/[id].js` 文件，就可以通过 `posts/1`、`posts/2`等进行访问。

> 更多关于动态路由，详见 [Dynamic Routing documentation](/docs/routing/dynamic-routes.md).

## 预渲染

一般来说，Next.js **预渲染** 所有页面。这意味着 Next.js 预先给每一页生成 HTML，而非把任务交给客户端 JS 。预渲染能提供更好的 SEO。

每个生成的页面带有当前页所需最少的 JS 代码。当一个页面被浏览器加载后，它内部的最少代码会使这个页面依然完全可用。(这个过程叫做 _hydration_。)

### 两种形式的预渲染

Next.js 有两种形式的预渲染：**纯静态生成** 和 **服务端渲染**. The difference is in **when** it generates the HTML for a page.

- [**纯静态生成 (建议使用)**](#纯静态生成-建议使用)：HTML 是在 **构建时** 生成，在被请求时可以复用
- [**服务端渲染**](#服务端渲染)：HTML 是在 **每次请求** 时渲染。

重要的是，Next.js 允许你为每一页 **选择** 你喜欢的那种预渲染。大多数页面通过纯静态生成，部分通过服务端渲染，你可以打造一个 "混合" Next.js 应用

出于性能考虑我们 **更推荐** 使用 **纯静态生成** 而非服务端渲染。静态生成的文件可以通过 CDN 缓存，无须任何额外配置即可获得良好性能。但在某些情况下，服务端渲染可能是唯一选择。

你也可以把 **客户端渲染** 使用到纯静态生成或服务端渲染中。就算是页面中的一部分内容可以由浏览器的 JS 负责渲染。

> 参考[Data Fetching](/docs/basic-features/data-fetching.md#fetching-data-on-the-client-side) 文档.

## 纯静态生成 (建议使用)

如果一个页面用到 **纯静态生成** 技术, 页面 HTML 会在 **构建时** 生成。在生产环境下, 页面 HTML 是在你运行 `next build` 时就已经生成. 这些 HTML 会在将来每个请求中被复用，可以被 CDN 缓存起来。

在 Next.js 中, 你可以静态生成 **有或没有数据** 的页面。让我们来都看一遍。

### 无数据纯静态生成

Next.js 通过纯静态生成预渲染的页面默认不会自行发起数据请求。例：

```
function About() {
  return <div>About</div>
}

export default About
```

注意，这个页面进行预渲染时完全不需要请求任何外部数据。这时，Next.js 在构建过程中为每个 page 生成一个 HTML 单文件。

### 有数据纯静态生成

有些页面在预渲染时需要拉取数据。现在有两种方案, 可以随意使用。当然每种方案都需要用到 Next.js 提供的专用函数

1. 页面 **内容** 依赖外部数据：使用 `getStaticProps`.
2. 页面 **路径**依赖外部数据：使用 `getStaticPaths` (通常作为 `getStaticProps` 的补充).

#### 方案 1：页面内容依赖外部数据

**例**：你的博客页面可能需要从一个 CMS (content management system)拉取文章列表

```
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be pre-rendered.
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

export default Blog
```

为了在组件预渲染时拉取数据, Next.js 允许你在同一文件 `export` 一个名为 `getStaticProps` 的 `async` 函数。这个函数会在编译时被调用，在预渲染时把拉取的数据传递给页面的 `props`。

```
function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts
    }
  }
}

export default Blog
```

> 更多关于 `getStaticProps` 原理，请看 [Data Fetching documentation](/docs/basic-features/data-fetching.md#getstaticprops-static-generation).

#### Scenario 2：页面路径依赖外部数据

Next.js 允许你创建带有 **动态路由** 的页面。例如，你可以新建一个 `pages/posts/[id].js` 文件来基于 `id` 变化的博文内容。当你想访问 `posts/1` 时，你获取到的，就是一篇 `id: 1` 的文章。

> 更多关于动态路由的内容，查看[Dynamic Routing documentation](/docs/routing/dynamic-routes.md).

还有一点，你想在构建时预渲染的 `id` 可能依赖外部数据。

**例**：假设你数据库里现在只有一篇博文 (即 `id: 1`)。这时，你就只想在构建时预渲染 `posts/1` 。

后来，你也许会加上第二篇博文 `id: 2`。那么你就会想把 `posts/2` 也纳入预渲染的范畴

也就是说预渲染的页面 **路径** 依赖外部数据。Next.js 的解决方案是让你从动态 page 文件(例如 `pages/posts/[id].js`)里`export` 一个名叫 `getStaticPaths` 的 `async` 函数。这个函数会在构建时调用，它允许你指定想要预渲染的路径。

```
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id }
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

当然在 `pages/posts/[id].js` 里, 你仍需要导出 `getStaticProps` 这样你才能获取到与这个 `id` 相绑定的数据，并将其预渲染到页面上：

```
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to 页面 via props
  return { props: { post } }
}

export default Post
```

> 更多关于 `getStaticPaths` 原理，请看 [Data Fetching documentation](/docs/basic-features/data-fetching.md#getstaticpaths-static-generation).

### 何时使用纯静态生成?

我们推荐尽可能地使用 **纯静态生成** (无论有无拉取数据的需要)，这样页面可以一次性构建完成，通过 CDN 分发，这样就比每次请求时都由服务器渲染一次要快得多。

你可以纯静态生成各种页面，包括：

- 市场营销
- 博客
- 电商产品展示
- 帮助文档

需要考虑清楚："能否在用户请求 **之前** 就预渲染这个页面？"结果肯定的话，就应当使用纯静态生成.

换言之，纯静态生成就 **不** 适用于你无法在用户请求之前就预渲染页面的场景. 或许页面展示的是需要频繁更新的数据，或者页面内容在每次请求后都要变化.

这种情境下，可以采用以下的方案：

- 半静态生成半 **客户端渲染** ：你可以跳过页面中某些部分的预渲染，然后使用客户端的 JS 生成它们。更多关于这种方法，请看[Data Fetching documentation](/docs/basic-features/data-fetching.md#fetching-data-on-the-client-side).
- 使用 **服务端渲染** ：Next.js 可以在每个请求时预渲染单个页面。这样会减慢访问速度，因为页面无法再由 CDN 缓存，但预渲染得到的页面将总会更新。我们这就开始讨论这种方法。

## 服务端渲染

> 也即 "SSR" 或 "动态渲染"。

如果一个页面使用 **服务端渲染**, 页面 HTML 是在 **每次请求时** 生成的。

要将一个页面变成服务端渲染，你需要 `export` 一个 叫`getServerSideProps` 的 `async` 函数。这个函数会在每次请求时由服务器执行。

例如，假设页面需要预渲染经常更新的数据(从外部 API 拉取)。你可以像下面这样编写 `getServerSideProps` 来获取数据并把它传给 `Page`：

```
function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
```

如你所见，`getServerSideProps` 很像 `getStaticProps`, 但它俩的不同之处在于 `getServerSideProps` 是运行在每次请求时，而非构建时。

> 了解更多 `getServerSideProps` 原理，请看[Data Fetching documentation](/docs/basic-features/data-fetching.md#getserversideprops-server-side-rendering)

## 总结

我们讨论了两种形式的预渲染 for Next.js.

- **纯静态生成 (建议使用)** ：HTML 在 **构建时** 生成并且每次请求时都能复用。要使用纯静态生成技术, 既要导出页面组件，又要导出 `getStaticProps` (也许还有 `getStaticPaths`)。这有助于那些能在用户访问前就预渲染的页面。你也可以在其中插入客户端渲染以获取额外数据。
- **服务端渲染** ： HTML 在 **每次请求** 时渲染。要让页面在服务端渲染，就要导出 `getServerSideProps`。由于服务端渲染性能略差于纯静态生成，建议只在必要时使用。
