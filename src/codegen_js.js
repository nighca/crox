/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_js_tran(prog, encodeName, defaultEncode) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="encodeName" type="String"></param>
	/// <param name="defaultEncode" type="Boolean"></param>
	/// <returns type="String" />

	var i_tmake = 0;
	function TMake() {
		return '_' + (i_tmake++);
	}

	function emit(s) {
		body += s;
	}

	function stmtGen(a) {
		switch (a[0]) {
			case 'if':
				emit('if(' + exprGen(a[1]) + '){');
				stmtsGen(a[2]);
				emit('}');
				if (a[3]) {
					emit('else{');
					stmtsGen(a[3]);
					emit('}');
				}
				break;
			case 'each':
				var keyName = a[3] ? encodeCommonName(a[3]) : TMake();
				var sExpr = exprGen(a[1]);
				if (/^\w+$/.test(sExpr)) {
					var listName = sExpr;
				}
				else {
					listName = TMake();
					emit('var ' + listName + ' = ' + sExpr + ';');
				}
				if (a[5]) emit('for(var ' + keyName + '=0;' + keyName + '<' + listName + '.length;' + keyName + '++){');
				else emit('for(var ' + keyName + ' in ' + listName + ') {');
				emit('var ' + a[4] + ' = ' + listName + '[' + keyName + '];');
				stmtsGen(a[2]);
				emit('}');
				break;
			case 'set':
				emit('var ' + encodeCommonName(a[1]) + '=' + exprGen(a[2]) + ';');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (/^\w+$/.test(s))
					var tName = s;
				else {
					tName = '_t';
					emit('_t = ' + s + ';');
				}
				emit('if(' + tName + ' !=null)_s += ' + ((defaultEncode ? !a[2] : a[2]) ? encodeName + '(' + tName + ')' : tName) + ';');
				break;
			case 'text':
				emit('_s += ' + quote(a[1]) + ';');
				break;
			case 'inc':
				//stmtsGen(a[2][1]);
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
				return encodeCommonName(x[1]);
			case 'lit':
				if (typeof x[1] == 'string')
					return quote(x[1]);
				return String(x[1]);
			case '.':
				return exprToStr(x[1], isMember) + '.' + x[2];
			case '[]':
				return exprToStr(x[1], isMember) + '[' + exprGen(x[2]) + ']';
			case '()':
				var a = [];
				if (x[2])
					for (var i = 0; i < x[2].length; ++i)
						a.push(exprGen(x[2][i]));
				return exprToStr(x[1], isMember) + '(' + a.join(',') + ')';
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
			case '==':
			case '!=':
			case '===':
			case '!==':
				return exprToStr(x[1], isEquality) + x[0] + exprToStr(x[2], isRel);
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
