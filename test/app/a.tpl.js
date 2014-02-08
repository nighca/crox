KISSY.add(function(S, require) {

    var fn = function(root) {
        var $s = '';
        $s += "<div>\n<h2>start</h2>\n";
        $s += root.a;
        $s += "fdafda\nfdasfdas\n\n<h3>import sub tmpls</h3>\n<p>\n" +
            require('./b.tpl').fn(root) +
            "\n" +
            require('./c.tpl').fn(root) +
            "\n" +
            require('./d/d.tpl').fn(root) +
            "\n</p>\n</div>";
        return $s;
    };

    return {
        fn: fn
    };

});