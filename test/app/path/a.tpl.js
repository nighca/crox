KISSY.add(function(S, require) {

    return function(root) {
        var $s = '';
        $s += "" +
            require('app/b.tpl')(root) +
            "\n";
        return $s;
    };

});