---
layout: post
title: Crox的Nodejs命令行工具
---

{% raw %}

请先确保已通过 `npm install -g crox` 安装了crox命令行工具

## 工具参数说明

命令行工具目前包含以下几个参数：

- `-p` | `--package-path` 设置待翻译Crox模板的根路径，默认是 `当前路径`

- `-e` | `--encoding` 设置Crox模板文件的编码方式，默认是 `utf-8`

- `-t` | `--target-type` 翻译成的目标语言，比如：php|js|vm等，默认是 `js`

- `-x` | `--tpl-suffix` 模板文件后缀，默认是 `tpl`

- `-o` | `--output` 翻译后文件的目标文件夹，默认是 `当前路径`

- `-w` | `--watch` 检测模板文件改动，实时翻译

- `-m` | `--module-prefix` Crox模板文件中引用的模块路径前缀，避免全路径访问的模块被当成相对路径。比如： `app/sub/module/name.js`的 路径前缀 为 `app`，如果不配置module-prefix，则翻译成模块后路径将变为 `./app/sub/module/name.js`，配置以后就不会出现此问题。

- `--nodejs` 将Crox模板翻译成 `nodejs模块`

- `--cmd` 将Crox模板翻译成 `cmd模块`

- `--amd` 将Crox模板翻译成 `amd模块`

- `--html-encode` 指定翻译后js文件中的html转义方法名，比如 `KISSY.escapeHtml`，如果不指定，将在翻译后的文件中添加一个 `$htmlEncode` 方法。

- `--kissy` 将Crox模板翻译成 `Kissy模块`，模块依赖 `crox`，保留了 原来crox模板的内容

- `--kissyfn` 将Crox模板翻译成 `Kissy模块`，模块不依赖 `crox`，返回一个翻译后的Function

- `--silent` 在控制台不输出翻译时的log信息


## 工具使用示例

假设：当前路径下的 `a.tpl` 文件中包含如下内容：

```html
{{root.a}} - {{root.b}}
```

在当前路径下，运行 `crox -t js --html-encode KISSY.escapeHTML`，Crox会将 `a.tpl`文件内容翻译成js Function，生成 `a.tpl.js` 文件，内容如下：

```js
function anonymous(root) {
    var $s = '';
    $s += KISSY.escapeHTML(root.a);
    $s += " - ";
    $s += KISSY.escapeHTML(root.b);
    $s += "\n";
    return $s;
}
```

运行 `crox -t js --html-encode KISSY.escapeHTML --kissyfn`，Crox会将 `a.tpl`文件内容翻译成Kissy模块，生成 `a.tpl.js` 文件的内容如下

```js
KISSY.add(function(S, require) {

    return function(root) {
        var $s = '';
        $s += KISSY.escapeHTML(root.a);
        $s += " - ";
        $s += KISSY.escapeHTML(root.b);
        $s += "\n";
        return $s;
    };

});
```

运行 `crox -t js --html-encode KISSY.escapeHTML --kissy`，Crox会将 `a.tpl`文件内容翻译成Kissy模块，生成 `a.tpl.js` 文件的内容如下

```js
KISSY.add(function(S, require) {
    var Crox = require('crox');

    var tmpl = '{{root.a}} - {{root.b}}\
';


    var fn = Crox.compile(tmpl);
    fn.tmpl = tmpl;

    return fn;
});
```

可见，`--kissyfn` 和 `--kissy` 翻译出的两种不同的Kissy模块之间的差异。

另外：

运行 `crox -t php`，将会翻译 `a.tpl` 并生成php文件 `a.php`

```php
<?php echo crox_encode($crox_root->a);?> - <?php echo crox_encode($crox_root->b);?>
```

运行 `crox -t vm`，将会翻译 `a.tpl` 并生成php文件 `a.vm`

```
#set($t = $_root.a)$!{t} - #set($t = $_root.b)$!{t}
```

如果目录下有多个 `.tpl` 文件，则都会进行翻译操作。

## 其他

- Crox命令行工具只负责将tpl文件翻译成目标文件，并放置在同目录下，如果涉及到打包、combo服务的配置，请参考相关工具，例如Kissy的 `kmc` 工具

- `kissy` 和 `kissyfn`是翻译成kissy模块的两种模式，翻译时可根据要求选择

- 如果是翻译成 `php`，则在使用翻译的php文件时，需要引入 `CROX/lib/crox_extra.php` 文件

- 翻译后只有js文件会在原文件名后添加 `.js` 后缀，其他文件类型是直接替换后缀名，比如 `.php`，`.vm`

- 翻译成的 `php` 要求数据变量名称必须是 `$crox_root`

- 翻译成的 `vm` 要求数据变量名称必须是 `$_root`

{% endraw %}