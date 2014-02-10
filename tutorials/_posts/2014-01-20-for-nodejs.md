---
layout: post
title: for NodeJS
---

{% raw %}

## 在Nodejs环境中使用Crox

Crox已经加入npmjs，Crox本身是一个nodejs模块，可被其他模块引用。

另外，Crox也提供命令行工具，可以很方便的将Crox模板转化成js文件或php文件。

 - 如果想引用Crox模块，可以用 `npm install crox` 命令，将Crox安装到nodejs中。

 - 如果同时想使用命令行工具，可以用 `npm install -g crox` (可能需要sudo) 命令，安装Crox模块，并生成Crox命令行工具。

Crox API列出的所有功能，在 Nodejs版本 中同样可用。

### 将Crox作为node模块引入

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

### 使用Crox命令行工具

Crox命令行工具提供了模板的翻译、模板文件改动监听等功能。

命令的具体介绍和使用示例，请参见 [Crox Nodejs命令行工具](/crox/apis/nodejs-api)


{% endraw %}