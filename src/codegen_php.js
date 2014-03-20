/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_php_tran(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="String" />

	function emit(t) {
		s += t;
	}
	function compileEval(stmt) {
		var t = walkExpr(stmt[1]);
		emit('crox_echo(' + t + ', ' + !!stmt[2] + ');');
	}
	function compileContent(stmt) {
		var t = stmt[1];
		if (/<\?(?:php)?|\?>/.test(t))
			emit('echo ' + phpQuote(stmt[1]) + ';');
		else {
			emit('?>' + t + '<?php ');
		}
	}
	function compileIf(stmt) {
		emit('if(' + walkExpr(stmt[1]) + '){');
		compileStmts(stmt[2]);
		emit('}');
		if (stmt[3]) {
			emit('else{');
			compileStmts(stmt[3]);
			emit('}');
		}
	}
	function compileEach(stmt) {
		var idKey = stmt[3] ? '$crox_' + stmt[3] + '=>' : '';
		emit('foreach(' + walkExpr(stmt[1]) + ' as ' + idKey + '$crox_' + stmt[4] + ')');
		emit('{');
		compileStmts(stmt[2]);
		emit('}');
	}
	function compileSet(stmt) {
		emit('$crox_' + stmt[1] + ' = ' + walkExpr(stmt[2]) + ';');
	}
	function compileStmt(a) {
		switch (a[0]) {
			case 'if': compileIf(a); break;
			case 'each': compileEach(a); break;
			case 'set': compileSet(a); break;
			case 'eval': compileEval(a); break;
			case 'text': compileContent(a); break;
			case 'inc':
				emit("include '" + changeExt(a[1], 'php') + "';");
				break;
			default: throw Error('unknown stmt: ' + a[0]);
		}
	}
	function compileStmts(a) {
		for (var i = 0; i < a.length; ++i)
			compileStmt(a[i]);
	}

	function exprToStr(x, check) {
		var t = walkExpr(x);
		if (check && !check(x[0])) t = '(' + t + ')';
		return t;
	}
	function walkExpr(x) {
		switch (x[0]) {
			case 'id':
				return '$crox_' + x[1];
			case 'lit':
				if (typeof x[1] == 'string')
					return phpQuote(x[1]);
				return String(x[1]);
			case '.':
				return exprToStr(x[1], isMember) + "->" + x[2];
			case '[]':
				return exprToStr(x[1], isMember) + '[' + walkExpr(x[2]) + ']';
			case '!':
				return '!crox_ToBoolean(' + exprToStr(x[1], isUnary) + ')';
			case 'u-':
				return '- ' + exprToStr(x[1], isUnary);
			case '*': case '/': case '%':
				return exprToStr(x[1], isMul) + x[0] + exprToStr(x[2], isUnary);
			case '+':
				return 'crox_plus(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			case '-':
				return exprToStr(x[1], isAdd) + '- ' + exprToStr(x[2], isMul);
			case '<': case '>': case '<=': case '>=':
				return exprToStr(x[1], isRel) + x[0] + exprToStr(x[2], isAdd);
			case '==':
			case '!=':
			case '===':
			case '!==':
				return exprToStr(x[1], isEquality) + x[0] + exprToStr(x[2], isRel);
			case '&&':
				return 'crox_logical_and(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			case '||':
				return 'crox_logical_or(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			default:
				throw Error("unknown expr: " + x[0]);
		}
	}

	var s = "";
	compileStmts(prog[1]);
	if (s.slice(0, 2) == '?>')
		s = s.slice(2);
	else s = '<?php ' + s;
	if (s.slice(-6) == '<?php ')
		s = s.slice(0, -6);
	else s += '?>';
	return s;
}
