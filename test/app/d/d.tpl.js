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
        $print($htmlEncode(root.a));
        $print(" fdafdasfds\n\n\n<div>this is root.c : ");
        $print($htmlEncode(root.c));
        $print("</div>\n\n<div>change more</div>\n<div>change more</div>\n<div>change more</div>");
        return $s;
    };

    return {
        fn: fn
    };

});