---
layout: post
title: Crox
---

{% raw %}

## Crox 说明

### 简介

Crox 是一个由 JavaScript 语言实现的高性能跨语言模板引擎。

Crox模板可以直接在JavaScript环境中使用，也可以翻译成PHP等其他编程语言的可执行方法或翻译成Velocity等其他模板引擎的源模板，Crox通过独有的模板逻辑“直译”技术确保翻译后的结果具备最佳执行效率。

### 语法

* 表达式输出

```
{{root}}  输出 data

{{root.name}} 输出 data.name

{{root.value * 2}} 输出 2 倍的 data.value

还支持多种运算符：. [] ! * / % + - < > <= >= === !==
```


* 选择语句

```
{{#if root.ok}} 好，又赢了 {{/if}}

{{#if root.length > 0}} 有 {{else}} 没了 {{/if}}

```

* 循环语句,用于循环数组或对象

```
{{#each root 'val'}}{{val}}{{/each}}

{{#each root 'val' 'key'}}{{key}}=>{{val}}{{/each}}
```


* 赋值语句,重复使用的较长的表达式，可以赋值给一个变量，例如：

```
{{set a = data.lilei.mother.phone.brand}}
```

### 示例
一个典型的 Crox 模板：

```
你好 {{root.name}}

你刚赢了 ￥{{ root.value}}

{{#if root.in_ca}}

嗯，税后 ￥{{ root.taxed_value}}

{{/if}}
```


提供以下数据：

```json
{
  "name": "Chris",
  "value": 10000,
  "taxed_value": 10000 - (10000 * 0.4),
  "in_ca": true
}
```

将产生以下结果：

```
你好 Chris

你刚赢了 ￥10000

嗯，税后 ￥6000
```


### 用法

```js
var result = Crox.render(tmpl, data);

\\如果想拿到编译后的JS函数
var fn = Crox.compile(tmpl);
```

{% endraw %}
