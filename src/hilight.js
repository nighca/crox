/// <reference path="common.js"/>
/// <reference path="createLexer.js"/>
/// <reference path="lexer.js"/>
function hilight_crox(s) {
	/// <param name="s" type="String">Crox 模板</param>
	/// <returns type="String" />
	s = String(s);
	var lex = Lexer(s);
	var t = '';
	var a = [];
	while ((t = lex.scan()).tag != '$') {
		switch (t.tag) {
			case '{{':
			case '}}':
			case '{{{':
			case '}}}':
				a.push(t.text.bold());
				break;
			case 'string':
				a.push(htmlEncode(t.text).fontcolor('#A31515'));
				break;
			case 'if':
			case 'else':
			case 'elseif':
			case 'each':
			case 'as':
				a.push(t.text.fontcolor('blue'));
				break;
			default:
				if (t.text.charAt(0) == '#')
					a.push(t.text.fontcolor('blue'));
				else {
					a.push(htmlEncode(t.text));
				}
		}
	}
	return a.join('');
}
function hilight_json(s) {
	/// <param name="s" type="String">JSON</param>
	/// <returns type="String" />
	function isArray(t) {
		return Object.prototype.toString.call(t) == '[object Array]';
	}
	function encode(a) {
		switch (typeof a) {
			case 'string':
				return htmlEncode(quote(a)).fontcolor('#A31515');
			case 'number':
				if (!isNaN(a) && isFinite(a))
					return String(a);
				break;
			case 'boolean':
				return String(a).fontcolor('blue');
			case 'object':
				if (!a) break;
				var r = [], i;
				if (isArray(a)) {
					for (i = 0; i < a.length; ++i)
						r[i] = encode(a[i]);
					return '[' + r.join() + ']';
				}
				else {
					for (i in a) {
						switch (typeof a[i]) {
							case 'function':
							case 'undefined':
								continue;
						}
						r.push(htmlEncode(quote(i)) + ':' + encode(a[i]));
					}
					return '{' + r.join() + '}';
				}
		}
		return 'null'.fontcolor('blue');
	}
	return encode(JSON.parse(s));
}
