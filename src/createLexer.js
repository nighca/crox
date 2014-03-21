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
