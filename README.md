# 高性能跨语言模板引擎 Crox

## 综述

Crox是一个由JavaScript语言实现的 `高性能` `跨语言` 模板引擎。

Crox模板可以直接在JavaScript环境中使用，也可以翻译成PHP、JSP等其他编程语言的可执行方法，或翻译成Velocity、Smarty等其他模板引擎的源模板。

Crox将保证翻译后的结果具备最佳执行效率。

* 版本：1.2
* 作者：三冰，李牧，思竹，陆辉，思霏

## Demo

这里举一个简单的例子，展示Crox将Crox模板翻译成其他语言或模板的强大能力。

### Crox模板文件内容

```html
<div>
<h2>This is A</h2>

<div>
root.a --> {{root.a}}
</div>

<h3>pagelets</h3>
<div class="B">{{include "b.tpl"}}</div>
<div class="C">{{include "c.tpl"}}</div>
<div class="d-d">{{include "d/d.tpl"}}</div>
</div>
```

### 翻译成php

```php
<div>
<h2>This is A</h2>

<div>
root.a --> <?php echo crox_encode($crox_root->a);?>
</div>

<h3>pagelets</h3>
<div class="B"><?php include 'b.php';?></div>
<div class="C"><?php include 'c.php';?></div>
<div class="d-d"><?php include 'd/d.php';?></div>
</div>
```

### 翻译成vm

```html
<div>
<h2>This is A</h2>

<div>
root.a --> #set($t = $_root.a)$!{t}
</div>

<h3>pagelets</h3>
<div class="B">#parse('b.vm')</div>
<div class="C">#parse('c.vm')</div>
<div class="d-d">#parse('d/d.vm')</div>
</div>
```

### 翻译成Nodejs模块

```js
module.exports = function(root) {
    // 忽略$htmlEncode方法源码
    var $s = '';
    $s += "<div>\n<h2>This is A</h2>\n\n<div>\nroot.a --> ";
    $s += $htmlEncode(root.a);
    $s += "\n</div>\n\n<h3>pagelets</h3>\n<div class=\"B\">" +
        require('./b.tpl.js')(root) +
        "</div>\n<div class=\"C\">" +
        require('./c.tpl.js')(root) +
        "</div>\n<div class=\"d-d\">" +
        require('./d/d.tpl.js')(root) +
        "</div>\n</div>";
    return $s;
};
```

### 翻译成seajs模块

```js
define(function(require) {

    return function(root) {
        // 忽略$htmlEncode方法源码
        var $s = '';
        $s += "<div>\n<h2>This is A</h2>\n\n<div>\nroot.a --> ";
        $s += $htmlEncode(root.a);
        $s += "\n</div>\n\n<h3>pagelets</h3>\n<div class=\"B\">" +
            require('./b.tpl')(root) +
            "</div>\n<div class=\"C\">" +
            require('./c.tpl')(root) +
            "</div>\n<div class=\"d-d\">" +
            require('./d/d.tpl')(root) +
            "</div>\n</div>";
        return $s;
    };

});
```

### 翻译成kissy模块

```js
KISSY.add(function(S, require) {

    return function(root) {
        var $s = '';
        $s += "<div>\n<h2>This is A</h2>\n\n<div>\nroot.a --> ";
        $s += KISSY.escapeHtml(root.a);
        $s += "\n</div>\n\n<h3>pagelets</h3>\n<div class=\"B\">" +
            require('./b.tpl')(root) +
            "</div>\n<div class=\"C\">" +
            require('./c.tpl')(root) +
            "</div>\n<div class=\"d-d\">" +
            require('./d/d.tpl')(root) +
            "</div>\n</div>";
        return $s;
    };

});
```

以上翻译过程可由Crox提供的[nodejs命令行工具](http://thx.github.io/crox/apis/nodejs-api/)完成。

更多[Crox模板语法](http://thx.github.io/crox/apis/tpl-api/)和[目标语言](http://thx.github.io/crox/demos/)翻译，请参见[Crox官网](http://thx.github.io/crox/)。


## Crox官网导航

- [Crox官网首页](http://thx.github.io/crox/)
- [快速上手](http://thx.github.io/crox/tutorials)
- [Demos](http://thx.github.io/crox/demos)
- [API介绍](http://thx.github.io/crox/apis)
- [Crox Nodejs命令行工具](http://thx.github.io/crox/apis/nodejs-api/)
- [Crox相关文章](http://thx.github.io/crox/articles)
- [Crox相关资源](http://thx.github.io/crox/resources)
- [常见问题与回答](http://thx.github.io/crox/faq)
- [发布历史](http://thx.github.io/crox/releases)