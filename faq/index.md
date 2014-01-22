---
layout: post
title: 问答
---

## Crox是神马？

Crox是一个牛逼的高性能跨语言的模板引擎。

## Crox怎么用？

这取决于你在什么环境下使用Crox了，请参考 [Tutorials](/crox/tutorials) 中的相关介绍。


## crox.js 和 crox-all.js 的区别是什么？

- `crox.js` 只包含 `模板解析` 逻辑 和 `翻译成js` 的逻辑，不包含翻译成 `php/VM `等其他语言或模板的逻辑。crox.js 主要是便于 `前端直接引用`。

- `crox-all.js` 不仅包含 `crox.js` 的 `全部内容` ，还包含了翻译成 `php/VM` 等语言或模板的逻辑和API。主要应用于需要翻译成其他语言的情形，比如在 `nodejs` 环境里。