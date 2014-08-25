# 高性能跨语言模板引擎 Crox

## 综述

Crox是一个由JavaScript语言实现的 `高性能` `跨语言` 模板引擎。

Crox模板可以直接在JavaScript环境中使用，也可以翻译成PHP、JSP等其他编程语言的可执行方法，或翻译成Velocity、Smarty等其他模板引擎的源模板。

Crox将保证翻译后的结果具备最佳执行效率。

* 版本：1.2
* 作者：三冰，李牧，思竹，陆辉，思霏

##说明
* 遍历数组用 each，遍历对象用 forin
* === !== == != 目前都允许，翻译成 js 时保持不变
* build 目录下，是用 build.wsf（windows 下双击运行，需要 java、google closure compiler）生成的。
  * crox.js 是 web（js）版的
  * crox-all.js 还包含到 php、vm 的翻译
  * crox2.js 是移动 web 版（比 crox.js 更轻量一点，不过差不多）
  * xxx-min.js 是相应的压缩版


## Crox官网导航

- [Crox官网首页](http://thx.github.io/crox/)
- [快速上手](http://thx.github.io/crox/tutorials)
- [Demos](http://thx.github.io/crox/demos)
- [API介绍](http://thx.github.io/crox/apis)
- [Crox Nodejs命令行工具](http://thx.github.io/crox/apis/nodejs-api/)
- [利用Crox命令行工具，将Crox模板翻译成多种文件或模块](http://thx.github.io/crox/demos/generate/)
- [Crox相关文章](http://thx.github.io/crox/articles)
- [Crox相关其他资源](http://thx.github.io/crox/resources)
- [常见问题与回答](http://thx.github.io/crox/faq)
- [发布历史](http://thx.github.io/crox/releases)
