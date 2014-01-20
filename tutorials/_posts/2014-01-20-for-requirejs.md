---
layout: post
title: for RequireJS(AMD)
---

{% raw %}

## 配置 Crox 路径

```js
require.config({
    paths:{
        'crox':'http://g.tbcdn.cn/thx/crox/1.1.0/amd/crox'
    }
})
```

## 加载 Crox

```js
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

{% endraw %}
