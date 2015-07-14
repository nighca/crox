# crox-p

crox-p是在[crox](http://thx.github.io/crox/)的基础上改进得到的模板引擎，用于m-nuomi-com项目。

兼容crox模板现有所有语法，crox已有语法[见此](http://thx.github.io/crox/apis/tpl-api/)。

注意：crox本身支持直接在JavaScript环境中使用，也可以翻译成PHP、JSP等其他编程语言的可执行方法，或翻译成Velocity、Smarty等其他模板引擎的源模板。crox-p的改动则仅实现了JS及PHP部分，可以认为crox-p仅支持JS及PHP。

crox-p的改动包括：

* 注释

  ```
  {* 这里是注释 *}
  ```

* 自定义helper方法的能力

  在dep/crox/crox-extra.js及dep/crox/crox-extra.php进行方法的定义，在全站模板中均可使用。
  
  名为`foo`的方法，在crox-extra.js中添加`crox.helpers.foo = function () {...}`定义，在crox-extra.php中添加`function crox_foo () {...}`定义，在模板中使用示例：
  
  ```
  {{foo(root.name)}}
  ```
  
* `include`支持作用域及传参

  每个模板中的变量作用域都是独立的，在`include`其他模板时可以选择传入参数，子模板可以通过`root`获取到传入的变量，语法如下：
  
  ```
  {{include "../../widget/entry/entry.tpl"
    page = page,
    webSpeedId = webSpeedId
  }}
  {* entry.tpl中可以通过root.page及root.webSpeedId获取到对应的值 *}
  ```

* 修复了一些crox在实现PHP代码生成时的bug（包括获取属性的方式及PHP `include` 相对路径的问题）
