KISSY.add(function(S, require) {
    var fn = function anonymous(root) {
        $print("fdasfdasdfafdafsafdafdasfdas\n\n" +
            require('./d/d.tpl').fn(root) +
            "");
        return $s;
    };

    return {
        fn: fn
    };

});