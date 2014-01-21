---
layout: post
title: PHP中使用Crox include
---

{% raw %}

## Crox模板
`a.tpl`

```
- {{root.a}}

{{include "b.tpl"}}
```

`b.tpl`

```
- {{root.b}}
```

## Crox翻译后的php

`a.php`

```
function temp($i_root) {
    // helpers
    $t_r = '';
    $t_r .= '- ';
    $t_r .= htmlspecialchars(ToString($i_root->a), ENT_COMPAT, 'GB2312');
    include 'b.php';
    return $t_r;
}
```

`b.php`

```
function temp($i_root) {
    // helpers
    $t_r = '';
    $t_r .= '- ';
    $t_r .= htmlspecialchars(ToString($i_root->b), ENT_COMPAT, 'GB2312');
    return $t_r;
}
```

{% endraw %}
