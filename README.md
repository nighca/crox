# 高性能跨语言模板引擎 Crox 使用说明

## ;-)

github的 markdown 无法很好的表达我对 `Crox` 的深情厚意。 

如果您也想了解Crox所做的事情，强烈欢迎您到 [Crox的thx官网](http://thx.github.io/crox/) 上看看~

## 目录

[综述](#%E7%BB%BC%E8%BF%B0)

[Crox模板语法](#crox%E6%A8%A1%E6%9D%BF%E8%AF%AD%E6%B3%95)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [表达式](#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%BE%93%E5%87%BA)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [if选择语句](#if%E9%80%89%E6%8B%A9%E8%AF%AD%E5%8F%A5)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [each循环语句](#each%E5%BE%AA%E7%8E%AF%E8%AF%AD%E5%8F%A5)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [set赋值语句](#set%E8%B5%8B%E5%80%BC%E8%AF%AD%E5%8F%A5)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [include子模板导入](#include%E5%AD%90%E6%A8%A1%E6%9D%BF%E5%AF%BC%E5%85%A5)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [其他](#%E5%85%B6%E4%BB%96)

[Crox API说明](#crox-api%E8%AF%B4%E6%98%8E)

[在web环境中使用Crox](#%E5%9C%A8web%E7%8E%AF%E5%A2%83%E4%B8%AD%E4%BD%BF%E7%94%A8crox)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [浏览器原生JS](#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8E%9F%E7%94%9Fjs)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Kissy](#kissy)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [SeaJS(CMD)](#seajscmd)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Requirejs(AMD)](#requirejsamd)

[在Nodejs环境中使用Crox](#%E5%9C%A8nodejs%E7%8E%AF%E5%A2%83%E4%B8%AD%E4%BD%BF%E7%94%A8crox)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [将Crox作为node模块引入](#%E5%B0%86crox%E4%BD%9C%E4%B8%BAnode%E6%A8%A1%E5%9D%97%E5%BC%95%E5%85%A5)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [使用Crox命令行工具](#%E4%BD%BF%E7%94%A8crox%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7)

[Kissy中Crox include的使用](#kissy%E4%B8%ADcrox-include%E7%9A%84%E4%BD%BF%E7%94%A8)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [在Kissy下支持Crox include的翻译示例](#%E5%9C%A8kissy%E4%B8%8B%E6%94%AF%E6%8C%81crox-include%E7%9A%84%E7%BF%BB%E8%AF%91%E7%A4%BA%E4%BE%8B)

[其他](#%E5%85%B6%E4%BB%96-1)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Crox相关介绍](#crox%E7%9B%B8%E5%85%B3%E8%AF%B4%E6%98%8E)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Demos](#demos)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [相关资源](#%E7%9B%B8%E5%85%B3%E8%B5%84%E6%BA%90)

&nbsp;

## 综述

Crox是一个由JavaScript语言实现的高性能跨语言模板引擎。

Crox模板可以直接在JavaScript环境中使用，也可以翻译成PHP、JSP等其他编程语言的可执行方法，或翻译成Velocity、Smarty等其他模板引擎的源模板。

Crox将保证翻译后的结果具备最佳执行效率。

* 版本：1.1
* 作者：三冰，李牧，思竹，陆辉，思霏

## Crox模板语法

### 表达式输出

- `{{root}}`  // 输出 data

- `{{root.name}}` // 输出 data.name

- `{{root.value * 2}}` // 输出 2 倍的 data.value

Crox模板支持多种运算符：`.` `[]` `!` `*` `/` `%` `+` `-` `<` `>` `<=` `>=` `===` `!==`

### if选择语句

- `{{#if root.ok}}` 好，又赢了 `{{/if}}`

- `{{#if root.length > 0}}` 有 `{{else}}` 没了 `{{/if}}`

### each循环语句

each用于循环数组或对象

- `{{#each root 'val'}}` `{{val}}` `{{/each}}`

- `{{#each root 'val' 'key'}}` `{{key}}` => `{{val}}` `{{/each}}`

### set赋值语句

重复使用的较长的表达式，可以赋值给一个变量，例如：

`{{set a = data.lilei.mother.phone.brand}}`

如果 `data.lilei.mother.phone.brand` 对应的数据下还有其他属性（例如：`prop`），则可以通过 `a` 获取到：

`prop属性的值为 {{a.prop}}` // 获取到 data.lilei.mother.phone.brand.prop的属性值

### include子模板导入

`{{include "path/to/file.tpl"}}` // 导入file.tpl

### 其他

* **Crox模板语法已被[Kissy XTemplate](http://docs.kissyui.com/1.4/docs/html/api/xtemplate/index.html)模板（有限）兼容**

更多语法说明请参见： [http://thx.github.io/crox/apis/tpl-api/](http://thx.github.io/crox/apis/tpl-api/)

## Crox API说明

Crox的所有接口都声明在 `Crox` 这个JS对象上的。目前，具体的接口包括：

- Crox.parse：解析Crox模板生成语法树AST

- Crox.render：将数据填充到Crox模板中，并生成渲染后的结果

- Crox.compile：将Crox模板编译成 `原生JS Function`

- Crox.compileToPhp：将Crox模板编译成 `PHP函数`

- Crox.compileToVM：将Crox模板翻译成 `Velocity模板`

更多API说明请参见 [http://thx.github.io/crox/apis/js-api/](http://thx.github.io/crox/apis/js-api/)

## 在web环境中使用Crox

### 浏览器原生JS

```html
<!-- 加载 Crox -->
<script src="http://g.tbcdn.cn/thx/crox/1.1.0/crox-all.js"></script>
```

```js
var tmpl = '{{root.a}} - {{root.b}}';

// 编译成原生js Function
var fn = Crox.compile(tmpl);

var html = fn({
    a: 1,
    b: 2
});

console.log(html);  // 1 - 2

```

### Kissy

目前Crox已经加入 [Kissy Gallary](http://gallery.kissyui.com/crox/1.0/guide/index.html) ，通过以下方式即可使用Crox。

- 配置Kissy (Kissy 1.3.0+ 不需要编写此代码)

```js
KISSY.config({
    packages:[
        {
            name: "gallery",
            path: "http://a.tbcdn.cn/s/kissy/",
            charset: "utf-8"
        }
    ]
});
```

- 引用Crox

```js
KISSY.use('gallery/crox/1.0/index', function (S, Crox) {
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

### SeaJS(CMD)

```js
// 配置 Crox 路径
seajs.config({
    alias:{
        'crox':'http://g.tbcdn.cn/thx/crox/1.1.0/seajs/crox.js'
    }
})

// 加载 Crox
seajs.use('crox', function(Crox){
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

### Requirejs(AMD)

```js
// 配置 Crox 路径
require.config({
    paths:{
        'crox':'http://g.tbcdn.cn/thx/crox/1.1.0/amd/crox'
    }
})

// 加载 Crox
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


## Kissy中Crox include的使用

Crox是跨语言的模板引擎。

Crox支持子模板导入(include)，一个模板可能include多个子模板，而每一个子模板，又可能include其他子模板。

以Kissy为基础的前端环境中，模板之间的依赖关系，非常像Kissy模块之间的依赖关系。Kissy所支持的模块依赖机制，能够与Crox的include进行良好的对应。

因此，为了更好的完成Crox到Kissy模块的翻译，将Crox include机制和Kissy模块加载机制对应起来，并保证发布后的Crox-Kissy模块的效率，我们开发了一个Kissy下使用Crox的辅助工具。

此工具在不同的使用场景时所做的具体工作如下：

- 开发时，Crox模板tpl被编译成一个Kissy模块，该模块保留原模板内容，并依赖Crox和其他子模板。[Demo](http://gallery.kissyui.com/crox/1.0/demo/demo/before.html)

- 发布时，Crox模板tpl被Crox.compile翻译成原生js Function，并被包装成Kissy模块（所有子模板依赖都将被替换）。该模块不依赖Crox，也不依赖子模块。 [Demo](http://gallery.kissyui.com/crox/1.0/demo/demo/after.html)

### 在Kissy下支持Crox include的翻译示例

#### Crox模板源文件

`src/app/partials/header/index.tpl`

```html
<div class="header">
    <h2><span>logo</span> {{include ./user/index.tpl}} </h2>
</div>
```

`src/app/partials/header/user/index.tpl`

```html
<div class="user">
    用户：<a href="#nogo">{{root.username}}</a>
</div>
```

#### 开发时实时转化的结果

`src/app/partials/header/index.tpl.js`

```js
KISSY.add('app/partials/header/index.tpl', function(S, Crox, $1) {

    var tmpl = 
'<div class="header">\
    <h2><span>logo</span> {{include ./user/index.tpl}} </h2>\
</div>';

    tmpl = tmpl.replace(RegExp('{{include ./user/index.tpl}}', 'g'), $1.tmpl);

    return {
        tmpl: tmpl,
        fn: Crox.compile(tmpl)
    }
}, {
    requires: [
        'crox', './user/index.tpl'
    ]
});
```

`src/app/partials/header/user/index.tpl.js`

```js
KISSY.add('app/partials/header/user/index.tpl', function(S, Crox) {

    var tmpl = 
'<div class="user">\
    用户：<a href="#nogo">{{root.username}}</a>\
</div>';

    return {
        tmpl: tmpl,
        fn: Crox.compile(tmpl)
    }
}, {
    requires: [
        'crox'
    ]
});
```

#### 发布时转化的结果（经过Crox的翻译后的原生js Function）

`build/app/partials/header/index.tpl.js`

```js
KISSY.add('app/partials/header/index.tpl', function(S) {

var croxFn = function anonymous(root) {
    // 为了篇幅，这里忽略一部分辅助方法 :-)
    var $s = '';function $print(s){ $s += s; } $print("<div class=\"header\">    <h2><span>logo</span> <div class=\"user\">    用户：<a href=\"#nogo\">");
    $print($htmlEncode(root.username));
    $print("</a></div> </h2></div>");
return $s;
};

return {
    fn: croxFn
};

});
```

`build/app/partials/header/user/index.tpl.js`

```js
KISSY.add('app/partials/header/user/index.tpl', function(S) {

var croxFn = function anonymous(root) {
    // 为了篇幅，这里忽略一部分辅助方法 :-)
    var $s = '';function $print(s){ $s += s; } $print("<div class=\"user\">    用户：<a href=\"#nogo\">");
    $print($htmlEncode(root.username));
    $print("</a></div>");
return $s;
};

return {
    fn: croxFn
};

});
```

具体使用示例，请参见 [开发时的示例](http://gallery.kissyui.com/crox/1.0/demo/demo/before.html) 和 [发布后的示例](http://gallery.kissyui.com/crox/1.0/demo/demo/after.html)

更多介绍，请移步：[http://gitlab.alibaba-inc.com/thx/crox-kissy](http://gitlab.alibaba-inc.com/thx/crox-kissy/blob/master/README.md).

## 其他

### Crox相关说明
* Crox版本1.1.0 发布说明 [http://gitlab.alibaba-inc.com/thx/crox/blob/master/release_notes.md](http://gitlab.alibaba-inc.com/thx/crox/blob/master/release_notes.md)
* Crox概要设计 [http://gitlab.alibaba-inc.com/thx/crox/blob/master/docs/crox_design_overview.md](http://gitlab.alibaba-inc.com/thx/crox/blob/master/docs/crox_design_overview.md)
* Crox语法规范 [http://gitlab.alibaba-inc.com/thx/crox/blob/master/docs/crox_spec.pdf](http://gitlab.alibaba-inc.com/thx/crox/blob/master/docs/crox_spec.pdf)


### Demos
* [Crox Kissy Demo](http://gallery.kissyui.com/crox/1.0/demo/index.html)
* [Kissy下使用Crox include的Demo](http://gallery.kissyui.com/crox/1.0/demo/index-grunt.html)

### 相关资源
* [npmjs](https://npmjs.org/package/crox)
* [github](https://github.com/thx/crox)
* [gitlab](http://gitlab.alibaba-inc.com/thx/crox)
* [Kissy Gallary](http://gallery.kissyui.com/crox/1.0/guide/index.html)
* [thx官网](http://thx.github.io/crox/)

* Crox试用旺旺群：`891026490`，欢迎进群或提Issue反馈意见
