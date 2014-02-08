(function() {
    var fn = {};
    var fs = require('fs');

    var crox = require('../../build/crox-all');

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

            return {
                fn: fn
            };

        });
        */;
    });

    var KISSY_TEMPLATE = heredoc(function() {
        /*
        KISSY.add(function(S, require) {
            var Crox = require('crox'); 

            var tmpl = '{{tmpl}}'; 
            {{replaces}}
            return { 
                tmpl: tmpl, 
                fn: Crox.compile(tmpl) 
            } 
        });
        */;
    });

    function relative(include) {
        if (include.indexOf('"') == 0) {
            include = include.slice(1, -1);
        }
        if (include.indexOf('.') != 0 // 不是./ 或 ../的相对路径
            && include.indexOf('/') != 0) { // 不是 / 开头的绝对路径
            // 那就认为是相对与当前模块的相对路径
            include = './' + include;
        }
        return include;
    }

    function getReplaces(includeStrs) {
        var mapper = {};
        var replaces = [];
        includeStrs.forEach(function(s) {
            var include = s.replace(/(\{\{\s*include\s+"\s*)|(\s*\.tpl\s*"\s*\}\}\s*)/g, '');
            include = relative(include);
            // 避免重复replace
            if (mapper[include]) {
                return;
            }
            mapper[include] = 1;
            replaces.push("tmpl = tmpl.replace(RegExp('" + s + "', 'g'), require('" + include + ".tpl').tmpl);")
        })
        replaces = replaces.join('');
        return replaces;
    }

    function placeholder(index) {
        return '__CROX_PLACEHOLDER__' + index + '__CROX_PLACEHOLDER__';
    }

    function compileToKissyFn(file) {
        var tmpl = fs.readFileSync(file, 'utf8');

        var code = KISSY_FN_TEMPLATE;
        var replaces = '';
        var includeStrs = tmpl.match(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm);

        var recorders = [];
        tmpl = tmpl.replace(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm, function($a, $b) {
            var index = recorders.length;
            recorders.push($b);
            return placeholder(index);
        });
        if (includeStrs) {
            replaces = '\n' + getReplaces(includeStrs) + '\n';
        }
        var fn = crox.compile(tmpl).toString();

        recorders.forEach(function(rec, index) {
            rec = relative(rec);
            fn = fn.replace(placeholder(index), "\" + \n require('" + rec + "').fn(root) + \n \"");
        })        
        code = code.replace('{{code}}', fn);

        return code;
    }

    function compileToKissy(file) {
        var tmpl = fs.readFileSync(file, 'utf8');

        var code = KISSY_TEMPLATE;
        var replaces = '';
        var includeStrs = tmpl.match(/\{\{\s*include\s+([^\s]*)\s*\}\}/gm);

        tmpl = tmpl.replace(/\n/g, '\\\n');
        if (includeStrs) {
            replaces = '\n' + getReplaces(includeStrs) + '\n';
        }

        code = code.replace('{{tmpl}}', tmpl);
        code = code.replace('{{replaces}}', replaces);

        return code;
    }

    fn.heredoc = heredoc;
    fn.compileToKissy = compileToKissy;
    fn.compileToKissyFn = compileToKissyFn;

    module.exports = fn;
})();