KISSY.add(function(S, require) {
    var fn = function anonymous(root) {
        
        var $s = '';

crox.compile(tmpl, {
	htmlEncode: 
})
        
        $s += ("<div>\n<h2>start</h2>\n");
        $s += (KISSY.htmlEncode(root.a));

crox-lib.js

crox.compile(tpl, {
	encode: "KISSY.escapeHtml"
})


(function(global) {
	function crox_encode() {

	}

	global.crox_encode = crox_encode;

})(typeof window ? window : global);






crox-plugin.php

crox-plugin.vm

crox_encode

        $s += (crox_encode(root.a));

        $s += ("\nfdasfdas\n\n<h3>import sub tmpls</h3>\n<p>\n" +
            require('./b.tpl').fn(root) +
            "\n" +
            require('./c.tpl').fn(root) +
            "\n" +
            require('./d/d.tpl').fn(root) +
            "\n</p>\n</div>");
        return $s;
    };

    return {
        fn: fn
    };

});