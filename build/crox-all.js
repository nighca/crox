/**
 * @preserve Crox v1.3.1
 * https://github.com/thx/crox
 *
 * Released under the MIT license
 * md5: 8da2a66f77bf4c724bc022772a8cc33d
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
			[/{\*/, function(a) {
				this.pushState('{*');
				return a;
			}],
			[/(?:(?!{{|{\*|\*})[\s\S])+/, function(a) {
				return 'text';
			}],
			[/{{{/, function(a) {
				this.pushState(a);
				return a;
			}],
			[/{{(?:\/if|else|\/each|\/forin|\/raw)}}/, function(a) {
				return a;
			}],
			[/\*}/, function(a) {
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
		]),
		'{*': [
			[/(?:(?!\*})[\s\S])+/, function(a) {
				this.popState();
				return 'commenttext';
			}]
		]
	});
	return Lexer;
}();

var parse = function() {
var table = {/* state num: 119 */
nStart: 40,
tSymbols: ["$","!","&&","(",")","*}","+",",","-",".","=","[","]","boolean","commenttext","eq","include","mul","number","rawtext","realId","rel","set","string","text","{*","{{","{{#each","{{#forin","{{#if","{{#raw}}","{{/each}}","{{/forin}}","{{/if}}","{{/raw}}","{{else}}","{{{","||","}}","}}}","AdditiveExpression","EqualityExpression","LogicalAndExpression","LogicalOrExpression","MemberExpression","MultiplicativeExpression","PrimaryExpression","RelationalExpression","UnaryExpression","_text","args","assign","assigns","epsilon","expr","id","name","program","statement","statements","texts"],
tAction: [{_:-2},{_:-32768},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,36:10,_:-1},{_:-23},{14:14,_:0},{1:15,3:16,8:17,13:18,16:19,18:20,20:21,22:22,23:23,_:0},{1:15,3:16,8:17,13:18,16:35,18:20,20:21,22:36,23:23,_:0},{19:40,_:0},{_:-21},{_:-3},{24:3,25:4,30:9,_:-13},{5:43,_:0},{_:-31},{23:47,_:-28},{_:-30},{_:-26},{16:35,20:21,22:36,_:-27},{_:-29},{6:49,8:50,_:-49},{15:51,_:-53},{2:52,_:-55},{37:53,_:-57},{3:54,9:55,11:56,_:-41},{17:57,_:-46},{_:-34},{21:58,_:-51},{_:-44},{38:59,_:0},{_:-32},{_:-28},{_:-27},{16:35,20:21,22:36,23:60,_:0},{38:64,_:0},{34:65,_:0},{39:66,_:0},{_:-22},{_:-25},{_:-42},{4:67,_:0},{_:-43},{16:35,20:21,22:36,_:-58},{10:72,_:0},{1:15,3:16,8:17,13:18,16:35,18:20,20:21,22:36,23:23,_:-58},{16:35,20:21,22:36,_:0},{_:-11},{_:-19},{_:-20},{16:35,20:21,22:36,23:60,_:-58},{_:-24},{_:-12},{_:-33},{_:-16},{7:90,38:91,_:0},{38:92,_:0},{10:93,_:0},{17:57,_:-47},{17:57,_:-48},{21:58,_:-52},{15:51,_:-54},{2:52,_:-56},{4:95,7:96,_:0},{4:97,_:0},{_:-39},{_:-35},{12:98,_:0},{_:-45},{6:49,8:50,_:-50},{38:99,_:0},{38:100,_:0},{38:101,_:0},{38:102,_:0},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,33:103,35:104,36:10,_:0},{_:-15},{_:-14},{38:107,_:0},{_:-38},{_:-37},{_:-36},{_:-4},{_:-17},{_:-18},{_:-10},{_:-40},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,31:114,36:10,_:0},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,31:115,36:10,_:0},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,32:116,36:10,_:0},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,32:117,36:10,_:0},{24:3,25:4,26:5,27:6,28:7,29:8,30:9,33:118,36:10,_:0},{_:-6},{_:-7},{_:-8},{_:-9},{_:-5}],
actionIndex: [0,1,2,3,4,5,6,6,6,7,6,8,9,10,11,6,6,6,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,31,32,33,34,35,36,37,38,39,40,41,6,6,6,6,6,42,43,6,6,6,44,45,46,47,47,0,48,49,50,51,52,53,54,6,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,43,72,73,6,74,75,6,76,77,0,0,0,0,78,0,79,80,81,82,83,84,85,86,87,88,89,90,91,92],
tGoto: [{17:1,19:2},,{9:11,18:12,20:13},,,{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:33,15:34},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:37,15:34},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:38,15:34},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:39,15:34},,{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:41,15:34},,,{9:42},,{4:28,6:30,8:44,15:34},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:45,15:34},{4:28,6:30,8:46,15:34},,,,,{15:48},,,,,,,,,,,,,,,{15:61,16:62},{15:61,16:63},,,,,,,,,{11:68,12:69,13:70,15:71},,{4:28,5:73,6:30,8:32,15:34},{4:28,5:74,6:30,8:32,15:34},{0:24,4:28,5:29,6:30,7:75,8:32,15:34},{0:24,1:76,4:28,5:29,6:30,7:31,8:32,15:34},{0:24,1:25,2:77,4:28,5:29,6:30,7:31,8:32,15:34},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,10:78,13:79,14:80,15:34},{15:81},{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:82,15:34},{4:28,6:30,8:83,15:34},{0:84,4:28,5:29,6:30,8:32,15:34},,,,{13:85,15:61,16:86},{13:87,15:61,16:88},{19:89},,,,,,,,{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:94,15:34},,,,,,,,,,,,,,,,,{9:11,18:12,20:13},{11:105,15:71},,,{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:106,15:34},,,{0:24,1:25,2:26,3:27,4:28,5:29,6:30,7:31,8:32,14:108,15:34},,,{19:109},{19:110},{19:111},{19:112},,{19:113},,,,,{9:11,18:12,20:13},{9:11,18:12,20:13},{9:11,18:12,20:13},{9:11,18:12,20:13},{9:11,18:12,20:13}],
tRules: [[61,57],[57,59],[59],[59,59,58],[58,29,54,38,59,33],[58,29,54,38,59,35,59,33],[58,27,54,56,53,38,59,31],[58,27,54,56,56,38,59,31],[58,28,54,56,53,38,59,32],[58,28,54,56,56,38,59,32],[58,26,22,55,10,54,38],[58,26,54,38],[58,36,54,39],[58,60],[58,26,16,23,53,38],[58,26,16,23,52,38],[52,51],[52,52,7,51],[51,55,10,54],[56,23],[56,55],[60,49],[60,60,49],[49,24],[49,30,19,34],[49,25,14,5],[55,20],[55,22],[55,16],[46,23],[46,18],[46,13],[46,55],[46,3,54,4],[44,46],[44,44,9,55],[44,44,11,54,12],[44,44,3,53,4],[44,44,3,50,4],[50,54],[50,50,7,54],[48,44],[48,1,48],[48,8,48],[45,48],[45,45,17,48],[40,45],[40,40,6,45],[40,40,8,45],[47,40],[47,47,21,40],[41,47],[41,41,15,47],[42,41],[42,42,2,41],[43,42],[43,43,37,42],[54,43],[53]],
tFuncs: function() {
function $f0($1,$2,$3,$4,$5,$6,$7
/**/) {
var $$; $$ = ['each', $2, $6, $4, $3, true]; return $$;
}
function $f1($1,$2,$3,$4,$5,$6,$7
/**/) {
var $$; $$ = ['each', $2, $6, $4, $3, false]; return $$;
}
function $f2($1,$2,$3,$4,$5
/**/) {
var $$; $$ = ['inc', evalStr($3.text), $4]; return $$;
}
function $f3($1
/**/) {
var $$; $$ = [$1]; return $$;
}
function $f4($1
/**/) {
var $$; $$ = $1.text; return $$;
}
function $f5($1,$2,$3,$4
/**/) {
var $$; $$ = ['()', $1, $3]; return $$;
}
function $f6($1,$2,$3
/**/) {
var $$; $$ = [$2.text, $1, $3]; return $$;
}
return[,function($1
/**/) {
var $$; $$ = ['prog', $1]; return $$;
},function() {
var $$; $$ = []; return $$;
},function($1,$2
/**/) {
var $$; $1.push($2); $$ = $1; return $$;
},function($1,$2,$3,$4,$5
/**/) {
var $$; $$ = ['if', $2, $4]; return $$;
},function($1,$2,$3,$4,$5,$6,$7
/**/) {
var $$; $$ = ['if', $2, $4, $6]; return $$;
},$f0,$f0,$f1,$f1,function($1,$2,$3,$4,$5,$6
/**/) {
var $$; $$ = ['set', $3.text, $5]; return $$;
},function($1,$2,$3
/**/) {
var $$; $$ = ['eval', $2, false]; return $$;
},function($1,$2,$3
/**/) {
var $$; $$ = ['eval', $2, true]; return $$;
},function($1
/**/) {
var $$; $$ = ['text', $1]; return $$;
},$f2,$f2,$f3,function($1,$2,$3
/**/) {
var $$; $$ = $1.concat([$3]); return $$;
},function($1,$2,$3
/**/) {
var $$; $$ = [$1.text, $3]; return $$;
},function($1
/**/) {
var $$; $$ = evalStr($1.text); return $$;
},$f4,function($1
/**/) {
var $$; $$ = $1; return $$;
},function($1,$2
/**/) {
var $$; $$ = $1 + $2; return $$;
},$f4,function($1,$2,$3
/**/) {
var $$; $$ = $2.text; return $$;
},function($1,$2,$3
/**/) {
var $$; $$ = ''; return $$;
},,,,function($1
/**/) {
var $$; $$ = ['lit', evalStr($1.text)]; return $$;
},function($1
/**/) {
var $$; $$ = ['lit', evalNum($1.text)]; return $$;
},function($1
/**/) {
var $$; $$ = ['lit', $1.text == 'true']; return $$;
},function($1
/**/) {
var $$; $$ = ['id', $1.text]; return $$;
},function($1,$2,$3
/**/) {
var $$; $$ = $2; return $$;
},,function($1,$2,$3
/**/) {
var $$; $$ = ['.', $1, $3.text]; return $$;
},function($1,$2,$3,$4
/**/) {
var $$; $$ = ['[]', $1, $3]; return $$;
},$f5,$f5,$f3,function($1,$2,$3
/**/) {
var $$; ($$ = $1).push($3); return $$;
},,function($1,$2
/**/) {
var $$; $$ = ['!', $2]; return $$;
},function($1,$2
/**/) {
var $$; $$ = ['u-', $2]; return $$;
},,$f6,,$f6,$f6,,$f6,,$f6,,$f6,,$f6];}()
};
return function(a){function c(a,b){return g[a][b]}for(var d=a.nStart,f=a.tSymbols,b={},e=0;e<f.length;++e)b[f[e]]=e;var g=a.tAction,p=a.tGoto,h=a.tRules,n=a.tFuncs,
m=a.actionIndex;m&&(c=function(a,b){var c=g[m[a]];return c[b]||c._});return function(a,e){function g(b){throw Error("Syntax error: "+a.getPos(l.index)+(b?"\n"+b:""));}var m=0,B=[0],l=a.scan(),v=[],r={get:function(a){return v[v.length+a]},set:function(a,b){v[v.length+a]=b}};if(e)for(var y in e)r[y]=e[y];for(;;)if(y=c(m,b[l.tag]))if(0<y)B.push(m=y),v.push(l),l=a.scan();else if(0>y&&-32768<y){y=-y;var m=h[y],t=m.length-1;B.length-=t;m=p[B[B.length-1]][m[0]-d];B.push(m);n[y]?(y=n[y].apply(r,v.splice(v.length-
t,t)),v.push(y)):1!=t&&v.splice(v.length-t,t,null)}else return l.tag!=f[0]&&g(),v[0];else{y=[];for(t=0;t<d;++t)c(m,t)&&y.push(f[t]);g("find "+l.tag+"\nexpect "+y.join(" "))}}}(table);
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
function codegen_js_tran(prog, encodeName, defaultEncode) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="encodeName" type="String"></param>
	/// <param name="defaultEncode" type="Boolean"></param>
	/// <returns type="String" />

	var i_tmake = 0;
	function TMake() {
		return '_' + (i_tmake++);
	}

	function emit(s) {
		body += s;
	}

	function stmtGen(a) {
		switch (a[0]) {
			case 'if':
				emit('if(' + exprGen(a[1]) + '){');
				stmtsGen(a[2]);
				emit('}');
				if (a[3]) {
					emit('else{');
					stmtsGen(a[3]);
					emit('}');
				}
				break;
			case 'each':
				var keyName = a[3] ? encodeCommonName(a[3]) : TMake();
				var sExpr = exprGen(a[1]);
				if (/^\w+$/.test(sExpr)) {
					var listName = sExpr;
				}
				else {
					listName = TMake();
					emit('var ' + listName + ' = ' + sExpr + ';');
				}
				if (a[5]) emit('for(var ' + keyName + '=0;' + keyName + '<' + listName + '.length;' + keyName + '++){');
				else emit('for(var ' + keyName + ' in ' + listName + ') {');
				emit('var ' + a[4] + ' = ' + listName + '[' + keyName + '];');
				stmtsGen(a[2]);
				emit('}');
				break;
			case 'set':
				emit('var ' + encodeCommonName(a[1]) + '=' + exprGen(a[2]) + ';');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (/^\w+$/.test(s))
					var tName = s;
				else {
					tName = '_t';
					emit('_t = ' + s + ';');
				}
				emit('if(' + tName + ' !=null)_s += ' + ((defaultEncode ? !a[2] : a[2]) ? encodeName + '(' + tName + ')' : tName) + ';');
				break;
			case 'text':
				emit('_s += ' + quote(a[1]) + ';');
				break;
			case 'inc':
				var assigns = a[2] || [];
				switch (a[1]) {
					case 'start':
						emit('(function(root){');
						break;
					case 'end':
						emit('})({');
						emit(assigns.map(function (assign) {
							return '"' + encodeCommonName(assign[0]) + '": ' + exprGen(assign[1]);
						}).join(', '));
						emit('});');
						break;
					default:
						throw Error('unknown inc type: ' + a[1]);
				}
				break;
			case 'comment': break;
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
				return encodeCommonName(x[1]);
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
				return 'crox.helpers[\'' + exprToStr(x[1], isMember) + '\'](' + a.join(',') + ')';
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
	var encodeName;
	if (config) encodeName = config.htmlEncode;
	s = codegen_js_tran(ast, encodeName || '_htmlEncode', true);
	var body = '';
	if (!encodeName)
		body = "var _obj = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '\"': '&quot;' };\
	function _htmlEncode(s) {\
		return String(s).replace(/[<>&\"]/g, function(c) {\
			return _obj[c];\
		});\
	}";
	body += "var _t,_s = '';" + s + "return _s;";

	var f = Function('root', body);
	return f;
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
function codegen_php_tran(prog, defaultEncode) {
	/// <param name="prog" type="Array">AST</param>
	/// <param name="defaultEncode" type="Boolean"></param>
	/// <returns type="String" />

	//用户变量名 都奇数个下划线开头
	function encodeId(s) {
		return '$crox_' + encodeCommonName(s);
	}
	function emit(t) {
		s += t;
	}
	function compileEval(stmt) {
		var t = walkExpr(stmt[1]);
		emit('crox_echo(' + t + ', ' + (defaultEncode ? !stmt[2] : stmt[2]) + ');');
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
		emit('foreach(' + walkExpr(stmt[1]) + ' as ' + (stmt[3] ? encodeId(stmt[3]) + '=>' : '') + encodeId(stmt[4]) + ')');
		emit('{');
		compileStmts(stmt[2]);
		emit('}');
	}
	function compileSet(stmt) {
		emit(encodeId(stmt[1]) + ' = ' + walkExpr(stmt[2]) + ';');
	}
	function compileInc(stmt) {
		var path = stmt[1];
		var assigns = stmt[2] || [];
		var names = [];
		var vals = [];
		assigns.forEach(function (assign) {
			var name = encodeId(assign[0]);
			var val = walkExpr(assign[1]);
			names.push(name);
			vals.push(val);
		});
		emit('$crox_include = function ($crox_root) {');
		emit('include dirname(__FILE__) . \'/' + changeExt(path, 'php') + '\';');
		emit('};');
		emit('$crox_params = array(')
		assigns.forEach(function (assign) {
			emit('"' + assign[0] + '" => ' + walkExpr(assign[1]) + ',');
		});
		emit(');');
		emit('$crox_include($crox_params);')
	}
	function compileStmt(a) {
		switch (a[0]) {
			case 'if': compileIf(a); break;
			case 'each': compileEach(a); break;
			case 'set': compileSet(a); break;
			case 'eval': compileEval(a); break;
			case 'text': compileContent(a); break;
			case 'inc': compileInc(a); break;
			case 'comment': console.log('xxx'); break;
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
				return encodeId(x[1]);
			case 'lit':
				if (typeof x[1] == 'string')
					return phpQuote(x[1]);
				return String(x[1]);
			case '.':
				//return exprToStr(x[1], isMember) + "->" + x[2];
				return 'crox_getProperty(' + exprToStr(x[1], isMember) + ", '" + x[2] + "')";
			case '[]':
				return exprToStr(x[1], isMember) + '[' + walkExpr(x[2]) + ']';
			case '()':
				return exprToStr(x[1], isMember) + '(' + (x[2] || []).map(walkExpr).join(', ') + ')'; 
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
function codegen_vm_tran(prog) {
	/// <param name="prog" type="Array">AST</param>
	/// <returns type="String" />

	//用户变量名 都奇数个下划线开头，临时变量都不下划线开头
	function encodeId(s) {
		return '$crox_' + encodeCommonName(s);
	}
	function isName(s) {
		return /^$\w+$/.test(s);
	}
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
				var sExpr = exprGen(a[1]);
				if (isName(sExpr))
					var listName = sExpr;
				else {
					listName = '$list' + (i_each == 1 ? '' : i_each);
					emit('#set (' + listName + ' = ' + sExpr + ')');
				}
				if (a[5]) { //array
					emit('#foreach(' + encodeId(a[4]) + ' in ' + listName + ')');
					if (a[3]) {
						emit('#set(' + encodeId(a[3]) + ' = $velocityCount - 1)');
					}
				}
				else { //object
					if (a[3]) {
						emit('#foreach(' + encodeId(a[3]) + ' in ' + listName + '.keySet())');
						emit('#set(' + encodeId(a[4]) + ' =' + listName + '.get(' + encodeId(a[3]) + '))');
					}
					else {
						emit('#foreach(' + encodeId(a[4]) + ' in ' + listName + ')');
					}
				}
				stmtsGen(a[2]);
				emit('#{end}');
				--i_each;
				break;
			case 'set':
				emit('#set (' + encodeId(a[1]) + '=' + exprGen(a[2]) + ')');
				break;
			case 'eval':
				var s = exprGen(a[1]);
				if (isName(s))
					emit('$!{' + s.slice(1) + '}');
				else {
					emit('#set($t = ' + s + ')$!{t}');
				}
				break;
			case 'text':
				emit(a[1].replace(/\$/g, '$${dollar}').replace(/#/g, '$${sharp}'));
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

	function exprToStr(x, check) {
		var t = exprGen(x);
		if (check && !check(x[0])) t = '(' + t + ')';
		return t;
	}
	function exprGen(x) {
		switch (x[0]) {
			case 'id':
				return encodeId(x[1]);
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
	return codegen_php_tran(parsetmpl(s), true);
};
Crox.compileToVM = function(s, currentPath) {
	/// <summary>返回编译后的 VM 模板</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_vm_tran(parsetmpl(s));
};

Crox.version = "1.3.1";return Crox;})();if ( typeof module == "object" && module && typeof module.exports == "object" ) module.exports = Crox;else if (typeof define == "function" && (define.amd || define.cmd) ) define(function () { return Crox; } );else if (typeof KISSY != "undefined") KISSY.add(function(){ return Crox; });if (root) root.Crox = Crox; })(this);