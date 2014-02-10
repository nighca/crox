function heredoc(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '')
        .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') 
}


var KISSY_FN_TEMPLATE = heredoc(function() {
    /*
    KISSY.add(function(S, require) {
        
        var fn = {{code}};

        return fn;

    });
    */
});

var CMD_TEMPLATE = heredoc(function() {
    /*
    define(function(require) {
        
        var fn = {{code}};

        return fn;

    });
    */
});

var COMMONJS_TEMPLATE = heredoc(function() {
    /*
        var fn = {{code}};

        module.exports = fn;
    */
});

var AMD_TEMPLATE = heredoc(function() {
    /*
    define(function(require) {
        
        var fn = {{code}};

        return fn;

    });
    */
});

var KISSY_TEMPLATE = heredoc(function() {
    /*
    KISSY.add(function(S, require) {
        var Crox = require('crox'); 

        var tmpl = '{{tmpl}}'; 
        {{replaces}}

        var fn = Crox.compile(tmpl);
        fn.tmpl = tmpl;

        return fn;
    });
    */
});

exports.KISSY_FN_TEMPLATE = KISSY_FN_TEMPLATE;
exports.CMD_TEMPLATE = CMD_TEMPLATE;
exports.COMMONJS_TEMPLATE = COMMONJS_TEMPLATE;
exports.AMD_TEMPLATE = AMD_TEMPLATE;
exports.KISSY_TEMPLATE = KISSY_TEMPLATE;