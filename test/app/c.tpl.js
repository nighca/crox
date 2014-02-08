KISSY.add(function(S, require) {

    var fn = function(root) {
        var $s = '';
        $s += "" +
            require('./b.tpl').fn(root) +
            "";
        return $s;
    };

    return {
        fn: fn
    };

});