/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_php_tran(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="String" />
	var s_indent = '';

	function indent() {
		s_indent += '  ';
	}
	function outdent() {
		s_indent = s_indent.substr(0, s_indent.length - 2);
	}

	function emit(s) {
		s_output += s_indent + s + '\n';
	}
	function compileEval(stmt) {
		var t = 'ToString(' + walkExpr(stmt[1]) + ')';
		if (stmt[2]) {
			t = 'htmlspecialchars(' + t + ", ENT_COMPAT, 'GB2312')";
		}
		emit('$t_r .= ' + t + ';');
	}
	function compileContent(stmt) {
		emit('$t_r .= ' + phpQuote(stmt[1]) + ';');
	}
	function compileIf(stmt) {
		emit('if(' + walkExpr(stmt[1]) + '){');
		indent();
		compileStmts(stmt[2]);
		outdent();
		emit('}');
		if (stmt[3]) {
			emit('else{');
			indent();
			compileStmts(stmt[3]);
			outdent();
			emit('}');
		}
	}
	function compileEach(stmt) {
		var idKey = stmt[3] ? '$i_' + stmt[3] + '=>' : '';
		emit('foreach(' + walkExpr(stmt[1]) + ' as ' + idKey + '$i_' + stmt[4] + ')');
		emit('{');
		indent();
		compileStmts(stmt[2]);
		outdent();
		emit('}');
	}
	function compileSet(stmt) {
		emit('$i_' + stmt[1] + ' = ' + walkExpr(stmt[2]) + ';');
	}
	function compileStmt(a) {
		switch (a[0]) {
			case 'if': compileIf(a); break;
			case 'each': compileEach(a); break;
			case 'set': compileSet(a); break;
			case 'eval': compileEval(a); break;
			case 'text': compileContent(a); break;
			case 'inc':
				//emit("include '" + a[1] + "';");
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
				return '$i_' + x[1];
			case 'lit':
				if (typeof x[1] == 'string')
					return phpQuote(x[1]);
				return String(x[1]);
			case '.':
				return exprToStr(x[1], isMember) + "->" + x[2];
			case '[]':
				return exprToStr(x[1], isMember) + '[' + walkExpr(x[2]) + ']';
			case '!':
				return '!ToBoolean(' + exprToStr(x[1], isUnary) + ')';
			case 'u-':
				return '- ' + exprToStr(x[1], isUnary);
			case '*': case '/': case '%':
				return exprToStr(x[1], isMul) + x[0] + exprToStr(x[2], isUnary);
			case '+':
				return 'plus(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			case '-':
				return exprToStr(x[1], isAdd) + '- ' + exprToStr(x[2], isMul);
			case '<': case '>': case '<=': case '>=':
				return exprToStr(x[1], isRel) + x[0] + exprToStr(x[2], isAdd);
			case 'eq': case 'ne':
				var op = x[0] == 'eq' ? '===' : '!==';
				return exprToStr(x[1], isEquality) + op + exprToStr(x[2], isRel);
			case '&&':
				return 'logical_and(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			case '||':
				return 'logical_or(' + exprToStr(x[1], null) + ', ' + exprToStr(x[2], null) + ')';
			default:
				throw Error("unknown expr: " + x[0]);
		}
	}

	var s_output = "$t_r = '';\n";
	compileStmts(prog[1]);

	return s_output;
}
function codegen_php_wrap(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	var s_output = "function temp($i_root) {\n";
	s_output += 'function isNumber($a) { return is_float($a) || is_int($a); }\n';
	s_output += 'function plus($a, $b) {\
if (isNumber($a) && isNumber($b)) {\
	return $a + $b;\
}\
else {\
	return ToString($a) . ToString($b);\
}\
}\n';
	s_output += 'function logical_and($a, $b) { return $a ? $b : $a; }\n';
	s_output += 'function logical_or($a, $b) { return $a ? $a : $b; }\n';
	s_output += "function ToString($a) {\n\
	if (is_string($a)) return $a;\n\
	if (isNumber($a)) return (string)$a;\n\
	if (is_bool($a)) return $a ? 'true' : 'false';\n\
	if (is_null($a)) return 'null';\n\
	if (is_array($a)) {\n\
		$s = '';\n\
		for ($i = 0; $i < count($a); ++$i) {\n\
			if ($i > 0) $s .= ',';\n\
			if (!is_null($a[$i]))\n\
				$s .= ToString($a[$i]);\n\
		}\n\
		return $s;\n\
	}\n\
	return '[object Object]';\n\
}\n";
	s_output += 'function ToBoolean($a) {\n\
	if (is_string($a)) return strlen($a) > 0;\n\
	if (is_array($a) || is_object($a)) return true;\n\
	return (bool)$a;\n\
}\n';
	s_output += s;
	s_output += 'return $t_r;\n}';
	return s_output;
}
