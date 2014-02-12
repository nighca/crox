---
layout: post
title: Crox
---

## 综述

Crox是一个由JavaScript语言实现的高性能跨语言模板引擎。

Crox模板可以直接在JavaScript环境中使用，也可以翻译成PHP、JSP等其他编程语言的可执行方法，或翻译成Velocity、Smarty等其他模板引擎的源模板。

Crox将保证翻译后的结果具备最佳执行效率。

* 版本：1.2
* 作者：三冰，李牧，思竹，陆辉，思霏

## 在线尝鲜

<iframe width="100%" height="500" src="http://jsfiddle.net/4HYvm/3/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 认识 Crox

### 为什么“又”做一个模板引擎
全端时代的展现端多样化迫使后端服务纯数据化改造进程加快，而在前端领域依靠前端构造展现的WebAPP架构与后台输出展现的传统架构将长期共存。在此背景下一个能够在多种架构环境中广泛适用的跨语言模板引擎将带给我们:

* 不同Web架构间从数据到HTML的构建过程的统一，这样：
  * 不同架构间的前端组件和区块可以共享复用
  * 前端工程师改开发Demo为开发模板，降低“套页面”引入的质量风险
* 促成新型的同时支持前后端渲染的前端架构，可以：
  * 解决单页应用站点内容无法被搜索引擎抓取的问题
  * 让移动端在省电模式（高网速后台渲染）和省流量模式（低网速前台渲染）中灵活切换成为可能
* 基于语法、词法分析的模板引擎将有助于区块内基于数据变化进行局部刷新的技术实现

### 高性能是跨语言模板引擎能够广泛应用的前提
“高性能”是跨语言全端模板引擎的核心技术指标。因为无论在动辄数千QPS的后端环境下，还是在展现伴随着内存和电力消耗的移动端，模板引擎的性能要求都比在PC端分布式运行的环境里高出太多。那么如何做到高性能呢？

#### 通过逻辑“直译”保障高效

#### 通过明确的API定义保障逻辑"直译"可行

因此，我们提出了Crox。

Crox是如何做到 `高性能` 和 `跨语言` 的呢？请先看看 [Crox的概要设计文档](./articles/crox_design_overview) 吧

## Crox模板语法

{% raw %}


### 表达式输出

- `{{root.name}}` // 输出 data.name

### if选择语句

- `{{#if root.length > 0}}` 有 `{{else}}` 没了 `{{/if}}`

### each循环语句

- `{{#each root 'val' 'key'}}` `{{key}}` => `{{val}}` `{{/each}}`

### set赋值语句

- `{{set a = data.lilei.mother.phone.brand}}` 然后可以 `{{a.prop}}`

### include子模板导入

- `{{include "path/to/file.tpl"}}` // 导入file.tpl

### raw保留原始内容

- `{{#raw}}<script>console.log('{{#if}}{{/if}}')</script>{{/raw}}` Crox翻译输出 `<script>console.log('{{#if}}{{/if}}')</script>`

**Crox模板语法已被 [Kissy XTemplate](http://docs.kissyui.com/1.4/docs/html/api/xtemplate/index.html) 模板（有限）兼容**

更多Crox模板语法说明，请点击 [这里](./apis/tpl-api)

如果对Crox的 `编译原理` 部分感兴趣，欢迎翻阅 [Crox语言规范](./articles/crox_spec)

{% endraw %}


## Crox JS API

### Crox.parse

解析Crox模板生成语法树 `AST`

### Crox.render

将数据填充到Crox模板中，并生成渲染后的结果

### Crox.compile

将Crox模板编译成 `原生JS Function`

### Crox.compileToPhp

将Crox模板编译成 `PHP文件`

### Crox.compileToVM

将Crox模板翻译成 `Velocity模板`

API详细介绍请参见 [Crox JS API](/crox/apis/js-api)

API的使用Demo，请参见 [Crox Demos](/crox/demos)

## Crox Nodejs 命令行工具

- 如何将Crox模板文件批量翻译成 `php` | `vm` | `Nodejs模块` | `Seajs模块` | `Kissy模块`？

- 如何watch模板文件的改动？

- 如何指定翻译时的html转义方法？

- 如何指定crox模板文件的后缀名？

Crox提供了命令行工具来完成以上任务。

通过 `npm install -g crox` 安装后，即可使用 `crox` 命令。

命令的具体参数和使用示例，请参见 [Crox Nodejs命令行工具](/crox/apis/nodejs-api)

## 导航

- [快速上手](./tutorials)
- [Demos](./demos)
- [API介绍](./apis)
- [Crox Nodejs命令行工具](/crox/apis/nodejs-api)
- [Crox文章](./articles)
- [相关资源](./resources)
- [常见问题与回答](./faq)
- [发布历史](./releases)
