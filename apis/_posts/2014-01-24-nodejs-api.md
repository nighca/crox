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

## 工具使用示例

假设：当前路径下的 `a.tpl` 文件中包含如下内容：

```html
{{set ok = root.ok}} {{#if ok}} 好 {{else}} 不好 {{/if}
```

在当前路径下，运行 `crox -t js`，Crox会将 `a.tpl`文件内容翻译成js Function，生成 `a.js` 文件，内容如下：

```js
function anonymous(root) {
    // 为了篇幅，这里忽略一部分辅助方法 :-)
    var $s = '';function $print(s){ $s += s; } var ok=root.ok;
    $print(" ");
    if(ok){
        $print(" 好 ");
    }
    else{
        $print(" 不好 ");
    }
return $s;
}
```

同理：

- 运行 `crox -t php`，将会翻译 `a.tpl` 并生成php文件 `a.php`
- 运行 `crox -t vm`，将会翻译 `a.tpl` 并生成php文件 `a.vm`

如果目录下有多个 `.tpl` 文件，则都会进行翻译操作。

{% endraw %}