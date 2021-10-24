---
title: 译 Styling React Native Apps
date: 2020/3/10
description: 翻译一篇 React Native 文章.
tag: React, translation
author: ShiftWatchOut
---

# 译 Styling React Native Apps

> 如果您曾经开发过 React Native，您可能会意识到它不像 Web 应用程序那样使用一般的 HTML 和 CSS 。在本指南中，我们将讨论其中的差异。您将看到的主要区别之一是，所有内容都是根据 Flexbox 自动设置的。

现在，如果需要，您可以直接引入 styled-components 库，并像以前一样使用 CSS 。这是一个很棒的库，作者极力推荐。但是，如果您希望了解在原生应用程序中如何进行样式设置，请接着看下去。

### StyleSheet

想在 React Native 中使用样式的第一件事是使用 StyleSheet 组件。首先引入它

```
import { StyleSheet } from 'react-native';
```

引入后像这样使用

```
const styles = StyleSheet.create({
  container: {
    height: 100
  }
})
```

然后像下面这样装点你想要美化的组件

```
<View style={styles.container}></View>
```

也可以采用内联的方式，殊途同归

```
<View style={ {height: 100} }></View>
```

### Pixels?

看起来很像 CSS ，对吧？ 事实上，它们是名称相同，与 CSS 相对照，但是您可能会注意到，我们在 `height: 100` 中没有明示任何单位。您可能习惯于写上 `px`、`vm` 等。那么问题来了，React Native 默认使用什么单位呢？

这是一个非常复杂的问题，需要花费多篇文章来回答。对于 iOS ，它们是 “logical points” ，而 Android 使用 DIP 。这样做的原因有很多。简而言之就是，屏幕有许多不同的屏幕尺寸和分辨率。因此，如果我们使用 px ，则在某些手机上会显得点阵化。然而 “points” 的想法是使像素密集的高分辨率屏幕上的内容看起来与低分辨率屏幕上的内容相对一致。

好在，这个设计将为您处理从 iOS 到 Android 的大多数样式。虽然它并不完美，但应用在两个平台看起来大致相同。您的应用的高度，宽度，`borderWidth`等在屏幕上的外观，都将在后台进行计算。

您也可以使用 “auto” 或百分比，但是需将其用引号引起来，如下所示

```
<View style={{ height: '100%' }}></View>
```

### Wrap Entire Screen

现在，要了解的是关于设置 `<View>` 填充整个屏幕的一件事。像 iPhoneX 这样的异形屏手机的一部分屏幕残缺了，一些元素将被放置在刘海下面。为避免这个问题，只需使用 React Native 组件 `<SafeAreaView>` 来包装其余的组件，就可以确保您将看到所有屏幕。

另一件事是直接使用 `flex: 1` 。记住，React Native默认使用 Flexbox ，因此您无需在任何元素上设置 `display: flex` 。但是为什么添加 `flex: 1` 可以使元素全屏显示呢？

在 React Native 中，默认的 `flexDirection` 是 `column` ，您可以设置 `flexDirection` 。但如果没有先设置，则 `flex: 1` 使元素沿主轴向下延伸，因为默认情况下为纵列。如果了解 Flexbox ，就知道没有其他元素时，设为 `flex: 1` 的元素将填充父容器的整个主轴。

### Margins and Padding

在 React Native 中，关于样式的一点好处是设置边距和填充。两者都提供了一种在一行代码设置上下或左右距离的方法。他们两个都使用了 `Horizontal` 和 `Vertical` 这个词。

例如，要使元素的上下边距为20，可以这样设置：`<View style={{ marginVertical: 20 }}></View>` 。您也可以使用 `paddingVertical: 20` 设置顶部和底部填充。还有 `paddingHorizontal` 和 `marginHorizontal` 。

这些都还不错，但是您可能会注意到您无法完全像在前端那样去编码，例如：`margin: '20 0 20 0'` 。这在 React Native 中无效。

### Shadows and Borders

CSS 中的 border 样式在 React Native 样式中无效。您必须将其分别写为 `borderColor` 和 `borderWidth` 。使用这两个属性，足够您对边界进行设置。另外，您可以选择哪一侧使用哪种颜色/宽度。

您可能已经习惯了`borderRadius` ，它为每个角提供了弧度。您可以使用`top-start`，`top-end`，`bottom-start`或`bottom-end`来选择每个单独的
弧度，例如：`borderTopStartRadius: 20`，或者可以使用更简单的`top-left`，`top-right`等等。最后，您可以使用`borderStyle`从虚线，虚线或
实线边框中进行选择。

至于 React Native 中的阴影，您将无法使用您可能熟悉 `box-shadow` 。相反， React Native 有的是仅在 iOS 中有效的样式。使用以下三种样式：`shadowOffset: { height: 3, width: 3 }, shadowColor: '#0000', shadowOpacity: 0.5, shadowRadius: 5 }` 。这些阴影效果非常好，如果您熟悉前端的阴影，这些阴影将很容易搞懂。

但是，在 Android 中，React Native 没有一个很棒的内置解决方案。您可以设置`elevation`属性，但这不是可自定义的，因此无法与其他样式（例如
边框和背景色）配合使用。对于 Android ，我建议 [react-native-shadow](https://www.npmjs.com/package/react-native-shadow) 库。

### Platform-Specific

在上一节中，我们看到了平台之间的第一个主要区别：一个具有阴影样式，而另一个则没有。现在的好消息是，在上面的示例中，Android 将直接忽略它不支持的样式。它不会生效，但是至少您不会收到任何报错。在大多数情况下，您会发现平台不支持的所有样式都将被忽略。

但是，即使使用完美，简洁的样式，您也会发现从一个平台到另一个平台的外观差异很大。这是必然的。为了使样式在各个平台上看起来相似，让我们从 React Native 引入 Platform 组件。引入后，您可以将样式设置为动态的，跟随平台变化。

```
import { View, StyleSheet, Platform } from 'react-native';

{/* ... */}
<View style={styles.container}></View>
{/* ... */}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'android' ? 100 : 20,
    backgroundColor: Platform.OS === 'ios' ? 'yellow' : 'blue',
    ...Platform.select({ ios: { width: 100 } })
  }
})
```

请注意此处设置平台特定样式的两种不同方式。一种方式是在样式之后，使用三元运算符height: `Platform.OS === 'ios' ? 100 : 20` 。在大多数情况下，此方法效果很好，但是如果您想为不止一个平台设置样式怎么办？ 这就轮到 `...Platform.select()` 了。这允许您在一个平台上或在两个平台上指
定样式：`...Platform.select({ ios { width: 100 }, android: { width: 75 } })` 。

### Other

现在，样式变得比本文涵盖的范围更深，更复杂。您会在 React Native 中注意到样式在组件之间是不同的，这与 Web 前端基本上每个元素都可以使用的每种样式不同。如果查看官方的[React Native 文档](https://facebook.github.io/react-native/docs/text#style)，您将看到一个组件列表，并且在每个组件下都有可用于设计组件的样式列表。与前端相比，您会发现这些功能有些局限，并且某些功能（例如 Button 组件）甚至没有样式属性。

在很多时候，您可以使用 `<TouchableOpacity>` 类的组件 ，当然还可以使用 `<View>` ，[这些组件](https://alligator.io/react/react-native-basic-components/)具有大多数可用的样式。
