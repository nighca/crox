if (!this.JSON) this.JSON = {
	stringify: function(value) {
		/// <returns type="String" />
		function fn_esc(a) {
			switch (a) {
				case '"': return '\\"';
				case '\\': return '\\\\';
				case '\b': return '\\b';
				case '\f': return '\\f';
				case '\n': return '\\n';
				case '\r': return '\\r';
				case '\t': return '\\t';
			}
			a = a.charCodeAt(0).toString(16);
			while (a.length < 4) a = '0' + a;
			return '\\u' + a;
		}
		function quote(s) {
			return '"' + s.replace(/[\x00-\x1f\x22\\\u007f-\uffff]/g, function(a) {
				switch (a) {
					case '"': return '\\"';
					case '\\': return '\\\\';
					case '\b': return '\\b';
					case '\f': return '\\f';
					case '\n': return '\\n';
					case '\r': return '\\r';
					case '\t': return '\\t';
				}
				a = a.charCodeAt(0).toString(16);
				while (a.length < 4) a = '0' + a;
				return '\\u' + a;
			}) + '"';
		}
		function inArray(a, b) {
			for (var i = 0; i < a.length; ++i)
				if (a[i] === b) return i;
			return -1;
		}
		function encode(a, b) {
			switch (typeof a) {
				case 'string':
					return quote(a);
				case 'number':
					if (a !== a // isNaN
						|| !isFinite(a)) break;
				case 'boolean':
					return a + '';
				case 'object':
					if (!a) break;
					if (b) {
						if (inArray(b, a) > -1)
							throw Error('Converting circular structure to JSON');
						b = b.slice(0);
					}
					else b = [];
					b.push(a);
					var r = [], i;
					if (a instanceof Array) {
						for (i = 0; i < a.length; ++i)
							r[i] = encode(a[i], b);
						return '[' + r.join() + ']';
					}
					else {
						for (i in a) {
							switch (typeof a[i]) {
								case 'function':
								case 'undefined':
									continue;
							}
							r.push(quote(i) + ':' + encode(a[i], b));
						}
						return '{' + r.join() + '}';
					}
			}
			return 'null';
		}

		return encode(value);
	},

	parse: function() {
		function skipWhites() {
			var c;
			while ((c = s.charAt(i)) && "\t\r\n ".indexOf(c) > -1)
				++i;
		}
		function isDigit(c) {
			return c >= '0' && c <= '9';
		}
		function match(t) {
			if (s.substr(i, t.length) != t)
				throw 1;
			i += t.length;
		}
		var es = { b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
		function parseString() {
			var value = '';
			var c;
			while (c = s.charAt(++i)) {
				switch (c) {
					case '"':
						++i;
						return value;
					case '\\':
						switch (c = s.charAt(++i)) {
							case '"':
							case '/':
							case '\\':
								value += c;
								break;
							case 'b':
							case 'f':
							case 'n':
							case 'r':
							case 't':
								value += es[c];
								break;
							case 'u':
								var t = '';
								for (var j = 0; j < 4; ++j) {
									c = s.charAt(++i);
									if (isDigit(c)
										|| c >= 'A' && c <= 'F'
										|| c >= 'a' && c <= 'f')
										t += c;
									else throw 1;
								}
								value += String.fromCharCode('0x' + t);
								break;
							default:
								throw 1;
						}
						break;
					default:
						if (c >= '\x20') value += c;
						else throw 1;
				}
			}
		}

		function parseNumber() {
			var c = s.charAt(i);
			var j = i;
			if (c == '-')
				c = s.charAt(++i);

			if (!isDigit(c)) throw 1;
			if (c == '0') c = s.charAt(++i);
			else {
				while (isDigit(c = s.charAt(++i)))
					;
			}

			if (c == '.') {
				c = s.charAt(++i);
				if (!isDigit(c)) throw 1;
				while (isDigit(c = s.charAt(++i)))
					;
			}

			if (c == 'e' || c == 'E') {
				c = s.charAt(++i);
				if (c == '+' || c == '-')
					c = s.charAt(++i);

				if (!isDigit(c)) throw 1;
				while (isDigit(s.charAt(++i)))
					;
			}

			return +s.substring(j, i);
		}
		function parseArray() {
			++i;
			skipWhites();
			var a = [];
			if (s.charAt(i) == ']')
				++i;
			else {
				do {
					a.push(parse());
					skipWhites();
					if (s.charAt(i) == ']') {
						++i;
						break;
					}
					match(',');
				} while (true);
			}
			return a;
		}
		function parseObject() {
			++i;
			skipWhites();
			var obj = {};
			if (s.charAt(i) == '}')
				++i;
			else {
				do {
					if (s.charAt(i) != '"')
						throw 1;
					var k = parseString();
					skipWhites();
					match(':');
					obj[k] = parse();
					skipWhites();
					if (s.charAt(i) == '}') {
						++i;
						break;
					}
					match(',');
					skipWhites();
				} while (true);
			}
			return obj;
		}
		function parse() {
			skipWhites();
			var c = s.charAt(i);
			switch (c) {
				case '{':
					return parseObject();
				case '[':
					return parseArray();
				case '"':
					return parseString();
				case 't':
					match('true');
					return true;
				case 'f':
					match('false');
					return false;
				case 'n':
					match('null');
					return null;
				default:
					if (c == '-' || isDigit(c))
						return parseNumber();
					throw 1;
			}
		}
		var i;
		var s;

		return function(_s) {
			i = 0;
			s = _s;
			var r = parse();
			skipWhites();
			if (i < s.length)
				throw 1;
			s = '';
			return r;
		};
	}()
};
