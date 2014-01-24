/**
 * @preserve Crox v1.2.0
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 89e5af74562f9ef3d52ba371ccd62bee
 */
(function(root) {var Crox = (function() {
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
function singleQuote(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return "'" + (s).replace(/[\x00-\x1f'\\\u2028\u2029]/g, function(a) {
		switch (a) {
			case "'": return "\\'";
			case '\\': return '\\\\';
			case '\b': return '\\b';
			case '\f': return '\\f';
			case '\n': return '\\n';
			case '\r': return '\\r';
			case '\t': return '\\t';
		}
		return '\\u' + ('000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + "'";
}
function phpQuote(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return "'" + String(s).replace(/['\\]/g, '\\$&') + "'";
}

function formatPath(s) {
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	s = s.replace(/\\/g, '/');
	s = s.replace(/\/\/+/g, '/');
	if (s.indexOf('/') == -1)
		return s;
	else {
		var a = s.split('/');
		var b = [];
		for (var i = 0; i < a.length; ++i) {
			if (a[i].indexOf('..') != -1) {
				b.pop();
			}
			else if (a[i] != '.') {
				b.push(a[i]);
			}
		}
		return b.join('/');
	}
}
function buildPath(currentPath, path) {
	/// <param name="currentPath" type="String"></param>
	/// <param name="path" type="String"></param>
	/// <returns type="String" />
	if (path.charAt(0) != '/' && path.charAt(0) != '\\') {
		path = currentPath.replace(/[^/\\]+$/, '') + path;
	}
	return formatPath(path);
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
		[/\s+/, function() { return null; }],
		[re_id, function(a) {
			switch (a) {
				case 'true':
				case 'false':
					return 'boolean';
				case 'set':
				case 'include':
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

var parse = function() {
	var table = {/* state num: 92 */
		nStart: 37,
		tSymbols: ["$", "!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "boolean", "eq", "include", "ne", "number", "realId", "set", "string", "text", "{{", "{{#each", "{{#if", "{{/each}}", "{{/if}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "epsilon", "expr", "id", "program", "statement", "statements"],
		tSymbolIndex: { "$": 0, "!": 1, "%": 2, "&&": 3, "(": 4, ")": 5, "*": 6, "+": 7, "-": 8, ".": 9, "/": 10, "<": 11, "<=": 12, "=": 13, ">": 14, ">=": 15, "[": 16, "]": 17, "boolean": 18, "eq": 19, "include": 20, "ne": 21, "number": 22, "realId": 23, "set": 24, "string": 25, "text": 26, "{{": 27, "{{#each": 28, "{{#if": 29, "{{/each}}": 30, "{{/if}}": 31, "{{else}}": 32, "{{{": 33, "||": 34, "}}": 35, "}}}": 36, "AdditiveExpression": 37, "EqualityExpression": 38, "LogicalAndExpression": 39, "LogicalOrExpression": 40, "MemberExpression": 41, "MultiplicativeExpression": 42, "PrimaryExpression": 43, "RelationalExpression": 44, "UnaryExpression": 45, "epsilon": 46, "expr": 47, "id": 48, "program": 49, "statement": 50, "statements": 51 },
		tAction: [{ _: -2 }, { _: -32768 }, { 26: 3, 27: 4, 28: 5, 29: 6, 33: 7, _: -1 }, { _: -11 }, { 1: 9, 4: 10, 8: 11, 18: 12, 20: 13, 22: 14, 23: 15, 24: 16, 25: 17, _: 0 }, { 1: 9, 4: 10, 8: 11, 18: 12, 20: 29, 22: 14, 23: 15, 24: 30, 25: 17, _: 0 }, { _: -3 }, { _: -18 }, { 25: 37, _: -15 }, { _: -17 }, { _: -13 }, { 20: 29, 23: 15, 24: 30, _: -14 }, { _: -16 }, { 7: 39, 8: 40, _: -34 }, { 19: 41, 21: 42, _: -42 }, { 3: 43, _: -44 }, { 34: 44, _: -46 }, { 9: 45, 16: 46, _: -24 }, { 2: 47, 6: 48, 10: 49, _: -31 }, { _: -21 }, { 11: 50, 12: 51, 14: 52, 15: 53, _: -39 }, { _: -27 }, { 35: 54, _: 0 }, { _: -19 }, { _: -15 }, { _: -14 }, { 25: 55, _: 0 }, { 35: 56, _: 0 }, { 36: 57, _: 0 }, { _: -25 }, { 5: 58, _: 0 }, { _: -26 }, { 35: 59, _: 0 }, { 13: 60, _: 0 }, { 20: 29, 23: 15, 24: 30, _: 0 }, { _: -9 }, { 25: 76, _: -47 }, { _: -10 }, { _: -20 }, { _: -12 }, { 2: 47, 6: 48, 10: 49, _: -32 }, { 2: 47, 6: 48, 10: 49, _: -33 }, { 11: 50, 12: 51, 14: 52, 15: 53, _: -40 }, { 11: 50, 12: 51, 14: 52, 15: 53, _: -41 }, { 19: 41, 21: 42, _: -43 }, { 3: 43, _: -45 }, { _: -22 }, { 17: 80, _: 0 }, { _: -30 }, { _: -28 }, { _: -29 }, { 7: 39, 8: 40, _: -35 }, { 7: 39, 8: 40, _: -37 }, { 7: 39, 8: 40, _: -36 }, { 7: 39, 8: 40, _: -38 }, { 35: 81, _: 0 }, { 35: 82, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 31: 83, 32: 84, 33: 7, _: 0 }, { 35: 85, _: 0 }, { _: -23 }, { _: -4 }, { _: -8 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 89, 33: 7, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 90, 33: 7, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 31: 91, 33: 7, _: 0 }, { _: -7 }, { _: -6 }, { _: -5 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 5, 6, 5, 5, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 5, 5, 5, 5, 5, 5, 34, 5, 5, 5, 5, 5, 5, 5, 5, 35, 36, 0, 37, 38, 39, 5, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 0, 0, 60, 0, 61, 62, 63, 64, 65, 66, 67],
		tGoto: [{ 12: 1, 14: 2 }, , { 13: 8 }, , { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 27, 11: 28 }, { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 31, 11: 28 }, { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 32, 11: 28 }, { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 33, 11: 28 }, , { 4: 22, 6: 24, 8: 34, 11: 28 }, { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 35, 11: 28 }, { 4: 22, 6: 24, 8: 36, 11: 28 }, , , , , { 11: 38 }, , , , , , , , , , , , , , , , , , , , , , , { 4: 22, 5: 61, 6: 24, 8: 26, 11: 28 }, { 4: 22, 5: 62, 6: 24, 8: 26, 11: 28 }, { 0: 18, 4: 22, 5: 23, 6: 24, 7: 63, 8: 26, 11: 28 }, { 0: 18, 4: 22, 5: 23, 6: 24, 7: 64, 8: 26, 11: 28 }, { 0: 18, 1: 65, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 11: 28 }, { 0: 18, 1: 19, 2: 66, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 11: 28 }, { 11: 67 }, { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 68, 11: 28 }, { 4: 22, 6: 24, 8: 69, 11: 28 }, { 4: 22, 6: 24, 8: 70, 11: 28 }, { 4: 22, 6: 24, 8: 71, 11: 28 }, { 0: 72, 4: 22, 5: 23, 6: 24, 8: 26, 11: 28 }, { 0: 73, 4: 22, 5: 23, 6: 24, 8: 26, 11: 28 }, { 0: 74, 4: 22, 5: 23, 6: 24, 8: 26, 11: 28 }, { 0: 75, 4: 22, 5: 23, 6: 24, 8: 26, 11: 28 }, , { 9: 77 }, { 14: 78 }, , , , { 0: 18, 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 10: 79, 11: 28 }, , , , , , , , , , , , , , , , , , { 13: 8 }, , , { 14: 86 }, { 14: 87 }, , { 14: 88 }, , { 13: 8 }, { 13: 8 }, { 13: 8 }],
		tRules: [[52, 49], [49, 51], [51], [51, 51, 50], [50, 29, 47, 35, 51, 31], [50, 29, 47, 35, 51, 32, 51, 31], [50, 28, 47, 25, 46, 35, 51, 30], [50, 28, 47, 25, 25, 35, 51, 30], [50, 27, 24, 48, 13, 47, 35], [50, 27, 47, 35], [50, 33, 47, 36], [50, 26], [50, 27, 20, 25, 35], [48, 23], [48, 24], [48, 20], [43, 25], [43, 22], [43, 18], [43, 48], [43, 4, 47, 5], [41, 43], [41, 41, 9, 48], [41, 41, 16, 47, 17], [45, 41], [45, 1, 45], [45, 8, 45], [42, 45], [42, 42, 6, 45], [42, 42, 10, 45], [42, 42, 2, 45], [37, 42], [37, 37, 7, 42], [37, 37, 8, 42], [44, 37], [44, 44, 11, 37], [44, 44, 14, 37], [44, 44, 12, 37], [44, 44, 15, 37], [38, 44], [38, 38, 19, 44], [38, 38, 21, 44], [39, 38], [39, 39, 3, 38], [40, 39], [40, 40, 34, 39], [47, 40], [46]],
		tFuncs: function() {
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
			return [, function($1) {
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
			}, function($1, $2, $3, $4) {
				var $$; $$ = ['inc', eval($3.text)]; return $$;
			}, , , , $f1, $f1, function($1) {
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
		}()
	};
	return function(a) {
		function e(a, d) { return c[a][d] } var b = a.nStart, f = a.tSymbols, d = a.tSymbolIndex, c = a.tAction, g = a.tGoto, l = a.tRules, k = a.tFuncs, p = a.actionIndex; p && (e = function(a, d) { var b = c[p[a]]; return b[d] || b._ }); return function(a, c) {
			function p(d) { throw Error("Syntax error: " + a.getPos(t.index) + (d ? "\n" + d : "")); } var v = 0, B = [0], t = a.scan(), C = [], A = { get: function(a) { return C[C.length + a] }, set: function(a, d) { C[C.length + a] = d } }; if (c) for (var x in c) A[x] =
			c[x]; for (; ;) if (x = e(v, d[t.tag])) if (0 < x) B.push(v = x), C.push(t), t = a.scan(); else if (0 > x && -32768 < x) { x = -x; var v = l[x], E = v.length - 1; B.length -= E; v = g[B[B.length - 1]][v[0] - b]; B.push(v); k[x] ? (x = k[x].apply(A, C.splice(C.length - E, E)), C.push(x)) : 1 != E && C.splice(C.length - E, E, null) } else return t.tag != f[0] && p(), C[0]; else { x = []; for (E = 0; E < b; ++E) e(v, E) && x.push(f[E]); p("find " + t.tag + "\nexpect " + x.join(" ")) }
		}
	}(table);
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
function parsetmpl(s) {
	/// <summary>解析模板，得到语法树</summary>
	/// <param name="s" type="String">模板</param>
	var ast = parse(Lexer(s));
	return ast;
}
function compile2jsfn(s) {
	/// <summary>编译模板，得到一个 js 函数</summary>
	/// <param name="s" type="String">模板</param>
	/// <returns type="Function" />
	var ast = parsetmpl(s);
	return codegen_js_tofn(ast);
}
var Crox = {
	parse: parsetmpl,
	compile: compile2jsfn,
	compileToJs: function(s) {
		/// <summary>返回编译后的 js 代码</summary>
		/// <param name="s" type="String"></param>
		/// <returns type="String" />
		return codegen_js_tran(parsetmpl(s));
	},
	render: function(s, data) {
		/// <summary>将数据 data 填充到模板 s</summary>
		/// <param name="s" type="String">模板</param>
		/// <returns type="String" />
		var fn = compile2jsfn(s);
		return fn(data);
	}
};

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

/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_vm_tran(prog, nl) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="nl" type="String" optional="true"></param>
	/// <returns type="String" />

	if (!nl) nl = '\r\n';
	function emit(s) {
		body += s;
	}
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
				var k = a[3] ? '$_' + a[3] : '$k';
				emit('#set ($list = ' + exprGen(a[1]) + ')');
				emit('#foreach($_' + a[4] + ' in $list)');
				if (a[3]) {
					emit('#set(' + k + ' = $velocityCount - 1)');
				}
				stmtsGen(a[2]);
				emit('#{end}');
				break;
			case 'set':
				emit('#set ($_' + a[1] + '=' + exprGen(a[2]) + ')');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (/^\$([\w-]+)$/.test(s))
					emit('${' + RegExp.$1 + '}');
				else {
					emit('#set($t = ' + s + ')$!{t}');
				}
				break;
			case 'text':
				emit(a[1].replace(/\$/g, '$${dollar}').replace(/#/g, '$${sharp}'));
				//emit('#set($t = ' + vmQuote(a[1]) + ')${t}');
				break;
			case 'inc':
				emit("#parse('" + a[1].replace(/\.\w+$/, '.vm') + "')");
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
				return '$_' + x[1];
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
			case 'eq': case 'ne':
				return exprToStr(x[1], isEquality) + (x[0] == 'eq' ? '==' : '!=') + exprToStr(x[2], isRel);
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

/// <reference path="crox_js.js"/>
/// <reference path="codegen_php.js"/>
/// <reference path="codegen_vm.js"/>
Crox.compileToPhp = function(s) {
	/// <summary>返回编译后的 php 函数</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_php_wrap(codegen_php_tran(parsetmpl(s)));
};
Crox.compileToVM = function(s, currentPath) {
	/// <summary>返回编译后的 VM 模板</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_vm_tran(parsetmpl(s));
};

Crox.version = "1.2.0";return Crox;})();if ( typeof module == "object" && module && typeof module.exports == "object" ) module.exports = Crox;else if (typeof define == "function" && (define.amd || define.cmd) ) define(function () { return Crox; } );else if (typeof KISSY != "undefined") KISSY.add("crox",function(){ return Crox; });if (root) root.Crox = Crox; })(this);