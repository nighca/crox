---
layout: post
title: for RequireJS(AMD)
---

{% raw %}

## 两种使用方式

- 1. 实时解析：直接使用Crox源模板

**如果模板中使用了 `include`，则必须使用 `预翻译` 方式**

- 2. 预翻译：使用Crox模板翻译后的AMD模块

## 实时解析

### 配置 Crox 路径

```js
require.config({
    paths:{
        'crox':'http://g.tbcdn.cn/thx/crox/1.2.0/crox-all-min'
    }
})
```

### 加载 Crox

```js
require(['crox'], function(Crox){
    var tmpl = '{{root.a}} - {{root.b}}';

    // 编译成原生js Function
    var fn = Crox.compile(tmpl);

    var html = fn({
        a: 1,
        b: 2
    });

    console.log(html);  // 1 - 2
})
```

## 预翻译

使用 [Crox命令行工具](http://thx.github.io/crox/apis/nodejs-api/) 或 [Crox Grunt插件](http://thx.github.io/crox/tutorials/for-grunt/)，将Crox模板翻译成AMD模块，然后通过模块加载器直接使用

Requirejs 预翻译的demo在这里：[http://thx.github.io/crox/demos/generate/](http://thx.github.io/crox/demos/generate/)

{% endraw %}
