var fs = require('fs');
var path = require('path');

var includeReg = /\{\{\s*include\s+[\"\']?([^\s\"\']*)\s*[\"\']?\s*\}\}/gm;

function _precompile(root, tmpl, stack) {
    return tmpl.replace(includeReg, function(includeStmt, included) {
        var tplPath = path.join(path.dirname(root), included);
        if (stack.indexOf(tplPath) != -1) {
            throw Error('[Crox] Circular dependency detected: ' + stack.join(' --> '));
        }
        if (fs.existsSync(tplPath)) {
            stack.push(tplPath);

            var content = fs.readFileSync(tplPath).toString();
            var result = _precompile(tplPath, content, stack);

            stack.pop();
            return result;
        } else {
            throw Error('[Crox] File not found: ' + tplPath);
        }
    });
}

function precompile(root) {
    if (fs.existsSync(root)) {
        var content = fs.readFileSync(root).toString();
        return _precompile(root, content, [root])
    } else {
        throw Error('[Crox] File not found: ' + root)
    }
}

exports.precompile = precompile;