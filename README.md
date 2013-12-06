Crox 说明
=======

一、首先
----

Crox ，是一种可以翻译成多种语言的模板



二、简介
----

一个典型的 Crox 模板：

```
你好 {{root.name}}

你刚赢了 ￥{{ root.value}}

{{#if root.in_ca}}

嗯，税后 ￥{{ root.taxed_value}}

{{/if}}
```


提供以下数据：

```
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


完整写出如下（用法）：

```
var f = crox_js(strTmpl);

var strResult = f(data);
```


三、说明
----

该模板可用于前后端，可以翻译成多种语言。该模板选用了一种中间语法，可以生成一个高效的函数。该函数接受一个参数 root（以前叫 data，任意 JSON 类型的数据）。

模板，支持以下语法：

 - 表达式输出

```
{{root}}  输出 data

{{root.name}} 输出 data.name

{{root.value * 2}} 输出 2 倍的 data.value

还支持多种运算符：. [] ! * / % + - < > <= >= === !==
```


 - 选择语句

```
{{#if root.ok}} 好，又赢了 {{/if}}

{{#if root.length > 0}} 有 {{else}} 没了 {{/if}}

```

 - 循环语句,用于循环数组或对象

```
{{#each root 'val'}}{{val}}{{/each}}

{{#each root 'key' 'val'}}{{key}}=>{{val}}{{/each}}
```


 - 赋值语句,重复使用的较长的表达式，可以赋值给一个变量，例如：

```
{{set a = data.lilei.mother.phone.brand}}
```




四、其他
----

1. 文件介绍

    1.  总体演示：test.htm （一个图书列表的例子）

    2. 详细的每个语法的例子汇总：examples.htm

    3. build.wsf：打包工具，从 src 读取文件，经合并压缩，产生到 build 目录下

    4. config.js：包含一些配置项，例如：google closure compiler 路径 和 php 路径

    5. test.hta：js和php的集成测试（win）

    6. crox_spec.pdf： 语法文档

2. 如何运行 test.hta？

    1. 首先需要在 windows 下

    2. 需要 php，可以从 http://php.net/downloads.php 下载，安装到 E:\php\ 下（因为程序需要 E:\php\php.exe。可更改）

    3. 双击 test.hta，点击相应的按钮，就可以开始了（会产生一个临时文件 temp.php 在当前目录，可以自己删掉）



3. 如何运行 build.wsf？

    1. 首先，需要在 windows 系统下

    2. 从 http://code.google.com/p/closure-compiler/ 下载，解压到 D:\gcc\ 下（因为程序需要 D:\gcc\compiler.jar，可更改）

    3. 双击 build.wsf 就可以产生 crox.js、crox_min.js 到 build 目录





**有问题，建议？ 欢迎直接联系我或者发 issue。谢谢！**
