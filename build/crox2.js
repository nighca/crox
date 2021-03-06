/**
 * @preserve Crox v1.3.1
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 1e0f9b0f7a405f75d1c5e792e2357346
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
	var table = {/* state num: 107 */
		nStart: 37,
		tSymbols: ["$", "!", "&&", "(", ")", "+", ",", "-", ".", "=", "[", "]", "boolean", "eq", "include", "mul", "number", "rawtext", "realId", "rel", "set", "string", "text", "{{", "{{#each", "{{#forin", "{{#if", "{{#raw}}", "{{/each}}", "{{/forin}}", "{{/if}}", "{{/raw}}", "{{else}}", "{{{", "||", "}}", "}}}", "AdditiveExpression", "EqualityExpression", "LogicalAndExpression", "LogicalOrExpression", "MemberExpression", "MultiplicativeExpression", "PrimaryExpression", "RelationalExpression", "UnaryExpression", "_text", "args", "epsilon", "expr", "id", "name", "program", "statement", "statements", "texts"],
		tAction: [{ _: -2 }, { _: -32768 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 33: 9, _: -1 }, { _: -19 }, { 1: 13, 3: 14, 7: 15, 12: 16, 14: 17, 16: 18, 18: 19, 20: 20, 21: 21, _: 0 }, { 1: 13, 3: 14, 7: 15, 12: 16, 14: 33, 16: 18, 18: 19, 20: 34, 21: 21, _: 0 }, { 17: 38, _: 0 }, { _: -17 }, { _: -3 }, { 22: 3, 27: 8, _: -13 }, { _: -26 }, { 21: 44, _: -23 }, { _: -25 }, { _: -21 }, { 14: 33, 18: 19, 20: 34, _: -22 }, { _: -24 }, { 5: 46, 7: 47, _: -44 }, { 13: 48, _: -48 }, { 2: 49, _: -50 }, { 34: 50, _: -52 }, { 3: 51, 8: 52, 10: 53, _: -36 }, { 15: 54, _: -41 }, { _: -29 }, { 19: 55, _: -46 }, { _: -39 }, { 35: 56, _: 0 }, { _: -27 }, { _: -23 }, { _: -22 }, { 14: 33, 18: 19, 20: 34, 21: 57, _: 0 }, { 35: 61, _: 0 }, { 31: 62, _: 0 }, { 36: 63, _: 0 }, { _: -18 }, { _: -37 }, { 4: 64, _: 0 }, { _: -38 }, { 35: 65, _: 0 }, { 9: 66, _: 0 }, { 1: 13, 3: 14, 7: 15, 12: 16, 14: 33, 16: 18, 18: 19, 20: 34, 21: 21, _: -53 }, { 14: 33, 18: 19, 20: 34, _: 0 }, { _: -11 }, { _: -15 }, { _: -16 }, { 14: 33, 18: 19, 20: 34, 21: 57, _: -53 }, { _: -20 }, { _: -12 }, { _: -28 }, { _: -14 }, { 15: 54, _: -42 }, { 15: 54, _: -43 }, { 19: 55, _: -47 }, { 13: 48, _: -49 }, { 2: 49, _: -51 }, { 4: 85, 6: 86, _: 0 }, { 4: 87, _: 0 }, { _: -34 }, { _: -30 }, { 11: 88, _: 0 }, { _: -40 }, { 5: 46, 7: 47, _: -45 }, { 35: 89, _: 0 }, { 35: 90, _: 0 }, { 35: 91, _: 0 }, { 35: 92, _: 0 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 30: 93, 32: 94, 33: 9, _: 0 }, { 35: 95, _: 0 }, { _: -33 }, { _: -32 }, { _: -31 }, { _: -4 }, { _: -10 }, { _: -35 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 28: 102, 33: 9, _: 0 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 28: 103, 33: 9, _: 0 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 29: 104, 33: 9, _: 0 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 29: 105, 33: 9, _: 0 }, { 22: 3, 23: 4, 24: 5, 25: 6, 26: 7, 27: 8, 30: 106, 33: 9, _: 0 }, { _: -6 }, { _: -7 }, { _: -8 }, { _: -9 }, { _: -5 }],
		actionIndex: [0, 1, 2, 3, 4, 5, 5, 5, 6, 5, 7, 8, 9, 5, 5, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 5, 5, 5, 5, 5, 39, 40, 5, 5, 5, 41, 42, 43, 44, 44, 0, 45, 46, 47, 48, 5, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 5, 68, 69, 0, 0, 0, 0, 70, 0, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82],
		tGoto: [{ 15: 1, 17: 2 }, , { 9: 10, 16: 11, 18: 12 }, , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 31, 13: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 35, 13: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 36, 13: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 37, 13: 32 }, , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 39, 13: 32 }, , , { 9: 40 }, { 4: 26, 6: 28, 8: 41, 13: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 42, 13: 32 }, { 4: 26, 6: 28, 8: 43, 13: 32 }, , , , , { 13: 45 }, , , , , , , , , , , , , , , { 13: 58, 14: 59 }, { 13: 58, 14: 60 }, , , , , , , , , , { 4: 26, 5: 67, 6: 28, 8: 30, 13: 32 }, { 4: 26, 5: 68, 6: 28, 8: 30, 13: 32 }, { 0: 22, 4: 26, 5: 27, 6: 28, 7: 69, 8: 30, 13: 32 }, { 0: 22, 1: 70, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 13: 32 }, { 0: 22, 1: 23, 2: 71, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 13: 32 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 10: 72, 11: 73, 12: 74, 13: 32 }, { 13: 75 }, { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 76, 13: 32 }, { 4: 26, 6: 28, 8: 77, 13: 32 }, { 0: 78, 4: 26, 5: 27, 6: 28, 8: 30, 13: 32 }, , , , { 11: 79, 13: 58, 14: 80 }, { 11: 81, 13: 58, 14: 82 }, { 17: 83 }, , , , , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 84, 13: 32 }, , , , , , , , , , , , , , , , , { 9: 10, 16: 11, 18: 12 }, , , { 0: 22, 1: 23, 2: 24, 3: 25, 4: 26, 5: 27, 6: 28, 7: 29, 8: 30, 12: 96, 13: 32 }, , , { 17: 97 }, { 17: 98 }, { 17: 99 }, { 17: 100 }, , { 17: 101 }, , , { 9: 10, 16: 11, 18: 12 }, { 9: 10, 16: 11, 18: 12 }, { 9: 10, 16: 11, 18: 12 }, { 9: 10, 16: 11, 18: 12 }, { 9: 10, 16: 11, 18: 12 }],
		tRules: [[56, 52], [52, 54], [54], [54, 54, 53], [53, 26, 49, 35, 54, 30], [53, 26, 49, 35, 54, 32, 54, 30], [53, 24, 49, 51, 48, 35, 54, 28], [53, 24, 49, 51, 51, 35, 54, 28], [53, 25, 49, 51, 48, 35, 54, 29], [53, 25, 49, 51, 51, 35, 54, 29], [53, 23, 20, 50, 9, 49, 35], [53, 23, 49, 35], [53, 33, 49, 36], [53, 55], [53, 23, 14, 21, 35], [51, 21], [51, 50], [55, 46], [55, 55, 46], [46, 22], [46, 27, 17, 31], [50, 18], [50, 20], [50, 14], [43, 21], [43, 16], [43, 12], [43, 50], [43, 3, 49, 4], [41, 43], [41, 41, 8, 50], [41, 41, 10, 49, 11], [41, 41, 3, 48, 4], [41, 41, 3, 47, 4], [47, 49], [47, 47, 6, 49], [45, 41], [45, 1, 45], [45, 7, 45], [42, 45], [42, 42, 15, 45], [37, 42], [37, 37, 5, 42], [37, 37, 7, 42], [44, 37], [44, 44, 19, 37], [38, 44], [38, 38, 13, 44], [39, 38], [39, 39, 2, 38], [40, 39], [40, 40, 34, 39], [49, 40], [48]],
		tFuncs: function() {
			function $f0($1, $2) {
				var $$; $$ = $1 + $2; return $$;
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
			function $f4($1) {
				var $$; $$ = $1; return $$;
			}
			function $f5($1, $2, $3, $4) {
				var $$; $$ = $1 + '(' + ($3 || '') + ')'; return $$;
			}
			function $f6($1, $2, $3) {
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
			}, $f0, function($1, $2, $3, $4, $5) {
				var $$; $$ = 'if(' + $2 + '){' + $4 + '}'; return $$;
			}, function($1, $2, $3, $4, $5, $6, $7) {
				var $$; $$ = 'if(' + $2 + '){' + $4 + '}else{' + $6 + '}'; return $$;
			}, $f1, $f1, $f2, $f2, function($1, $2, $3, $4, $5, $6) {
				var $$; $$ = 'var ' + encodeCommonName($3.text) + '=' + $5 + ';'; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '_print(' + $2 + ',1);'; return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '_print(' + $2 + ');'; return $$;
			}, function($1) {
				var $$; $$ = '_print(' + quote($1) + ');'; return $$;
			}, function($1, $2, $3, $4) {
				var $$; throw Error("unimplemented: include"); return $$;
			}, function($1) {
				var $$; $$ = evalStr($1.text); return $$;
			}, $f3, $f4, $f0, $f3, function($1, $2, $3) {
				var $$; $$ = $2.text; return $$;
			}, , , , $f3, $f3, $f3, function($1) {
				var $$; $$ = encodeCommonName($1.text); return $$;
			}, function($1, $2, $3) {
				var $$; $$ = '(' + $2 + ')'; return $$;
			}, , function($1, $2, $3) {
				var $$; $$ = $1 + '.' + $3; return $$;
			}, function($1, $2, $3, $4) {
				var $$; $$ = $1 + '[' + $3 + ']'; return $$;
			}, $f5, $f5, $f4, function($1, $2, $3) {
				var $$; $$ = $1 + ',' + $3; return $$;
			}, , function($1, $2) {
				var $$; $$ = '!' + $2; return $$;
			}, function($1, $2) {
				var $$; $$ = '- ' + $2; return $$;
			}, , $f6, , $f6, function($1, $2, $3) {
				var $$; $$ = $1 + '- ' + $3; return $$;
			}, , $f6, , $f6, , $f6, , $f6];
		}()
	};
	return function(a) {
		function c(a, b) { return g[a][b] } for (var d = a.nStart, f = a.tSymbols, b = {}, e = 0; e < f.length; ++e) b[f[e]] = e; var g = a.tAction, p = a.tGoto, h = a.tRules, n = a.tFuncs,
		m = a.actionIndex; m && (c = function(a, b) { var c = g[m[a]]; return c[b] || c._ }); return function(a, e) {
			function g(b) { throw Error("Syntax error: " + a.getPos(l.index) + (b ? "\n" + b : "")); } var m = 0, B = [0], l = a.scan(), v = [], r = { get: function(a) { return v[v.length + a] }, set: function(a, b) { v[v.length + a] = b } }; if (e) for (var y in e) r[y] = e[y]; for (; ;) if (y = c(m, b[l.tag])) if (0 < y) B.push(m = y), v.push(l), l = a.scan(); else if (0 > y && -32768 < y) {
				y = -y; var m = h[y], t = m.length - 1; B.length -= t; m = p[B[B.length - 1]][m[0] - d]; B.push(m); n[y] ? (y = n[y].apply(r, v.splice(v.length -
				t, t)), v.push(y)) : 1 != t && v.splice(v.length - t, t, null)
			} else return l.tag != f[0] && g(), v[0]; else { y = []; for (t = 0; t < d; ++t) c(m, t) && y.push(f[t]); g("find " + l.tag + "\nexpect " + y.join(" ")) }
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