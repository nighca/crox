---
layout: post
title: 高性能跨语言模板引擎Crox
author: 李牧
---

作者：李牧

{% raw %}

## 高性能跨语言模板引擎Crox
* Crox是一个由JavaScript语言实现的高性能跨语言模板引擎.Crox模板可以直接在JavaScript环境中使用,也可以翻译成PHP,JSP等其他编程语言的可执行方法或翻译成Velocity,Smarty等其他模板引擎的源模板,Crox将保证翻译后的结果具备最佳执行效率.

* 在生产系统中,我们使用的各种前后端模板引擎多有其独到的一面,而Crox的特点即它是面向"跨语言并高性能"这个目标设计的,Crox的设计过程是在模板提供的功能和模板支持的目标业务类型间进行一次独到的权衡和取舍并最终确认模板API的过程.
    
* 在实现层面,Crox是众多基于语法分析的编译型模板引擎之一.通过严格的API设计,保障翻译后各类代码逻辑简单明确,进而确保多语言环境下的高性能.而Crox语法在一定条件下为Kissy XTemplate或Crox+(开发中)等功能更加强大的前端模板引擎语法所包含,这使得面对更复杂的但仅限于纯前端的应用场景时,Crox的API得到一致的延续和加强.
    
    
### 1 技术背景
#### 1.1 全端时代多种Web架构将长期共存
* 随着无线业务的全面铺开,展现端研发进入全端时代,一项业务常常需要同时支持PC和移动浏览器以及IOS和Android等Native开发框架,展现端多样化促成了服务端接口向纯数据化方向发展.

* 就Web前端而言,无论PC端还是移动端,基于后端纯数据接口在网页端渲染HTML结构的情况越来越多(典型的是各种基于单页应用技术的WebApp),而传统的后端渲染HTML的架构依然长期存在.

* 我们期望寻找或构建一种高效的模板系统,可以统一的描述HTML结构生成的逻辑,让其无论在前端还是在后端采用哪种技术都有一致的输出.这样不同前端架构下的页面组件区块可以相互共享复用,也可以顺手解决掉单页应用内容无法被搜索引擎索引的问题.

### 2 需求分析
#### 2.1 前后端一致渲染的现有方案
* NodeJS:后端引入NodeJS,让JS承担渲染工作,这样就可以采用任意基于JS的模板,达到前后一致.
* Mustache:一种前端广泛使用的Logic-less模板引擎,通过为各种语言提供运行时解析库,达到跨语言的目标.

#### 2.2 现有方案可行性分析
* 引入NodeJS的方案需要对服务端进行大刀阔斧的改造,而引入Node服务无疑增加了系统的复杂度和运维难度,短期内重构核心生产系统的可能性几乎为零.
* 引入Mustache的方案更好一点,但Mustache本身依然存在不少的问题.
  * 首先Logic-less的Mustache将业务逻辑转移到了数据中,这要求输入数据往往需要大量的预处理;而且模板能力过于简单,面对稍复杂的结构即力不从心.
  * 其次Mustache通过为不同语言提供运行时解析库的模式提供模板渲染服务,比如在Php中首选需要引入Mustache.php并实例化Mustache模板引擎("$m = new Mustache_Engine;")后使用.Mustache_Engine的性能非常优秀,但因为Mustache语法无法区分if,else和明确数据所在位置,客观上依然无法与纯粹的Php语言的确定的选择或循环相比,在性能要求极端苛刻的生产环境中依然无法顺利使用.

#### 2.3 技术目标
综合前面的分析,我们需要一种能在多种架构快速应用的同时支持前后端渲染的模板方案.也就是说我们需要一种**高性能跨语言模板引擎**,我们将其定名为Crox.

### 3 设计和实现概要
#### 3.1 通过逻辑"直译"保障性能
实现Crox的跨语言特性需要做离线翻译器而非运行时的中间层,这样源模板通过翻译后将生成一个基于原生JavaScript,Php语言的函数.通过逻辑"直译",生成的函数具备良好的可读性,保障了执行性能,下面是一个例子:

JSON数据:

```
{
  "name": "Chris",
  "value": 10000,
  "taxed_value": 10000 - (10000 * 0.4),
  "in_ca": true
}
```
Crox模板:

```
你好 {{root.name}} 
你刚赢了 ￥{{ root.value}}
{{#if root.in_ca}}
    嗯，税后 ￥{{ root.taxed_value}}
{{/if}}
```

翻译后的JavaScript函数:

```
function (root){
    function $htmlEncode(s) {
        var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
        return String(s).replace(/[<>&"]/g, function(c) {
            return obj[c];
        });
    }
    function $print(s){ $s += s; }
    var $s = '';
    $print("你好 ");
    $print($htmlEncode(root.name));
    $print("\n你刚赢了 ￥");
    $print($htmlEncode(root.value));
    $print("\n");
    if(root.in_ca){
        $print("\n嗯，税后 ￥");
        $print($htmlEncode(root.taxed_value));
        $print("\n");
    }
    return $s;
}
```

翻译后的Php函数:

```javascript
function temp($i_root) {
    $t_r = '';
    $t_r .= '你好 ';
    $t_r .= htmlspecialchars(ToString($i_root->name), ENT_COMPAT, 'GB2312');
    $t_r .= '你刚赢了 ￥';
    $t_r .= htmlspecialchars(ToString($i_root->value), ENT_COMPAT, 'GB2312');
    $t_r .= '';
    if($i_root->in_ca){
      $t_r .= '嗯，税后 ￥';
      $t_r .= htmlspecialchars(ToString($i_root->taxed_value), ENT_COMPAT, 'GB2312');
      $t_r .= '';
    }
    $t_r .= ' ';
    return $t_r;
}
```
可以看出无论是翻译成JavaScript还是Php,翻译后代码的样子和大家读模板时直观的印象一致,遇到判断就是一个判断,遇到一个循环就是一个循环,每次输出什么数据十分明确,和徒手写出的代码一样.也正是这样的"直译"让我们明确每一行代码的性能消耗都是充分和必要的.

XTemplate翻译后的JavaScript函数:

```
function(scope,S,undefined) {
    var buffer = "", config = this.config, engine = this, moduleWrap, utils = config.utils;
    if( typeof module !== "undefined" && module.kissy) {
        moduleWrap = module;
    }
    var runBlockCommandUtil = utils.runBlockCommand;
    var getExpressionUtil = utils.getExpression;
    var getPropertyOrRunCommandUtil = utils.getPropertyOrRunCommand;
    buffer += '你好 ';
    var id0 = getPropertyOrRunCommandUtil(engine, scope, {}, "root.name", 0, 1, undefined, false);
    buffer += getExpressionUtil(id0, true);
    buffer += '\n你刚赢了 ￥';
    var id1 = getPropertyOrRunCommandUtil(engine, scope, {}, "root.value", 0, 2, undefined, false);
    buffer += getExpressionUtil(id1, true);
    buffer += '\n';
    var config2 = {};
    var params3 = [];
    var id4 = getPropertyOrRunCommandUtil(engine, scope, {}, "root.in_ca", 0, 3, undefined, true);
    params3.push(id4);
    config2.params = params3;
    config2.fn = function(scope) {
        var buffer = "";
        buffer += '\n  嗯，税后 ￥';
        var id5 = getPropertyOrRunCommandUtil(engine, scope, {}, "root.taxed_value", 0, 4, undefined, false);
        buffer += getExpressionUtil(id5, true);
        buffer += '\n';
        return buffer;
    };
    buffer += runBlockCommandUtil(engine, scope, config2, "if", 3);
    return buffer;
}
```
上面是Kissy的XTemplate同样的逻辑编译后的函数,其实代码不仅仅这么多,还有很多外部的方法依赖.原因是XTemplate兼容Mustache,兼容Handlebars提供了非常多的辅助功能.这样的翻译结果在前端,每个用户的浏览器中去运行,其消耗完全可以忽略,但一旦转移到动辄数千QPS(Query Per Second)的后端,就立刻变得不容忽视.

所以只有"直译"才能保证跨语言的高性能,如果想做到"直译",必要的功能取舍是设计的重中之重.

#### 3.2 通过功能取舍保证"直译"可行性
前端模板引擎的实现方案一般分两类,通过正则匹配或者通过语法分析,Crox因为需要进行多语言翻译,所以需要采用基于语法分析的方案.同时各种语言之间有着不小的差异,Crox需要做到逻辑简单且明确,这样在做翻译时才能避免太多不确定性引入的性能消耗.所以相比其他模板引擎Crox需要多做一些功能取舍.我们用接下来的例子,来说明CroxAPI设计思路:

JSON数据:

```javascript
{
    string : "a",
    list : [
        {},
        {string : "b"}
    ]
}
```
Mustache模板:

```html
{{#list}}{{string}} {{/list}}
```

在Mustache模板的循环中会查找当前item中的string值,如果没有则继续向外层数据对象中查找,最终输出"a b ".但这样的向外查找逻辑势必会引入很多代码的代价来完成,最终积少成多成为性能问题.Crox通过明确指定访问数据的位置,来避免这些消耗

Crox模板:

```html
{{#each root.list 'val'}}{{root.string}} {{val.string}} {{/each}}
```

上面模板的输出是"a undefined b a ",即需要访问最外层的string值时使用{{root.string}},需要访问item中的string,用临时变量val来访问{{val.string}},输出内容在数据中的位置是非常明确的.基于类似的原因XTemplate中通过"../"来访问相对层次中的数据也是不被支持的.

下面就将介绍经过反复权衡得出的Crox基础API设计基准原则.

#### 3.3 Crox基础API设计原则

* root代表输入的数据对象,除了在循环中,所有待访问数据位置需要写出完整的从root开始的路径.
* 支持并且明确的区分分支语句(if)和循环语句(each)
* 在each中需要显式指定临时变量名,用于指代循环数组中的当前元素和当前index
* 支持简单判断表达式和计算表达式
* 支持子模板引入
* 仅支持以上所述功能

#### 3.4 API功能有限的条件下Crox的试用范围

虽然Crox支持了大量常见的模板功能,但Crox并不能覆盖XTemplate,Handlebars,EJS等众多前端模板引擎所涵盖的所有功能.我们这样看待这个问题:

* 复杂的页面区块是往往伴有复杂的交互行为,无需从后端输出到页面基础HTML中.比如点击弹出的日历组件,仅仅由前端实时构建就够了,这时可以换做其他前端模板引擎完成任务.
* 如果Crox语法可以作为功能更加强大的子集,在需要处理复杂处理时可以通过扩展语法迅速达到目的,下一小节将介绍两种延伸方案的相关设计.

综合以上的考量,Crox模板最适合处理交互不太复杂的页面展示型区块的HTML构建,可以保障在前后端渲染都能拿到良好的性能.

#### 3.5 Crox在前端应对复杂情况的方案

##### 3.5.1 Crox已被XTemplate包含
在最新版本的XTemplate已经包含Crox的全部语法,经常使用XTemplate的亲,欢迎熟悉下Crox的几个约定之后试试Crox吧.

##### 3.5.2 无需语法分析的全功能前端模板引擎Crox+
规划中的Crox+是一个类似EJS语法的全功能前端模板引擎,在模板中负责逻辑的部分可以写任意复杂的JS代码.Crox+的另一个特点是无需经过语法分析解析执行,而是依赖较简单的正则匹配完成模板解析任务.

当前Crox的语法是类似Mustache风格的,为了省去语法分析环节,Crox+的语法风格将发生变化,当然Crox是可以方便的把Crox模板翻译成Crox+指定风格的模板的.

### 4 小结

Crox是一个跨语言的高性能的模板引擎,保证性能的诀窍是保证在各种语言中模板逻辑都能"直译",为了完成这个目标,Crox对模板语法进行了较严格的约定.

使用Crox可以让页面区块生成逻辑,在前后端各种架构的产品中保持一致并运用自如,这样你开发的组件就可以做更加通用的积累和分享.

Crox语法已经被XTemplate兼容,如果你很熟悉XTemplate,简单的改变几处编码习惯,就可以享有Crox带来的便利.而当你觉得Crox力有不逮时,XTemplate会继续帮助你完成你想要的.

### 5 未来
* 增加更多翻译目标.
* 借助Crox对模板的完整解析,促成模板局部刷新的自动化.
* 工程内模板批量离线编译工具.

{% endraw %}
