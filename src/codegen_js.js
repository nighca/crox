/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_js_tran(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="String" />

	var sIndent = '\t';
	function indent() {
		sIndent += '\t';
	}
	function outdent() {
		sIndent = sIndent.slice(0, -1);
	}
	function emit(s) {
		body += sIndent + s + '\n';
	}
	function stmtGen(a) {
		switch (a[0]) {
			case 'if':
				emit('if(' + exprGen(a[1]) + '){');
				indent();
				stmtsGen(a[2]);
				outdent();
				emit('}');
				if (a[3]) {
					emit('else{');
					indent();
					stmtsGen(a[3]);
					outdent();
					emit('}');
				}
				break;
			case 'each':
				var k = a[3] || '$i';
				emit('var $list = ' + exprGen(a[1]) + ';');
				emit('for(var ' + k + ' in $list) {');
				indent();
				emit('var ' + a[4] + ' = $list[' + k + '];');
				stmtsGen(a[2]);
				outdent();
				emit('}');
				break;
			case 'set':
				emit('var ' + a[1] + '=' + exprGen(a[2]) + ';');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (a[2]) s = '$htmlEncode(' + s + ')';
				emit('$print(' + s + ');');
				break;
			case 'text':
				emit('$print(' + quote(a[1]) + ');');
				break;
			default:
				throw Error('unknown stmt: ' + a[0]);
		}
	}
	function stmtsGen(a) {
		for (var i = 0; i < a.length; ++i)
			stmtGen(a[i]);
	}


	function exprToStr(x, check) {
		var t = exprGen(x);
		if (check && !check(x[0])) t = '(' + t + ')';
		return t;
	}
	function exprGen(x) {
		switch (x[0]) {
			case 'id':
				return x[1];
			case 'lit':
				if (typeof x[1] == 'string')
					return quote(x[1]);
				return String(x[1]);
			case '.':
				return exprToStr(x[1], isMember) + '.' + x[2];
			case '[]':
				return exprToStr(x[1], isMember) + '[' + exprGen(x[2]) + ']';
			case '!':
				return '!' + exprToStr(x[1], isUnary);
			case 'u-':
				return '- ' + exprToStr(x[1], isUnary);
			case '*': case '/': case '%':
				return exprToStr(x[1], isMul) + x[0] + exprToStr(x[2], isUnary);
			case '+': case '-':
				return exprToStr(x[1], isAdd) + x[0] + ' ' + exprToStr(x[2], isMul);
			case '<': case '>': case '<=': case '>=':
				return exprToStr(x[1], isRel) + x[0] + exprToStr(x[2], isAdd);
			case 'eq': case 'ne':
				return exprToStr(x[1], isEquality) + (x[0] == 'eq' ? '===' : '!==') + exprToStr(x[2], isRel);
			case '&&':
				return exprToStr(x[1], isLogicalAnd) + '&&' + exprToStr(x[2], isEquality);
			case '||':
				return exprToStr(x[1], isLogicalOr) + '||' + exprToStr(x[2], isLogicalAnd);
			default:
				throw Error("unknown expr: " + x[0]);
		}
	}

	var body = '';
	stmtsGen(prog[1]);

	return body;
}
function codegen_js_wrap(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="Function" />
	var body = "var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n\
	function $htmlEncode(s) {\n\
		return String(s).replace(/[<>&\"]/g, function(c) {\n\
			return obj[c];\n\
		});\n\
	}";
	body += ("var $s = '';");
	body += ("function $print(s){ $s += s; }");
	body += s;
	body += ("return $s;");

	var f = Function('root', body);
	return f;
}
function codegen_js_tofn(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="Function" />
	var s = codegen_js_tran(prog);
	var f = codegen_js_wrap(s);
	return f;
}
