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


function placeholder(index) {
    return '__CROX_PLACEHOLDER__' + index + '__CROX_PLACEHOLDER__';
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

exports.relative = relative;
exports.placeholder = placeholder;
exports.getReplaces = getReplaces;