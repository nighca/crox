/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_vm_tran(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="String" />

	//用户变量名 都奇数个下划线开头，临时变量都不下划线开头
	function encodeId(s) {
		return '$crox_' + encodeCommonName(s);
	}
	function isName(s) {
		return /^$\w+$/.test(s);
	}
	function emit(s) {
		body += s;
	}
	var i_each = 0;
	function stmtGen(a) {
		switch (a[0]) {
			case 'if':
				emit('#if(' + exprGen(a[1]) + ')');
				stmtsGen(a[2]);
				if (a[3]) {
					emit('#{else}');
					stmtsGen(a[3]);
				}
				emit('#{end}');
				break;
			case 'each':
				++i_each;
				var sExpr = exprGen(a[1]);
				if (isName(sExpr))
					var listName = sExpr;
				else {
					listName = '$list' + (i_each == 1 ? '' : i_each);
					emit('#set (' + listName + ' = ' + sExpr + ')');
				}
				if (a[5]) { //array
					emit('#foreach(' + encodeId(a[4]) + ' in ' + listName + ')');
					if (a[3]) {
						emit('#set(' + encodeId(a[3]) + ' = $velocityCount - 1)');
					}
				}
				else { //object
					if (a[3]) {
						emit('#foreach(' + encodeId(a[3]) + ' in ' + listName + '.keySet())');
						emit('#set(' + encodeId(a[4]) + ' =' + listName + '.get(' + encodeId(a[3]) + '))');
					}
					else {
						emit('#foreach(' + encodeId(a[4]) + ' in ' + listName + ')');
					}
				}
				stmtsGen(a[2]);
				emit('#{end}');
				--i_each;
				break;
			case 'set':
				emit('#set (' + encodeId(a[1]) + '=' + exprGen(a[2]) + ')');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (isName(s))
					emit('$!{' + s.slice(1) + '}');
				else {
					emit('#set($t = ' + s + ')$!{t}');
				}
				break;
			case 'text':
				emit(a[1].replace(/\$/g, '$${dollar}').replace(/#/g, '$${sharp}'));
				break;
			case 'inc':
				emit("#parse('" + changeExt(a[1], 'vm') + "')");
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
				return encodeId(x[1]);
			case 'lit':
				if (typeof x[1] == 'string')
					return vmQuote(x[1]);
				return String(x[1]);
			case '.':
				return exprToStr(x[1], isMember) + '.' + x[2];
			case '[]':
				return exprToStr(x[1], isMember) + '[' + exprGen(x[2]) + ']';
			case '!':
				return '!' + exprToStr(x[1], isUnary);
			case 'u-':
				if (x[1][0] == 'u-') throw Error("禁止两个负号连用");
				return '-' + exprToStr(x[1], isUnary);
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
				return exprToStr(x[1], isEquality) + x[0].slice(0, 2) + exprToStr(x[2], isRel);
			case '&&':
				return exprToStr(x[1], isLogicalAnd) + '&&' + exprToStr(x[2], isEquality);
			case '||':
				return exprToStr(x[1], isLogicalOr) + '||' + exprToStr(x[2], isLogicalAnd);
			default:
				throw Error("unknown expr: " + x[0]);
		}
	}
	function vmQuote(s) {
		/// <param name="s" type="String"></param>
		if (s.indexOf("'") == -1) return "'" + s + "'";
		var a = s.split("'");
		return "('" + a.join("'+\"'\"+'") + "')";
	}
	var body = "#set($dollar='$')#set($sharp='#')";
	stmtsGen(prog[1]);

	return body;
}
