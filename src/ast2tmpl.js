function ast2tmpl(ast) {
	function quote(s) {
		/// <param name="s" type="String"></param>
		/// <returns type="String" />
		return '"' + (s).replace(/[\x00-\x1f"\\\u2028\u2029]/g, function(a) {
			switch (a) {
				case '"': return '\\"';
				case '\\': return '\\\\';
				case '\b': return '\\b';
				case '\f': return '\\f';
				case '\n': return '\\n';
				case '\r': return '\\r';
				case '\t': return '\\t';
			}
			return '\\u' + ('000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"';
	}

	function isAtom(op) {
		switch (op) {
			case 'id':
			case 'lit':
				return true;
		}
		return false;
	}
	function isMember(op) {
		return isAtom(op) || op == '.' || op == '[]';
	}

	function isUnary(op) {
		return isMember(op) || op == '!' || op == 'u-';
	}
	function isMul(op) {
		if (isUnary(op)) return true;
		switch (op) {
			case '*': case '/': case '%':
				return true;
		}
		return false;
	}
	function isAdd(op) {
		if (isMul(op)) return true;
		switch (op) {
			case '+': case '-':
				return true;
		}
		return false;
	}
	function isRel(op) {
		if (isAdd(op)) return true;
		switch (op) {
			case '<': case '>': case '<=': case '>=':
				return true;
		}
		return false;
	}
	function isEquality(op) {
		if (isRel(op)) return true;
		switch (op) {
			case 'eq': case 'ne':
				return true;
		}
		return false;
	}
	function isLogicalAnd(op) {
		return isEquality(op) || op == '&&';
	}
	function isLogicalOr(op) {
		return isLogicalAnd(op) || op == '||';
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

	var expr = exprToStr;
	function stmt(a) {
		switch (a[0]) {
			case 'if':
				return '{{#if ' + expr(a[1]) + '}}' + stmts(a[2]) + (a[3] ? '{{else}}' + stmts(a[3]) : '') + '{{/if}}';
			case 'each':
				var t = a[5] ? 'each' : 'forin';
				return '{{#' + t + ' ' + expr(a[1]) + ' ' + a[4] + (a[3] ? ' ' + a[3] : '') + '}}'
				+ stmts(a[2]) + '{{/' + t + '}}';
			case 'set':
				return '{{set ' + a[1] + '=' + expr(a[2]) + '}}';
			case 'eval':
				var t = '{{' + expr(a[1]) + '}}';
				return a[2] ? '{' + t + '}' : t;
			case 'text':
				return a[1].replace(/(?:{{|}})[{}]+/g, '{{"$&"}}');
			case 'inc':
				return '{{include ' + quote(a[1]) + '}}';
			default:
				throw Error("unknown stmt: " + a[0]);
		}
	}
	function stmts(a) {
		var s = '';
		for (var i = 0; i < a.length; ++i)
			s += stmt(a[i]);
		return s;
	}
	return stmts(ast[1]);
}
