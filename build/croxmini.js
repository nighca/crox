/**
 * @preserve Crox v1.2.7
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 77d7ac397c7dac9b8b4417fa03ecaf6a
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
function evalNum(s) {
	return +s;
}
function evalStr(s) {
	return eval(s);
}

function encodeCommonName(s) {
	/// <param name="s" type="String"></param>
	return s.replace(/^_+/, '$&$&');
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
		[/\s+/],
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
			return /[*/%]/.test(a) ? 'mul' : /[<>]/.test(a) ? 'rel' : /[!=]=/.test(a) ? 'eq' : a;
		}]
	];

	var Lexer = createLexer({
		'': [
			[/(?:(?!{{)[\s\S])+/, function(a) {
				return 'text';
			}],
			[/{{{/, function(a) {
				this.pushState(a);
				return a;
			}],
			[/{{(?:\/if|else|\/each|\/forin)}}/, function(a) {
				return a;
			}],
			[/{{(?:#(?:if|each|forin)(?=\s))?/, function(a) {
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
		nStart: 33,
		tSymbols: ["$", "!", "&&", "(", ")", "+", "-", ".", "=", "[", "]", "boolean", "eq", "include", "mul", "number", "realId", "rel", "set", "string", "text", "{{", "{{#each", "{{#forin", "{{#if", "{{/each}}", "{{/forin}}", "{{/if}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "elsepart", "epsilon", "expr", "id", "name", "program", "statement", "statements"],
		tAction: [{ _: -2 }, { _: -32768 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 29: 8, _: -1 }, { _: -13 }, { 1: 10, 3: 11, 6: 12, 11: 13, 13: 14, 15: 15, 16: 16, 18: 17, 19: 18, _: 0 }, { 1: 10, 3: 11, 6: 12, 11: 13, 13: 14, 15: 15, 16: 16, 18: 30, 19: 18, _: 0 }, { _: -3 }, { _: -22 }, { _: -19 }, { _: -21 }, { _: -17 }, { 13: 14, 16: 16, 18: 30, _: -18 }, { _: -20 }, { 5: 39, 6: 40, _: -36 }, { 12: 41, _: -40 }, { 2: 42, _: -42 }, { 30: 43, _: -44 }, { 7: 44, 9: 45, _: -28 }, { 14: 46, _: -33 }, { _: -25 }, { 17: 47, _: -38 }, { _: -31 }, { 31: 48, _: 0 }, { _: -23 }, { _: -18 }, { 13: 14, 16: 16, 18: 30, 19: 49, _: 0 }, { 31: 53, _: 0 }, { 32: 54, _: 0 }, { _: -29 }, { 4: 55, _: 0 }, { _: -30 }, { 8: 56, _: 0 }, { 13: 14, 16: 16, 18: 30, _: 0 }, { _: -11 }, { _: -15 }, { _: -16 }, { 13: 14, 16: 16, 18: 30, 19: 49, _: -45 }, { _: -12 }, { _: -24 }, { 14: 46, _: -34 }, { 14: 46, _: -35 }, { 17: 47, _: -39 }, { 12: 41, _: -41 }, { 2: 42, _: -43 }, { _: -26 }, { 10: 72, _: 0 }, { _: -32 }, { 5: 39, 6: 40, _: -37 }, { 31: 73, _: 0 }, { 31: 74, _: 0 }, { 31: 75, _: 0 }, { 31: 76, _: 0 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 28: 77, 29: 8, _: -45 }, { 31: 80, _: 0 }, { _: -27 }, { 27: 86, _: 0 }, { 27: 87, _: 0 }, { _: -10 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 25: 88, 29: 8, _: 0 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 25: 89, 29: 8, _: 0 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 26: 90, 29: 8, _: 0 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 26: 91, 29: 8, _: 0 }, { 20: 3, 21: 4, 22: 5, 23: 6, 24: 7, 29: 8, _: -14 }, { _: -5 }, { _: -4 }, { _: -6 }, { _: -7 }, { _: -8 }, { _: -9 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 5, 5, 6, 5, 5, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 5, 5, 5, 5, 5, 32, 5, 5, 5, 33, 34, 35, 36, 36, 0, 37, 38, 5, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 0, 0, 0, 0, 0, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68],
		tGoto: [{ 14: 1, 16: 2 }, , { 15: 9 }, , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 28, 12: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 31, 12: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 32, 12: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 33, 12: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 34, 12: 29 }, , { 4: 23, 6: 25, 8: 35, 12: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 36, 12: 29 }, { 4: 23, 6: 25, 8: 37, 12: 29 }, , , , , { 12: 38 }, , , , , , , , , , , , , , { 12: 50, 13: 51 }, { 12: 50, 13: 52 }, , , , , , , { 4: 23, 5: 57, 6: 25, 8: 27, 12: 29 }, { 4: 23, 5: 58, 6: 25, 8: 27, 12: 29 }, { 0: 19, 4: 23, 5: 24, 6: 25, 7: 59, 8: 27, 12: 29 }, { 0: 19, 1: 60, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 29 }, { 0: 19, 1: 20, 2: 61, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 29 }, { 12: 62 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 63, 12: 29 }, { 4: 23, 6: 25, 8: 64, 12: 29 }, { 0: 65, 4: 23, 5: 24, 6: 25, 8: 27, 12: 29 }, , , , { 10: 66, 12: 50, 13: 67 }, { 10: 68, 12: 50, 13: 69 }, { 16: 70 }, , , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 11: 71, 12: 29 }, , , , , , , , , , , , , , { 9: 78, 10: 79, 15: 9 }, , , { 16: 81 }, { 16: 82 }, { 16: 83 }, { 16: 84 }, { 16: 85 }, , , , { 15: 9 }, { 15: 9 }, { 15: 9 }, { 15: 9 }, { 15: 9 }],
		tRules: [[50, 47], [47, 49], [49], [49, 49, 48], [48, 24, 44, 31, 49, 43, 27], [48, 24, 44, 31, 49, 42, 27], [48, 22, 44, 46, 43, 31, 49, 25], [48, 22, 44, 46, 46, 31, 49, 25], [48, 23, 44, 46, 43, 31, 49, 26], [48, 23, 44, 46, 46, 31, 49, 26], [48, 21, 18, 45, 8, 44, 31], [48, 21, 44, 31], [48, 29, 44, 32], [48, 20], [42, 28, 49], [46, 19], [46, 45], [45, 16], [45, 18], [45, 13], [39, 19], [39, 15], [39, 11], [39, 45], [39, 3, 44, 4], [37, 39], [37, 37, 7, 45], [37, 37, 9, 44, 10], [41, 37], [41, 1, 41], [41, 6, 41], [38, 41], [38, 38, 14, 41], [33, 38], [33, 33, 5, 38], [33, 33, 6, 38], [40, 33], [40, 40, 17, 33], [34, 40], [34, 34, 12, 40], [35, 34], [35, 35, 2, 34], [36, 35], [36, 36, 30, 35], [44, 36], [43]],
		tFuncs: function() {
			function $f0($1, $2, $3, $4, $5, $6) {
				var $$; $$ = 'if(' + $2 + '){' + $4 + '}' + ($5 || ''); return $$;
			}
			function $f1($1, $2, $3, $4, $5, $6, $7) {
				var $$;
				$$ = makeLoop($2, $6, $4, $3, false);
				return $$;
			}
			function $f2($1, $2, $3, $4, $5, $6, $7) {
				var $$; $$ = makeLoop($2, $6, $4, $3, false); return $$;
			}
			function $f3($1) {
				var $$; $$ = $1.text; return $$;
			}
			function $f4($1, $2, $3) {
				var $$; $$ = $1 + $2.text + $3; return $$;
			}
			return [, function($1) {
				var $$; $$ = Function('root', "var _obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\
	function _htmlEncode(s) {\
		return String(s).replace(/[<>&\"]/g, function(c) {\
			return _obj[c];\
		});\
	}var _t,_s = '';function _print(s,e){if(s!=null){if(e)s=_htmlEncode(s);_s+=s;}}" + $1 + "return _s;"); return $$;
			}, function() {
				var $$; $$ = ''; return $$;
			}, function($1, $2) {
				var $$; $$ = $1 + $2; return $$;
			}, $f0, $f0, $f1, $f1, $f2, $f2, function($1, $2, $3, $4, $5, $6) {
				var $$; $$ = 'var ' + encodeCommonName($3.text) + '=' + $5 + ';'; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '_print(' + $2 + ',1);'; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '_print(' + $2 + ');'; return $$;
			}, function($1) {
				var $$; $$ = '_print(' + quote($1.text) + ');'; return $$;
			}, function($1, $2) {
				var $$; $$ = 'else{' + $2 + '}'; return $$;
			}, function($1) {
				var $$; $$ = evalStr($1.text); return $$;
			}, $f3, , , , $f3, $f3, $f3, function($1) {
				var $$; $$ = encodeCommonName($1.text); return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '(' + $2 + ')'; return $$;
			}, , function($1, $2, $3) {
				var $$; $$ = $1 + '.' + $3; return $$;
			}, function($1, $2, $3, $4) {
				var $$; $$ = $1 + '[' + $3 + ']'; return $$;
			}, , function($1, $2) {
				var $$; $$ = '!' + $2; return $$;
			}, function($1, $2) {
				var $$; $$ = '- ' + $2; return $$;
			}, , $f4, , $f4, function($1, $2, $3) {
				var $$; $$ = $1 + '- ' + $3; return $$;
			}, , $f4, , $f4, , $f4, , $f4];
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

var i_tmake = 0;
function TMake() {
	return '_' + (i_tmake++);
}
function makeLoop(a1, a2, a3, a4, a5) {
	var s = '';
	var keyName = a3 ? encodeCommonName(a3) : TMake();
	var sExpr = a1;
	if (/^\w+$/.test(sExpr)) {
		var listName = sExpr;
	}
	else {
		listName = TMake();
		s = ('var ' + listName + ' = ' + sExpr + ';');
	}
	if (a5) s += ('for(var ' + keyName + '=0;' + keyName + '<' + listName + '.length;' + keyName + '++){');
	else s += ('for(var ' + keyName + ' in ' + listName + ') {');
	s += 'var ' + a4 + ' = ' + listName + '[' + keyName + '];' + a2 + '}';
	return s;
}

function compile2jsfn(s) {
	return parse(Lexer(s));
}
var Crox = {
	compile: compile2jsfn,
	render: function(s, data) {
		var fn = compile2jsfn(s);
		return fn(data);
	}
};

Crox.version = "1.2.7";return Crox;})();if ( typeof module == "object" && module && typeof module.exports == "object" ) module.exports = Crox;else if (typeof define == "function" && (define.amd || define.cmd) ) define(function () { return Crox; } );else if (typeof KISSY != "undefined") KISSY.add(function(){ return Crox; });if (root) root.Crox = Crox; })(this);