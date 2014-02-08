KISSY.add(function(S, require) {

    var fn = function(root) {
        var $s = '';
        $s += KISSY.escapeHtml(root.a);
        $s += " fdafdasfds\n\n\n<div>this is root.c : ";
        $s += KISSY.escapeHtml(root.c);
        $s += "</div>\n\n<div>change more</div>\n<div>change more</div>\n<div>change more</div>\n\n" +
            require('../b.tpl').fn(root) +
            "";
        return $s;
    };

    return {
        fn: fn
    };

});