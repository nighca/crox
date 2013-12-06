/**
 * @preserve Crox v1.1.0
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * Date: Fri, 6 Dec 2013 09:13:24 UTC
 */
define("crox",function(){var Crox = (function() {
function Class(base, constructor, methods) {
	/// <param name="base" type="Function"></param>
	/// <param name="constructor" type="Function"></param>
	/// <param name="prototype" type="Object" optional="true"></param>
	function f() { }
	f.prototype = base.prototype;
	var t = new f;
	if (methods) {
		for (var i in methods)
			t[i] = methods[i];
	}
	if (!constructor)
		constructor = f;
	constructor.prototype = t;
	return constructor;
}

function Position(row, col) {
	this.row = row;
	this.col = col;
}
Position.prototype.toString = function() {
	return '(' + this.row + ',' + this.col + ')';
};

function getPos(s, index) {
	/// <summary>取得字符串中某个位置所在的行列</summary>
	/// <param name="s" type="String"></param>
	/// <param name="index" type="Number"></param>
	var t = s.substring(0, index);
	var re_nl = /\r\n?|\n/g;
	var m = t.match(re_nl);
	var row = 1;
	if (m) {
		row += m.length;
	}
	var col = 1 + /[^\r\n]*$/.exec(t)[0].length;
	return new Position(row, col);
}

function Enum(arr) {
	/// <param name="arr" type="Array"></param>
	var obj = {};
	for (var i = 0; i < arr.length; ++i)
		obj[arr[i]] = arr[i];
	return obj;
}

function inArr(a, t) {
	/// <param name="a" type="Array"></param>
	for (var i = 0; i < a.length; ++i)
		if (a[i] == t)
			return i;
	return -1;
}
function inArr_strict(a, t) {
	/// <param name="a" type="Array"></param>
	for (var i = 0; i < a.length; ++i)
		if (a[i] === t)
			return i;
	return -1;
}
function nodup(a, eq) {
	/// <param name="a" type="Array"></param>
	/// <param name="eq" type="Function" optional="true">比较函数</param>
	if (!eq) eq = function(a, b) { return a === b; };
	var b = [];
	var n = a.length;
	for (var i = 0; i < n; i++) {
		for (var j = i + 1; j < n; j++)
			if (eq(a[i], a[j]))
				j = ++i;
		b.push(a[i]);
	}
	return b;
}
function htmlEncode(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return String(s).replace(/[&<>"]/g, function(a) {
		switch (a) {
			case '&': return '&amp;';
			case '<': return '&lt;';
			case '>': return '&gt;';
			default: return '&quot;';
		}
	});
}
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
function phpQuote(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return "'" + String(s).replace(/['\\]/g, '\\$&') + "'";
}

/// <reference path="common.js"/>
function createLexer(g) {

	function Token(tag, text, index, subMatches) {
		this.tag = tag;
		this.text = text;
		this.index = index;
		this.subMatches = subMatches;
	}
	Token.prototype.toString = function() {
		return this.text;
	};
	function emptyFunc() { }
	function buildScanner(a) {
		var n = 1;
		var b = [];
		var matchIndexes = [1];
		var fa = [];
		for (var i = 0; i < a.length; ++i) {
			matchIndexes.push(n += RegExp('|' + a[i][0].source).exec('').length);
			fa.push(a[i][1] || emptyFunc);
			b.push('(' + a[i][0].source + ')');
		}

		var re = RegExp(b.join('|') + '|', 'g');
		return [re, matchIndexes, fa];
	}

	var endTag = g.$ || '$';
	var scanner = {};
	for (var i in g) {
		if (i.charAt(0) != '$')
			scanner[i] = buildScanner(g[i]);
	}

	return Lexer;
	function Lexer(s) {
		/// <param name="s" type="String"></param>
		var Length = s.length;
		var i = 0;
		var stateStack = [''];

		var obj = {
			text: '',
			index: 0,
			source: s,
			pushState: function(s) {
				stateStack.push(s);
			},
			popState: function() {
				stateStack.pop();
			},
			retract: function(n) {
				i -= n;
			}
		};

		function scan() {
			var st = stateStack[stateStack.length - 1];
			var rule = scanner[st];
			var re = rule[0];
			re.lastIndex = i;
			var t = re.exec(s);
			if (t[0] == '') {
				if (i < Length) {
					throw Error('lexer error: ' + getPos(s, i) +
						'\n' + s.slice(i, i + 50));
				}
				return new Token(endTag, '', i);
			}
			obj.index = i;
			i = re.lastIndex;
			var idx = rule[1];
			for (var j = 0; j < idx.length; ++j)
				if (t[idx[j]]) {
					var tag = rule[2][j].apply(obj, t.slice(idx[j], idx[j + 1]));
					return new Token(tag, t[0], obj.index, t.slice(idx[j] + 1, idx[j + 1]));
				}
		}

		return {
			scan: function() {
				do {
					var t = scan();
				} while (t.tag == null);
				return t;
			},
			getPos: function(i) {
				return getPos(s, i);
			},
			reset: function() {
				i = 0;
				stateStack = [''];
			}
		};
	}
}

/// <reference path="createLexer.js"/>
var Lexer = function() {
	var re_id = /[A-Za-z_]\w*/;
	var re_str = /"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*'/;
	var re_num = /\d+(?:\.\d+)?(?:e-?\d+)?/;

	function isReserved(s) {
		return " abstract boolean break byte case catch char class const continue debugger default delete do double else enum export extends final finally float for function goto if implements import in instanceof int interface let long native new package private protected public return short static super switch synchronized this throw throws transient try typeof var void volatile while with yield ".indexOf(' ' + s + ' ') != -1;
	}
	var code = [
		[/\s+/, function() { return 'ws'; }],
		[re_id, function(a) {
			switch (a) {
				case 'true':
				case 'false':
					return 'boolean';
				case 'set':
					//case 'include':
					//case 'this':
					return a;
				default:
					if (isReserved(a) || a == 'null') throw Error("Reserved: " + a + ' ' + getPos(this.source, this.index));
					return 'realId';
			}
		}],
		[re_str, function(a) {
			return 'string';
		}],
		[re_num, function(a) {
			return 'number';
		}],
		[function(a) {
			a.sort().reverse();
			for (var i = 0; i < a.length; ++i)
				a[i] = a[i].replace(/[()*+?.[\]|]/g, '\\$&');
			return RegExp(a.join('|'));
		}(["!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "||", "===", "!=="]), function(a) {
			switch (a) {
				case '===': return 'eq';
				case '!==': return 'ne';
				default:
					return a;
			}
		}]
	];

	var Lexer = createLexer({
		'': [
			[/(?:(?!{{)[\s\S])+/, function(a) {
				if (a.substring(0, 2) == '{{') {
					this.pushState(a);
					return a;
				}
				return 'text';
			}],
			[/{{{/, function(a) {
				this.pushState(a);
				return a;
			}],
			// {{/if}} {{else}} {{/each}}
			[/{{(?:\/if|else|\/each)}}/, function(a) {
				return a;
			}],
			// {{ {{#if {{#each
			[/{{(?:#(?:if|each)(?=\s))?/, function(a) {
				this.pushState('{{');
				return a;
			}]
		],
		'{{': code.concat([
			[/}}/, function(a) {
				this.popState();
				return a;
			}]
		]),
		'{{{': code.concat([
			[/}}}/, function(a) {
				this.popState();
				return a;
			}]
		])
	});
	return Lexer;
}();

/* state num: 88 */
var parse = function() {
	function $f0($1, $2, $3, $4, $5, $6, $7) {
		var $$; $$ = ['each', $2, $6, $4 && eval($4.text), eval($3.text)];
		return $$;
	}
	function $f1($1) {
		var $$; $$ = ['lit', eval($1.text)]; return $$;
	}
	function $f2($1, $2, $3) {
		var $$; $$ = [$2.text, $1, $3]; return $$;
	}
	var nBegin = 36;
	var tSymbols = ["$", "!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "boolean", "eq", "ne", "number", "realId", "set", "string", "text", "{{", "{{#each", "{{#if", "{{/each}}", "{{/if}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "epsilon", "expr", "id", "program", "statement", "statements"];
	var tSymbolIndex = {};
	for (var i = 0; i < tSymbols.length; ++i)
		tSymbolIndex[tSymbols[i]] = i;
	var tAction = [{ _: -2 }, { _: -32768 }, { 25: 3, 26: 4, 27: 5, 28: 6, 32: 7, _: -1 }, { _: -11 }, { 1: 9, 4: 10, 8: 11, 18: 12, 21: 13, 22: 14, 23: 15, 24: 16, _: 0 }, { 1: 9, 4: 10, 8: 11, 18: 12, 21: 13, 22: 14, 23: 28, 24: 16, _: 0 }, { _: -3 }, { _: -16 }, { _: -15 }, { _: -12 }, { 22: 14, 23: 28, _: -13 }, { _: -14 }, { 7: 36, 8: 37, _: -32 }, { 19: 38, 20: 39, _: -40 }, { 3: 40, _: -42 }, { 33: 41, _: -44 }, { 9: 42, 16: 43, _: -22 }, { 2: 44, 6: 45, 10: 46, _: -29 }, { _: -19 }, { 11: 47, 12: 48, 14: 49, 15: 50, _: -37 }, { _: -25 }, { 34: 51, _: 0 }, { _: -17 }, { _: -13 }, { 24: 52, _: 0 }, { 34: 53, _: 0 }, { 35: 54, _: 0 }, { _: -23 }, { 5: 55, _: 0 }, { _: -24 }, { 13: 56, _: 0 }, { 22: 14, 23: 28, _: 0 }, { _: -9 }, { 24: 72, _: -45 }, { _: -10 }, { _: -18 }, { 2: 44, 6: 45, 10: 46, _: -30 }, { 2: 44, 6: 45, 10: 46, _: -31 }, { 11: 47, 12: 48, 14: 49, 15: 50, _: -38 }, { 11: 47, 12: 48, 14: 49, 15: 50, _: -39 }, { 19: 38, 20: 39, _: -41 }, { 3: 40, _: -43 }, { _: -20 }, { 17: 76, _: 0 }, { _: -28 }, { _: -26 }, { _: -27 }, { 7: 36, 8: 37, _: -33 }, { 7: 36, 8: 37, _: -35 }, { 7: 36, 8: 37, _: -34 }, { 7: 36, 8: 37, _: -36 }, { 34: 77, _: 0 }, { 34: 78, _: 0 }, { 25: 3, 26: 4, 27: 5, 28: 6, 30: 79, 31: 80, 32: 7, _: 0 }, { 34: 81, _: 0 }, { _: -21 }, { _: -4 }, { _: -8 }, { 25: 3, 26: 4, 27: 5, 28: 6, 29: 85, 32: 7, _: 0 }, { 25: 3, 26: 4, 27: 5, 28: 6, 29: 86, 32: 7, _: 0 }, { 25: 3, 26: 4, 27: 5, 28: 6, 30: 87, 32: 7, _: 0 }, { _: -7 }, { _: -6 }, { _: -5 }];
	var actionIndex = [0, 1, 2, 3, 4, 5, 5, 5, 6, 5, 5, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 5, 5, 5, 5, 5, 5, 31, 5, 5, 5, 5, 5, 5, 5, 5, 32, 33, 0, 34, 35, 5, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 0, 0, 56, 0, 57, 58, 59, 60, 61, 62, 63];
	var tGoto = [{ 12: 1, 14: 2 }, , { 13: 8 }, , { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 26, 11: 27 }, { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 29, 11: 27 }, { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 30, 11: 27 }, { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 31, 11: 27 }, , { 4: 21, 6: 23, 8: 32, 11: 27 }, { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 33, 11: 27 }, { 4: 21, 6: 23, 8: 34, 11: 27 }, , , , { 11: 35 }, , , , , , , , , , , , , , , , , , , , , { 4: 21, 5: 57, 6: 23, 8: 25, 11: 27 }, { 4: 21, 5: 58, 6: 23, 8: 25, 11: 27 }, { 0: 17, 4: 21, 5: 22, 6: 23, 7: 59, 8: 25, 11: 27 }, { 0: 17, 4: 21, 5: 22, 6: 23, 7: 60, 8: 25, 11: 27 }, { 0: 17, 1: 61, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 11: 27 }, { 0: 17, 1: 18, 2: 62, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 11: 27 }, { 11: 63 }, { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 64, 11: 27 }, { 4: 21, 6: 23, 8: 65, 11: 27 }, { 4: 21, 6: 23, 8: 66, 11: 27 }, { 4: 21, 6: 23, 8: 67, 11: 27 }, { 0: 68, 4: 21, 5: 22, 6: 23, 8: 25, 11: 27 }, { 0: 69, 4: 21, 5: 22, 6: 23, 8: 25, 11: 27 }, { 0: 70, 4: 21, 5: 22, 6: 23, 8: 25, 11: 27 }, { 0: 71, 4: 21, 5: 22, 6: 23, 8: 25, 11: 27 }, , { 9: 73 }, { 14: 74 }, , , { 0: 17, 1: 18, 2: 19, 3: 20, 4: 21, 5: 22, 6: 23, 7: 24, 8: 25, 10: 75, 11: 27 }, , , , , , , , , , , , , , , , , , { 13: 8 }, , , { 14: 82 }, { 14: 83 }, , { 14: 84 }, , { 13: 8 }, { 13: 8 }, { 13: 8 }];
	var tRules = [[51, 48], [48, 50], [50], [50, 50, 49], [49, 28, 46, 34, 50, 30], [49, 28, 46, 34, 50, 31, 50, 30], [49, 27, 46, 24, 45, 34, 50, 29], [49, 27, 46, 24, 24, 34, 50, 29], [49, 26, 23, 47, 13, 46, 34], [49, 26, 46, 34], [49, 32, 46, 35], [49, 25], [47, 22], [47, 23], [42, 24], [42, 21], [42, 18], [42, 47], [42, 4, 46, 5], [40, 42], [40, 40, 9, 47], [40, 40, 16, 46, 17], [44, 40], [44, 1, 44], [44, 8, 44], [41, 44], [41, 41, 6, 44], [41, 41, 10, 44], [41, 41, 2, 44], [36, 41], [36, 36, 7, 41], [36, 36, 8, 41], [43, 36], [43, 43, 11, 36], [43, 43, 14, 36], [43, 43, 12, 36], [43, 43, 15, 36], [37, 43], [37, 37, 19, 43], [37, 37, 20, 43], [38, 37], [38, 38, 3, 37], [39, 38], [39, 39, 33, 38], [46, 39], [45]];
	var tFuncs = [, function($1) {
		var $$; $$ = ['prog', $1]; return $$;
	}, function() {
		var $$; $$ = []; return $$;
	}, function($1, $2) {
		var $$; $1.push($2); $$ = $1; return $$;
	}, function($1, $2, $3, $4, $5) {
		var $$; $$ = ['if', $2, $4]; return $$;
	}, function($1, $2, $3, $4, $5, $6, $7) {
		var $$; $$ = ['if', $2, $4, $6]; return $$;
	}, $f0, $f0, function($1, $2, $3, $4, $5, $6) {
		var $$; $$ = ['set', $3.text, $5]; return $$;
	}, function($1, $2, $3) {
		var $$; $$ = ['eval', $2, true]; return $$;
	}, function($1, $2, $3) {
		var $$; $$ = ['eval', $2, false]; return $$;
	}, function($1) {
		var $$; $$ = ['text', $1.text]; return $$;
	}, , , $f1, $f1, function($1) {
		var $$; $$ = ['lit', $1.text == 'true']; return $$;
	}, function($1) {
		var $$; $$ = ['id', $1.text]; return $$;
	}, function($1, $2, $3) {
		var $$; $$ = $2; return $$;
	}, , function($1, $2, $3) {
		var $$; $$ = ['.', $1, $3.text]; return $$;
	}, function($1, $2, $3, $4) {
		var $$; $$ = ['[]', $1, $3]; return $$;
	}, , function($1, $2) {
		var $$; $$ = ['!', $2]; return $$;
	}, function($1, $2) {
		var $$; $$ = ['u-', $2]; return $$;
	}, , $f2, $f2, $f2, , $f2, $f2, , $f2, $f2, $f2, $f2, , function($1, $2, $3) {
		var $$; $$ = ['eq', $1, $3]; return $$;
	}, function($1, $2, $3) {
		var $$; $$ = ['ne', $1, $3]; return $$;
	}, , $f2, , $f2];
	function getAction(x, y) {
		var list = tAction[actionIndex[x]];
		return list[y] || list._;
	}
	return function(lexer, others) {
		function getToken() {
			var t = lexer.scan();
			if (t.tag == 'ws') t = lexer.scan();
			return t;
		}

		var s = 0;
		var stateStack = [0];
		var a = getToken();
		var valueStack = [];
		var obj = {
			get: function(i) {
				return valueStack[valueStack.length + i];
			},
			set: function(i, v) {
				valueStack[valueStack.length + i] = v;
			}
		};
		if (others) for (var i in others)
			obj[i] = others[i];

		while (1) {
			var t = getAction(s, tSymbolIndex[a.tag]);
			if (!t) err();
			else if (t > 0) {
				stateStack.push(s = t);
				valueStack.push(a);
				a = getToken();
			}
			else if (t < 0 && t > -32768) {
				var idx = -t;
				var p = tRules[idx];
				var num = p.length - 1;
				stateStack.length -= num;
				s = tGoto[stateStack[stateStack.length - 1]][p[0] - nBegin];
				stateStack.push(s);

				if (tFuncs[idx]) {
					var val = tFuncs[idx].apply(obj, valueStack.splice(valueStack.length - num, num));
					valueStack.push(val);
				}
				else if (num != 1) {
					valueStack.splice(valueStack.length - num, num, null);
				}
			}
			else {
				if (a.tag != tSymbols[0]) err();
				return valueStack[0];
			}
		}
		function err() {
			throw Error("Syntax error: " + lexer.getPos(a.index));
		}
	};
}();


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

/// <reference path="codegen_js.js"/>
function compile2jsfn(s) {
	return codegen_js_tofn(parse(Lexer(s)));
}
var Crox = {
	compile: function(s) {
		return compile2jsfn(s);
	},
	compileToStr: function(s) {
		return codegen_js_tran(parse(Lexer(s)));
	},
	render: function(s, data) {
		return compile2jsfn(s)(data);
	}
};

Crox.version = "1.1.0";return Crox;})();return Crox;});