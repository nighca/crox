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

同理：

- 运行 `crox -t php`，将会翻译 `a.tpl` 并生成php文件 `a.php`
- 运行 `crox -t vm`，将会翻译 `a.tpl` 并生成php文件 `a.vm`

如果目录下有多个 `.tpl` 文件，则都会进行翻译操作。

{% endraw %}