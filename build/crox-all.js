/**
 * @preserve Crox v1.2.7
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 3aeed72312b5835ad4f2e8af35a34e67
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
		}(["!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "||", "===", "!==", "==", "!="]), function(a) {
			switch (a) {
				case '==':
				case '===':
				case '!=':
				case '!==':
					return 'eq';
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
			[/{{(?:\/if|else|\/each|\/forin|\/raw)}}/, function(a) {
				return a;
			}],
			[/{{#raw}}/, function(a) {
				this.pushState('raw');
				return a;
			}],
			// {{ {{#if {{#each
			[/{{(?:#(?:if|each|forin)(?=\s))?/, function(a) {
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
	var table = {/* state num: 109 */
		nStart: 41,
		tSymbols: ["$", "!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "boolean", "eq", "include", "number", "rawtext", "realId", "set", "string", "text", "{{", "{{#each", "{{#forin", "{{#if", "{{#raw}}", "{{/each}}", "{{/forin}}", "{{/if}}", "{{/raw}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "_text", "epsilon", "expr", "id", "name", "program", "statement", "statements", "texts"],
		tAction: [{ _: -2 }, { _: -32768 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 37: 9, _: -1 }, { _: -19 }, { 1: 13, 4: 14, 8: 15, 18: 16, 20: 17, 21: 18, 23: 19, 24: 20, 25: 21, _: 0 }, { 1: 13, 4: 14, 8: 15, 18: 16, 20: 33, 21: 18, 23: 19, 24: 34, 25: 21, _: 0 }, { 22: 38, _: 0 }, { _: -17 }, { _: -3 }, { 26: 3, 31: 8, _: -13 }, { _: -26 }, { 25: 44, _: -23 }, { _: -25 }, { _: -21 }, { 20: 33, 23: 19, 24: 34, _: -22 }, { _: -24 }, { 7: 46, 8: 47, _: -42 }, { 19: 48, _: -49 }, { 3: 49, _: -51 }, { 38: 50, _: -53 }, { 9: 51, 16: 52, _: -32 }, { 2: 53, 6: 54, 10: 55, _: -39 }, { _: -29 }, { 11: 56, 12: 57, 14: 58, 15: 59, _: -47 }, { _: -35 }, { 39: 60, _: 0 }, { _: -27 }, { _: -23 }, { _: -22 }, { 20: 33, 23: 19, 24: 34, 25: 61, _: 0 }, { 39: 65, _: 0 }, { 35: 66, _: 0 }, { 40: 67, _: 0 }, { _: -18 }, { _: -33 }, { 5: 68, _: 0 }, { _: -34 }, { 39: 69, _: 0 }, { 13: 70, _: 0 }, { 20: 33, 23: 19, 24: 34, _: 0 }, { _: -11 }, { _: -15 }, { _: -16 }, { 20: 33, 23: 19, 24: 34, 25: 61, _: -54 }, { _: -20 }, { _: -12 }, { _: -28 }, { _: -14 }, { 2: 53, 6: 54, 10: 55, _: -40 }, { 2: 53, 6: 54, 10: 55, _: -41 }, { 11: 56, 12: 57, 14: 58, 15: 59, _: -48 }, { 19: 48, _: -50 }, { 3: 49, _: -52 }, { _: -30 }, { 17: 91, _: 0 }, { _: -38 }, { _: -36 }, { _: -37 }, { 7: 46, 8: 47, _: -43 }, { 7: 46, 8: 47, _: -45 }, { 7: 46, 8: 47, _: -44 }, { 7: 46, 8: 47, _: -46 }, { 39: 92, _: 0 }, { 39: 93, _: 0 }, { 39: 94, _: 0 }, { 39: 95, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 34: 96, 36: 97, 37: 9, _: 0 }, { 39: 98, _: 0 }, { _: -31 }, { _: -4 }, { _: -10 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 32: 104, 37: 9, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 32: 105, 37: 9, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 33: 106, 37: 9, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 33: 107, 37: 9, _: 0 }, { 26: 3, 27: 4, 28: 5, 29: 6, 30: 7, 31: 8, 34: 108, 37: 9, _: 0 }, { _: -6 }, { _: -7 }, { _: -8 }, { _: -9 }, { _: -5 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 5, 6, 5, 7, 8, 9, 5, 5, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 5, 5, 5, 5, 5, 39, 5, 5, 5, 5, 5, 5, 5, 5, 40, 41, 42, 43, 43, 0, 44, 45, 46, 47, 5, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 0, 0, 0, 0, 69, 0, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
		tGoto: [{ 14: 1, 16: 2 }, , { 9: 10, 15: 11, 17: 12 }, , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 31, 12: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 35, 12: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 36, 12: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 37, 12: 32 }, , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 39, 12: 32 }, , , { 9: 40 }, { 4: 26, 6: 28, 8: 41, 12: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 42, 12: 32 }, { 4: 26, 6: 28, 8: 43, 12: 32 }, , , , , { 12: 45 }, , , , , , , , , , , , , , , { 12: 62, 13: 63 }, { 12: 62, 13: 64 }, , , , , , , , , , { 4: 26, 5: 71, 6: 28, 8: 30, 12: 32 }, { 4: 26, 5: 72, 6: 28, 8: 30, 12: 32 }, { 0: 22, 4: 26, 5: 27, 6: 28, 7: 73, 8: 30, 12: 32 }, { 0: 22, 1: 74, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 32 }, { 0: 22, 1: 23, 2: 75, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 32 }, { 12: 76 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 77, 12: 32 }, { 4: 26, 6: 28, 8: 78, 12: 32 }, { 4: 26, 6: 28, 8: 79, 12: 32 }, { 4: 26, 6: 28, 8: 80, 12: 32 }, { 0: 81, 4: 26, 5: 27, 6: 28, 8: 30, 12: 32 }, { 0: 82, 4: 26, 5: 27, 6: 28, 8: 30, 12: 32 }, { 0: 83, 4: 26, 5: 27, 6: 28, 8: 30, 12: 32 }, { 0: 84, 4: 26, 5: 27, 6: 28, 8: 30, 12: 32 }, , , , { 10: 85, 12: 62, 13: 86 }, { 10: 87, 12: 62, 13: 88 }, { 16: 89 }, , , , , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 11: 90, 12: 32 }, , , , , , , , , , , , , , , , , , , { 9: 10, 15: 11, 17: 12 }, , , { 16: 99 }, { 16: 100 }, { 16: 101 }, { 16: 102 }, , { 16: 103 }, , { 9: 10, 15: 11, 17: 12 }, { 9: 10, 15: 11, 17: 12 }, { 9: 10, 15: 11, 17: 12 }, { 9: 10, 15: 11, 17: 12 }, { 9: 10, 15: 11, 17: 12 }],
		tRules: [[59, 55], [55, 57], [57], [57, 57, 56], [56, 30, 52, 39, 57, 34], [56, 30, 52, 39, 57, 36, 57, 34], [56, 28, 52, 54, 51, 39, 57, 32], [56, 28, 52, 54, 54, 39, 57, 32], [56, 29, 52, 54, 51, 39, 57, 33], [56, 29, 52, 54, 54, 39, 57, 33], [56, 27, 24, 53, 13, 52, 39], [56, 27, 52, 39], [56, 37, 52, 40], [56, 58], [56, 27, 20, 25, 39], [54, 25], [54, 53], [58, 50], [58, 58, 50], [50, 26], [50, 31, 22, 35], [53, 23], [53, 24], [53, 20], [47, 25], [47, 21], [47, 18], [47, 53], [47, 4, 52, 5], [45, 47], [45, 45, 9, 53], [45, 45, 16, 52, 17], [49, 45], [49, 1, 49], [49, 8, 49], [46, 49], [46, 46, 6, 49], [46, 46, 10, 49], [46, 46, 2, 49], [41, 46], [41, 41, 7, 46], [41, 41, 8, 46], [48, 41], [48, 48, 11, 41], [48, 48, 14, 41], [48, 48, 12, 41], [48, 48, 15, 41], [42, 48], [42, 42, 19, 48], [43, 42], [43, 43, 3, 42], [44, 43], [44, 44, 38, 43], [52, 44], [51]],
		tFuncs: function() {
			function $f0($1, $2, $3, $4, $5, $6, $7) {
				var $$; $$ = ['each', $2, $6, $4, $3, true]; return $$;
			}
			function $f1($1, $2, $3, $4, $5, $6, $7) {
				var $$; $$ = ['each', $2, $6, $4, $3, false]; return $$;
			}
			function $f2($1) {
				var $$; $$ = $1.text; return $$;
			}
			function $f3($1) {
				var $$; $$ = ['lit', eval($1.text)]; return $$;
			}
			function $f4($1, $2, $3) {
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
			}, $f0, $f0, $f1, $f1, function($1, $2, $3, $4, $5, $6) {
				var $$; $$ = ['set', $3.text, $5]; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = ['eval', $2, true]; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = ['eval', $2, false]; return $$;
			}, function($1) {
				var $$; $$ = ['text', $1]; return $$;
			}, function($1, $2, $3, $4) {
				var $$; $$ = ['inc', eval($3.text)]; return $$;
			}, function($1) {
				var $$; $$ = eval($1.text); return $$;
			}, $f2, function($1) {
				var $$; $$ = $1; return $$;
			}, function($1, $2) {
				var $$; $$ = $1 + $2; return $$;
			}, $f2, function($1, $2, $3) {
				var $$; $$ = $2.text; return $$;
			}, , , , $f3, $f3, function($1) {
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
			}, , $f4, $f4, $f4, , $f4, $f4, , $f4, $f4, $f4, $f4, , $f4, , $f4, , $f4];
		}()
	};
	return function(a) {
		function b(a, b) { return g[a][b] } for (var d = a.nStart, e = a.tSymbols, c = {}, f = 0; f < e.length; ++f) c[e[f]] = f; var g = a.tAction, k = a.tGoto, h = a.tRules, n = a.tFuncs,
		p = a.actionIndex; p && (b = function(a, b) { var d = g[p[a]]; return d[b] || d._ }); return function(a, f) {
			function g(b) { throw Error("Syntax error: " + a.getPos(l.index) + (b ? "\n" + b : "")); } var p = 0, B = [0], l = a.scan(), v = [], r = { get: function(a) { return v[v.length + a] }, set: function(a, b) { v[v.length + a] = b } }; if (f) for (var y in f) r[y] = f[y]; for (; ;) if (y = b(p, c[l.tag])) if (0 < y) B.push(p = y), v.push(l), l = a.scan(); else if (0 > y && -32768 < y) {
				y = -y; var p = h[y], t = p.length - 1; B.length -= t; p = k[B[B.length - 1]][p[0] - d]; B.push(p); n[y] ? (y = n[y].apply(r, v.splice(v.length -
				t, t)), v.push(y)) : 1 != t && v.splice(v.length - t, t, null)
			} else return l.tag != e[0] && g(), v[0]; else { y = []; for (t = 0; t < d; ++t) b(p, t) && y.push(e[t]); g("find " + l.tag + "\nexpect " + y.join(" ")) }
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
	var i_each = 0;
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
				++i_each;
				var k = a[3] || '$i';
				var sExpr = exprGen(a[1]);
				if (/^[$\w]+$/.test(sExpr)) {
					var listName = sExpr;
				}
				else {
					listName = '$list' + (i_each == 1 ? '' : i_each);
					emit('var ' + listName + ' = ' + sExpr + ';');
				}
				if (a[5]) emit('for(var ' + k + '=0;' + k + '<' + listName + '.length;' + k + '++){');
				else emit('for(var ' + k + ' in ' + listName + ') {');
				indent();
				emit('var ' + a[4] + ' = ' + listName + '[' + k + '];');
				stmtsGen(a[2]);
				outdent();
				emit('}');
				--i_each;
				break;
			case 'set':
				emit('var ' + a[1] + '=' + exprGen(a[2]) + ';');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				emit('var $t = ' + s + ';if($t!=null)$s += ' + (a[2] ? encodeName + '($t)' : '$t') + ';');
				break;
			case 'text':
				emit('$s += ' + quote(a[1]) + ';');
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
				var listName = '$list' + (i_each == 1 ? '' : i_each);
				emit('#set (' + listName + ' = ' + exprGen(a[1]) + ')');
				if (a[5]) { //array
					emit('#foreach($_' + a[4] + ' in ' + listName + ')');
					if (a[3]) {
						emit('#set($_' + a[3] + ' = $velocityCount - 1)');
					}
				}
				else { //object
					if (a[3]) {
						emit('#foreach($_' + a[3] + ' in ' + listName + '.keySet())');
						emit('#set($_' + a[4] + ' =' + listName + '.get($_' + a[3] + '))');
					}
					else {
						emit('#foreach($_' + a[4] + ' in ' + listName + ')');
					}
				}
				stmtsGen(a[2]);
				emit('#{end}');
				--i_each;
				break;
			case 'set':
				emit('#set ($' + encodeCommonName(a[1]) + '=' + exprGen(a[2]) + ')');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (/^\$([\w-]+)$/.test(s))
					emit('$!{' + RegExp.$1 + '}');
				else {
					emit('#set($t = ' + s + ')$!{t}');
				}
				break;
			case 'text':
				emit(a[1].replace(/\$/g, '$${dollar}').replace(/#/g, '$${sharp}'));
				//emit('#set($t = ' + vmQuote(a[1]) + ')${t}');
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
	function encodeCommonName(s) {
		return s == 'root' ? 'crox_root' : '_' + s;
	}

	function exprToStr(x, check) {
		var t = exprGen(x);
		if (check && !check(x[0])) t = '(' + t + ')';
		return t;
	}
	function exprGen(x) {
		switch (x[0]) {
			case 'id':
				return '$' + encodeCommonName(x[1]);
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

/// <reference path="crox_js.js"/>
/// <reference path="codegen_php.js"/>
/// <reference path="codegen_vm.js"/>
Crox.compileToPhp = function(s) {
	/// <summary>返回编译后的 php</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_php_tran(parsetmpl(s));
};
Crox.compileToVM = function(s, currentPath) {
	/// <summary>返回编译后的 VM 模板</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_vm_tran(parsetmpl(s));
};

Crox.version = "1.2.7";return Crox;})();if ( typeof module == "object" && module && typeof module.exports == "object" ) module.exports = Crox;else if (typeof define == "function" && (define.amd || define.cmd) ) define(function () { return Crox; } );else if (typeof KISSY != "undefined") KISSY.add(function(){ return Crox; });if (root) root.Crox = Crox; })(this);