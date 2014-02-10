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

```php
- <?php echo crox_encode($crox_root->a);?>

<?php include 'b.php';?>
```

`b.php`

```php
- <?php echo crox_encode($crox_root->b);?>
```

{% endraw %}
