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

```js
function temp($i_root) {
// 为了篇幅，这里忽略一部分辅助方法 :-)
$t_r = '';
$i_ok = $i_root->ok;
$t_r .= ' ';
if($i_ok){
  $t_r .= ' 好 ';
}
else{
  $t_r .= ' 不好 ';
}
$t_r .= '
';
return $t_r;
}

```

### 使用Crox命令行工具

请先确保已通过 `npm install -g crox` 安装了crox命令行工具

#### 工具参数说明

命令行工具目前包含以下几个参数：

- `-p` | `--package-path` 设置待翻译Crox模板的根路径，默认是 `当前路径`

- `-e` | `--encoding` 设置Crox模板文件的编码方式，默认是 `utf-8`

- `--target-type` 翻译成的目标语言，比如：php|js等，默认是 `js`

- `--tpl-suffix` 模板文件后缀，默认是 `tpl`

- `-o` | `--output` 翻译后文件的目标文件夹，默认是 `当前路径`

#### 工具使用示例

假设：当前路径下的 `a.tpl` 文件中包含如下内容：

```html
{{set ok = root.ok}} {{#if ok}} 好 {{else}} 不好 {{/if}
```

在当前路径下，运行 `crox --target-type js`，Crox会将 `a.tpl`文件内容翻译成js Function，生成 `a.js` 文件，内容如下：

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

同理，运行 `crox --target-type php`，将会翻译 `a.tpl` 并生成php文件 `a.php`。

{% endraw %}