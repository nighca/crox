KISSY.add(function(S, require) {
    var fn = function anonymous(root) {
        var obj = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        };

        function $htmlEncode(s) {
            return String(s).replace(/[<>&"]/g, function(c) {
                return obj[c];
            });
        }
        var $s = '';

        function $print(s) {
            $s += s;
        }
        $print("" +
            require('./b.tpl').fn(root) +
            "");
        return $s;
    };

    return {
        fn: fn
    };

});