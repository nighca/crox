---
layout: post
title: for NodeJS
---

{% raw %}

## 将Crox模板预翻译成Nodejs模块

使用 [Crox命令行工具](http://thx.github.io/crox/apis/nodejs-api/) 或 [Crox Grunt插件](http://thx.github.io/crox/tutorials/for-grunt/)，将Crox模板翻译成Nodejs模块，然后通过模块加载器直接使用

Nodejs 预翻译的demo在这里：[http://thx.github.io/crox/demos/generate/](http://thx.github.io/crox/demos/generate/)

## 将Crox作为Node模块引入

请先通过 `npm install crox` 安装。

使用时，将 `crox` 模块 通过 `require` 引入即可使用。

```js
// 请先确保通过 npm install 已安装
var Crox = require('crox');

var tmpl = '{{set ok = root.ok}} {{#if ok}} 好 {{else}} 不好 {{/if}}';

// 将模板翻译成php
var php = Crox.compileToPhp(tmpl);

console.log(php);
```

用node运行这段JS，控制台输出是一段 `php` 代码，内容如下：

```php
<?php $crox_ok = $crox_root->ok;?> <?php if($crox_ok){?> 好 <?php }else{?> 不好 <?php }?>
```

## 使用Crox命令行工具

通过 `npm install crox -g` 安装Crox命令行工具

Crox命令行工具提供了模板的翻译、模板文件改动监听等功能。

命令的具体介绍和使用示例，请参见 [Crox Nodejs命令行工具](/crox/apis/nodejs-api)

## 使用Crox的Grunt插件

请参见 [http://thx.github.io/crox/tutorials/for-grunt/](http://thx.github.io/crox/tutorials/for-grunt/)

{% endraw %}