(function() {
    var fn = {};
    var fs = require('fs');
    var TMPLS = require('./tmpls.js');
    var utils = require('./utils.js');
    var crox = require('../../build/crox-all');

    var relative = utils.relative;
    var placeholder = utils.placeholder;
    var getReplaces = utils.getReplaces;

    function compileToModule(options, tmpl, code, ext) {
        ext = ext || '';
        var replaces = '';
        var includeStrs = tmpl.match(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm);

        var recorders = [];
        tmpl = tmpl.replace(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm, function($a, $b) {
            var index = recorders.length;
            recorders.push($b);
            return placeholder(index);
        });
        if (includeStrs) {
            replaces = '\n' + getReplaces(includeStrs, options.modulePrefix) + '\n';
        }
        var fn = crox.compile(tmpl, {
            htmlEncode: options.htmlEncode || ''
        }).toString();

        fn = fn.replace('function anonymous', 'function');

        recorders.forEach(function(rec, index) {
            rec = relative(rec, options.modulePrefix);
            fn = fn.replace(placeholder(index), "\" + \n require('" + rec + ext + "')(root) + \n \"");
        })        
        code = code.replace('{{code}}', fn);
        return code;
    }

    function compileToKissyFn(file, options) {
        options.htmlEncode = options.htmlEncode || "KISSY.escapeHtml";

        var tmpl = fs.readFileSync(file, 'utf8');

        var code = TMPLS.KISSY_FN_TEMPLATE;

        code = compileToModule(options, tmpl, code, '');

        return code;
    }

    function compileToCMD(file, options) {
        var tmpl = fs.readFileSync(file, 'utf8');

        var code = TMPLS.CMD_TEMPLATE;
        code = compileToModule(options, tmpl, code);
        
        return code;
    }

    function compileToCommonJS(file, options) {
        var tmpl = fs.readFileSync(file, 'utf8');

        var code = TMPLS.COMMONJS_TEMPLATE;
        code = compileToModule(options, tmpl, code, '.js');
        
        return code;
    }

    function compileToAMD(file, options) {
        var tmpl = fs.readFileSync(file, 'utf8');

        var code = TMPLS.AMD_TEMPLATE;
        code = compileToModule(options, tmpl, code);
        
        return code;
    }

    function compileToKissy(file, options) {
        var tmpl = fs.readFileSync(file, 'utf8');

        tmpl = tmpl.replace(/'/g, '\\\'');

        var code = TMPLS.KISSY_TEMPLATE;
        var replaces = '';
        var includeStrs = tmpl.match(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm);

        tmpl = tmpl.replace(/\n/g, '\\\n');
        if (includeStrs) {
            replaces = '\n' + getReplaces(includeStrs, options.modulePrefix) + '\n';
        }

        code = code.replace('{{tmpl}}', tmpl);
        code = code.replace('{{replaces}}', replaces);

        return code;
    }

    fn.compileToKissy = compileToKissy;
    fn.compileToKissyFn = compileToKissyFn;
    fn.compileToCMD = compileToCMD;
    fn.compileToAMD = compileToAMD;
    fn.compileToCommonJS = compileToCommonJS

    module.exports = fn;
})();