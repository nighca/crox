/**
 * @preserve Crox v1.2.1
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 432c1c49d9d2360ddd6ac3a5feb20ff0
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
			// {{/if}} {{else}} {{/each}} {{/raw}}
			[/{{(?:\/if|else|\/each|\/raw)}}/, function(a) {
				return a;
			}],
			[/{{#raw}}/, function(a) {
				this.pushState('raw');
				return a;
			}],
			// {{ {{#if {{#each
			[/{{(?:#(?:if|each)(?=\s))?/, function(a) {
				this.pushState('{{');
				return a;
			}]
		],
		raw: [
			[/(?:(?!{{\/raw}})[\s\S])+/, function(a) {
				this.popState();
				return 'rawtext';
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
	var table = {/* state num: 95 */
		nStart: 40,
		tSymbols: ["$", "!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "boolean", "eq", "include", "ne", "number", "rawtext", "realId", "set", "string", "text", "{{", "{{#each", "{{#if", "{{#raw}}", "{{/each}}", "{{/if}}", "{{/raw}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "epsilon", "expr", "id", "program", "statement", "statements"],
		tSymbolIndex: { "$": 0, "!": 1, "%": 2, "&&": 3, "(": 4, ")": 5, "*": 6, "+": 7, "-": 8, ".": 9, "/": 10, "<": 11, "<=": 12, "=": 13, ">": 14, ">=": 15, "[": 16, "]": 17, "boolean": 18, "eq": 19, "include": 20, "ne": 21, "number": 22, "rawtext": 23, "realId": 24, "set": 25, "string": 26, "text": 27, "{{": 28, "{{#each": 29, "{{#if": 30, "{{#raw}}": 31, "{{/each}}": 32, "{{/if}}": 33, "{{/raw}}": 34, "{{else}}": 35, "{{{": 36, "||": 37, "}}": 38, "}}}": 39, "AdditiveExpression": 40, "EqualityExpression": 41, "LogicalAndExpression": 42, "LogicalOrExpression": 43, "MemberExpression": 44, "MultiplicativeExpression": 45, "PrimaryExpression": 46, "RelationalExpression": 47, "UnaryExpression": 48, "epsilon": 49, "expr": 50, "id": 51, "program": 52, "statement": 53, "statements": 54 },
		tAction: [{ _: -2 }, { _: -32768 }, { 27: 3, 28: 4, 29: 5, 30: 6, 31: 7, 36: 8, _: -1 }, { _: -11 }, { 1: 10, 4: 11, 8: 12, 18: 13, 20: 14, 22: 15, 24: 16, 25: 17, 26: 18, _: 0 }, { 1: 10, 4: 11, 8: 12, 18: 13, 20: 30, 22: 15, 24: 16, 25: 31, 26: 18, _: 0 }, { 23: 34, _: 0 }, { _: -3 }, { _: -19 }, { 26: 39, _: -16 }, { _: -18 }, { _: -14 }, { 20: 30, 24: 16, 25: 31, _: -15 }, { _: -17 }, { 7: 41, 8: 42, _: -35 }, { 19: 43, 21: 44, _: -43 }, { 3: 45, _: -45 }, { 37: 46, _: -47 }, { 9: 47, 16: 48, _: -25 }, { 2: 49, 6: 50, 10: 51, _: -32 }, { _: -22 }, { 11: 52, 12: 53, 14: 54, 15: 55, _: -40 }, { _: -28 }, { 38: 56, _: 0 }, { _: -20 }, { _: -16 }, { _: -15 }, { 26: 57, _: 0 }, { 38: 58, _: 0 }, { 34: 59, _: 0 }, { 39: 60, _: 0 }, { _: -26 }, { 5: 61, _: 0 }, { _: -27 }, { 38: 62, _: 0 }, { 13: 63, _: 0 }, { 20: 30, 24: 16, 25: 31, _: 0 }, { _: -9 }, { 26: 79, _: -48 }, { _: -13 }, { _: -10 }, { _: -21 }, { _: -12 }, { 2: 49, 6: 50, 10: 51, _: -33 }, { 2: 49, 6: 50, 10: 51, _: -34 }, { 11: 52, 12: 53, 14: 54, 15: 55, _: -41 }, { 11: 52, 12: 53, 14: 54, 15: 55, _: -42 }, { 19: 43, 21: 44, _: -44 }, { 3: 45, _: -46 }, { _: -23 }, { 17: 83, _: 0 }, { _: -31 }, { _: -29 }, { _: -30 }, { 7: 41, 8: 42, _: -36 }, { 7: 41, 8: 42, _: -38 }, { 7: 41, 8: 42, _: -37 }, { 7: 41, 8: 42, _: -39 }, { 38: 84, _: 0 }, { 38: 85, _: 0 }, { 27: 3, 28: 4, 29: 5, 30: 6, 31: 7, 33: 86, 35: 87, 36: 8, _: 0 }, { 38: 88, _: 0 }, { _: -24 }, { _: -4 }, { _: -8 }, { 27: 3, 28: 4, 29: 5, 30: 6, 31: 7, 32: 92, 36: 8, _: 0 }, { 27: 3, 28: 4, 29: 5, 30: 6, 31: 7, 32: 93, 36: 8, _: 0 }, { 27: 3, 28: 4, 29: 5, 30: 6, 31: 7, 33: 94, 36: 8, _: 0 }, { _: -7 }, { _: -6 }, { _: -5 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 6, 5, 7, 5, 5, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 5, 5, 5, 5, 5, 5, 36, 5, 5, 5, 5, 5, 5, 5, 5, 37, 38, 0, 39, 40, 41, 42, 5, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 0, 0, 63, 0, 64, 65, 66, 67, 68, 69, 70],
		tGoto: [{ 12: 1, 14: 2 }, , { 13: 9 }, , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 28, 11: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 32, 11: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 33, 11: 29 }, , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 35, 11: 29 }, , { 4: 23, 6: 25, 8: 36, 11: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 37, 11: 29 }, { 4: 23, 6: 25, 8: 38, 11: 29 }, , , , , { 11: 40 }, , , , , , , , , , , , , , , , , , , , , , , , { 4: 23, 5: 64, 6: 25, 8: 27, 11: 29 }, { 4: 23, 5: 65, 6: 25, 8: 27, 11: 29 }, { 0: 19, 4: 23, 5: 24, 6: 25, 7: 66, 8: 27, 11: 29 }, { 0: 19, 4: 23, 5: 24, 6: 25, 7: 67, 8: 27, 11: 29 }, { 0: 19, 1: 68, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 29 }, { 0: 19, 1: 20, 2: 69, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 29 }, { 11: 70 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 71, 11: 29 }, { 4: 23, 6: 25, 8: 72, 11: 29 }, { 4: 23, 6: 25, 8: 73, 11: 29 }, { 4: 23, 6: 25, 8: 74, 11: 29 }, { 0: 75, 4: 23, 5: 24, 6: 25, 8: 27, 11: 29 }, { 0: 76, 4: 23, 5: 24, 6: 25, 8: 27, 11: 29 }, { 0: 77, 4: 23, 5: 24, 6: 25, 8: 27, 11: 29 }, { 0: 78, 4: 23, 5: 24, 6: 25, 8: 27, 11: 29 }, , { 9: 80 }, { 14: 81 }, , , , , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 10: 82, 11: 29 }, , , , , , , , , , , , , , , , , , { 13: 9 }, , , { 14: 89 }, { 14: 90 }, , { 14: 91 }, , { 13: 9 }, { 13: 9 }, { 13: 9 }],
		tRules: [[55, 52], [52, 54], [54], [54, 54, 53], [53, 30, 50, 38, 54, 33], [53, 30, 50, 38, 54, 35, 54, 33], [53, 29, 50, 26, 49, 38, 54, 32], [53, 29, 50, 26, 26, 38, 54, 32], [53, 28, 25, 51, 13, 50, 38], [53, 28, 50, 38], [53, 36, 50, 39], [53, 27], [53, 28, 20, 26, 38], [53, 31, 23, 34], [51, 24], [51, 25], [51, 20], [46, 26], [46, 22], [46, 18], [46, 51], [46, 4, 50, 5], [44, 46], [44, 44, 9, 51], [44, 44, 16, 50, 17], [48, 44], [48, 1, 48], [48, 8, 48], [45, 48], [45, 45, 6, 48], [45, 45, 10, 48], [45, 45, 2, 48], [40, 45], [40, 40, 7, 45], [40, 40, 8, 45], [47, 40], [47, 47, 11, 40], [47, 47, 14, 40], [47, 47, 12, 40], [47, 47, 15, 40], [41, 47], [41, 41, 19, 47], [41, 41, 21, 47], [42, 41], [42, 42, 3, 41], [43, 42], [43, 43, 37, 42], [50, 43], [49]],
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
			}, function($1, $2, $3) {
				var $$; $$ = ['raw', $2.text]; return $$;
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
		function b(a, b) { return g[a][b] } var c = a.nStart, e = a.tSymbols, d = a.tSymbolIndex, g = a.tAction, h = a.tGoto, q = a.tRules, f = a.tFuncs, m = a.actionIndex; m && (b = function(a, b) { var c = g[m[a]]; return c[b] || c._ }); return function(a, g) {
			function m(b) { throw Error("Syntax error: " + a.getPos(y.index) + (b ? "\n" + b : "")); } var t = 0, B = [0],
			y = a.scan(), l = [], A = { get: function(a) { return l[l.length + a] }, set: function(a, b) { l[l.length + a] = b } }; if (g) for (var n in g) A[n] = g[n]; for (; ;) if (n = b(t, d[y.tag])) if (0 < n) B.push(t = n), l.push(y), y = a.scan(); else if (0 > n && -32768 < n) { n = -n; var t = q[n], C = t.length - 1; B.length -= C; t = h[B[B.length - 1]][t[0] - c]; B.push(t); f[n] ? (n = f[n].apply(A, l.splice(l.length - C, C)), l.push(n)) : 1 != C && l.splice(l.length - C, C, null) } else return y.tag != e[0] && m(), l[0]; else { n = []; for (C = 0; C < c; ++C) b(t, C) && n.push(e[C]); m("find " + y.tag + "\nexpect " + n.join(" ")) }
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
function changeExt(s, ext) {
	return s.replace(/\.\w+$/, '.' + ext);
}

/// <reference path="common.js"/>
/// <reference path="codegen_common.js"/>
function codegen_js_tran(prog, encodeName) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="encodeName" type="String"></param>
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
				if (a[2]) s = encodeName + '(' + s + ')';
				emit('$s += ' + s + ';');
				break;
			case 'text':
				emit('$s += ' + quote(a[1]) + ';');
				break;
			case 'inc':
				//stmtsGen(a[2][1]);
				break;
			case 'raw': emit(a[1]); break;
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
function codegen_js_tofn(prog, config) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="config" type="Object" optional="true"></param>
	/// <returns type="Function" />
	var encodeName;
	if (config) encodeName = config.htmlEncode;
	var s = codegen_js_tran(prog, encodeName || '$htmlEncode');
	var body = '';
	if (!encodeName)
		body += "var obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\n\
	function $htmlEncode(s) {\n\
		return String(s).replace(/[<>&\"]/g, function(c) {\n\
			return obj[c];\n\
		});\n\
	}";
	body += "var $s = '';";
	body += s;
	body += "return $s;";

	var f = Function('root', body);
	return f;
}

/// <reference path="codegen_js.js"/>
function parsetmpl(s) {
	/// <summary>解析模板，得到语法树</summary>
	/// <param name="s" type="String">模板</param>
	var ast = parse(Lexer(s));
	return ast;
}
function compile2jsfn(s, config) {
	/// <summary>编译模板，得到一个 js 函数</summary>
	/// <param name="config" type="Object" optional="true"></param>
	/// <param name="s" type="String">模板</param>
	/// <returns type="Function" />
	var ast = parsetmpl(s);
	return codegen_js_tofn(ast, config);
}
var Crox = {
	parse: parsetmpl,
	compile: compile2jsfn,
	render: function(s, data) {
		/// <summary>将数据 data 填充到模板 s</summary>
		/// <param name="s" type="String">模板</param>
		/// <returns type="String" />
		var fn = compile2jsfn(s);
		return fn(data);
	}
};

Crox.version = "1.2.1";return Crox;})();if ( typeof module == "object" && module && typeof module.exports == "object" ) module.exports = Crox;else if (typeof define == "function" && (define.amd || define.cmd) ) define(function () { return Crox; } );else if (typeof KISSY != "undefined") KISSY.add(function(){ return Crox; });if (root) root.Crox = Crox; })(this);