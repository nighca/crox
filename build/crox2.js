/**
 * @preserve Crox v1.3.0
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 58c139cd4c3c2574fadaec9e51db2e90
 */
KISSY.add("crox", function(){function Class(base, constructor, methods) {
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
		[/\/\/[^\r\n]*|\/\*[\s\S]*?\*\//],
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
		}(["!", "%", "&&", "(", ")", "*", "+", "-", ".", "/", "<", "<=", "=", ">", ">=", "[", "]", "||", "===", "!==", "==", "!=", ","]), function(a) {
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
			[/{{(?:\/if|else|\/each|\/forin|\/raw)}}/, function(a) {
				return a;
			}],
			[/{{#raw}}/, function(a) {
				this.pushState('raw');
				return a;
			}],
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
	var table = {/* state num: 100 */
		nStart: 34,
		tSymbols: ["$", "!", "&&", "(", ")", "+", ",", "-", ".", "=", "[", "]", "boolean", "eq", "include", "mul", "number", "realId", "rel", "set", "string", "text", "{{", "{{#each", "{{#forin", "{{#if", "{{/each}}", "{{/forin}}", "{{/if}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "args", "elsepart", "epsilon", "expr", "id", "name", "program", "statement", "statements"],
		tAction: [{ _: -2 }, { _: -32768 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 30: 8, _: -1 }, { _: -13 }, { 1: 10, 3: 11, 7: 12, 12: 13, 14: 14, 16: 15, 17: 16, 19: 17, 20: 18, _: 0 }, { 1: 10, 3: 11, 7: 12, 12: 13, 14: 14, 16: 15, 17: 16, 19: 30, 20: 18, _: 0 }, { _: -3 }, { _: -22 }, { _: -19 }, { _: -21 }, { _: -17 }, { 14: 14, 17: 16, 19: 30, _: -18 }, { _: -20 }, { 5: 39, 7: 40, _: -40 }, { 13: 41, _: -44 }, { 2: 42, _: -46 }, { 31: 43, _: -48 }, { 3: 44, 8: 45, 10: 46, _: -32 }, { 15: 47, _: -37 }, { _: -25 }, { 18: 48, _: -42 }, { _: -35 }, { 32: 49, _: 0 }, { _: -23 }, { _: -18 }, { 14: 14, 17: 16, 19: 30, 20: 50, _: 0 }, { 32: 54, _: 0 }, { 33: 55, _: 0 }, { _: -33 }, { 4: 56, _: 0 }, { _: -34 }, { 9: 57, _: 0 }, { 1: 10, 3: 11, 7: 12, 12: 13, 14: 14, 16: 15, 17: 16, 19: 30, 20: 18, _: -49 }, { 14: 14, 17: 16, 19: 30, _: 0 }, { _: -11 }, { _: -15 }, { _: -16 }, { 14: 14, 17: 16, 19: 30, 20: 50, _: -49 }, { _: -12 }, { _: -24 }, { 15: 47, _: -38 }, { 15: 47, _: -39 }, { 18: 48, _: -43 }, { 13: 41, _: -45 }, { 2: 42, _: -47 }, { 4: 76, 6: 77, _: 0 }, { 4: 78, _: 0 }, { _: -30 }, { _: -26 }, { 11: 79, _: 0 }, { _: -36 }, { 5: 39, 7: 40, _: -41 }, { 32: 80, _: 0 }, { 32: 81, _: 0 }, { 32: 82, _: 0 }, { 32: 83, _: 0 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 29: 84, 30: 8, _: -49 }, { 32: 87, _: 0 }, { _: -29 }, { _: -28 }, { _: -27 }, { 28: 94, _: 0 }, { 28: 95, _: 0 }, { _: -10 }, { _: -31 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 26: 96, 30: 8, _: 0 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 26: 97, 30: 8, _: 0 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 27: 98, 30: 8, _: 0 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 27: 99, 30: 8, _: 0 }, { 21: 3, 22: 4, 23: 5, 24: 6, 25: 7, 30: 8, _: -14 }, { _: -5 }, { _: -4 }, { _: -6 }, { _: -7 }, { _: -8 }, { _: -9 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 5, 5, 6, 5, 5, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 5, 5, 5, 5, 5, 32, 33, 5, 5, 5, 34, 35, 36, 37, 37, 0, 38, 39, 5, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 5, 59, 60, 0, 0, 0, 0, 0, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
		tGoto: [{ 15: 1, 17: 2 }, , { 16: 9 }, , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 28, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 31, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 32, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 33, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 34, 13: 29 }, , { 4: 23, 6: 25, 8: 35, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 36, 13: 29 }, { 4: 23, 6: 25, 8: 37, 13: 29 }, , , , , { 13: 38 }, , , , , , , , , , , , , , { 13: 51, 14: 52 }, { 13: 51, 14: 53 }, , , , , , , { 4: 23, 5: 58, 6: 25, 8: 27, 13: 29 }, { 4: 23, 5: 59, 6: 25, 8: 27, 13: 29 }, { 0: 19, 4: 23, 5: 24, 6: 25, 7: 60, 8: 27, 13: 29 }, { 0: 19, 1: 61, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 13: 29 }, { 0: 19, 1: 20, 2: 62, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 13: 29 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 9: 63, 11: 64, 12: 65, 13: 29 }, { 13: 66 }, { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 67, 13: 29 }, { 4: 23, 6: 25, 8: 68, 13: 29 }, { 0: 69, 4: 23, 5: 24, 6: 25, 8: 27, 13: 29 }, , , , { 11: 70, 13: 51, 14: 71 }, { 11: 72, 13: 51, 14: 73 }, { 17: 74 }, , , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 75, 13: 29 }, , , , , , , , , , , , , , , , , { 10: 85, 11: 86, 16: 9 }, , , { 0: 19, 1: 20, 2: 21, 3: 22, 4: 23, 5: 24, 6: 25, 7: 26, 8: 27, 12: 88, 13: 29 }, , , { 17: 89 }, { 17: 90 }, { 17: 91 }, { 17: 92 }, { 17: 93 }, , , , , { 16: 9 }, { 16: 9 }, { 16: 9 }, { 16: 9 }, { 16: 9 }],
		tRules: [[52, 49], [49, 51], [51], [51, 51, 50], [50, 25, 46, 32, 51, 45, 28], [50, 25, 46, 32, 51, 44, 28], [50, 23, 46, 48, 45, 32, 51, 26], [50, 23, 46, 48, 48, 32, 51, 26], [50, 24, 46, 48, 45, 32, 51, 27], [50, 24, 46, 48, 48, 32, 51, 27], [50, 22, 19, 47, 9, 46, 32], [50, 22, 46, 32], [50, 30, 46, 33], [50, 21], [44, 29, 51], [48, 20], [48, 47], [47, 17], [47, 19], [47, 14], [40, 20], [40, 16], [40, 12], [40, 47], [40, 3, 46, 4], [38, 40], [38, 38, 8, 47], [38, 38, 10, 46, 11], [38, 38, 3, 45, 4], [38, 38, 3, 43, 4], [43, 46], [43, 43, 6, 46], [42, 38], [42, 1, 42], [42, 7, 42], [39, 42], [39, 39, 15, 42], [34, 39], [34, 34, 5, 39], [34, 34, 7, 39], [41, 34], [41, 41, 18, 34], [35, 41], [35, 35, 13, 41], [36, 35], [36, 36, 2, 35], [37, 36], [37, 37, 31, 36], [46, 37], [45]],
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
			function $f4($1, $2, $3, $4) {
				var $$; $$ = $1 + '(' + ($3 || '') + ')'; return $$;
			}
			function $f5($1, $2, $3) {
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
			}, $f4, $f4, function($1) {
				var $$; $$ = $1; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = $1 + ',' + $3; return $$;
			}, , function($1, $2) {
				var $$; $$ = '!' + $2; return $$;
			}, function($1, $2) {
				var $$; $$ = '- ' + $2; return $$;
			}, , $f5, , $f5, function($1, $2, $3) {
				var $$; $$ = $1 + '- ' + $3; return $$;
			}, , $f5, , $f5, , $f5, , $f5];
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
	s += 'for(var ' + keyName +
		(a5 ? '=0;' + keyName + '<' + listName + '.length; ++' + keyName
			: ' in ' + listName)
	+ '){var ' + a4 + ' = ' + listName + '[' + keyName + '];' + a2 + '}';
	return s;
}

function compile(s) {
	i_tmake = 0;
	return parse(Lexer(s));
}
var Crox = {
	compile: compile,
	render: function(s, data) {
		return compile(s)(data);
	}
};

return Crox;});