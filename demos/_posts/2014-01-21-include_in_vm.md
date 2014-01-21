---
layout: post
title: VM中使用Crox include
---

{% raw %}

## Crox模板
`a.tpl`

```
- {{root.a}}

{{include b.tpl}}
```

`b.tpl`

```
- {{root.b}}
```

## Crox翻译后的Velocity模板

`a.vm`

```
#set($dollar='$')#set($sharp='#')- #set($t = $_root.a)$!{t}#parse('b.vm')
```

`b.vm`

```
#set($dollar='$')#set($sharp='#')- #set($t = $_root.b)$!{t}
```

{% endraw %}
