/// <reference path="codegen_js.js"/>
function compile2jsfn(s) {
	return codegen_js_tofn(parse(Lexer(s)));
}
var Crox = {
	compile: function(s) {
		return compile2jsfn(s);
	},
	compileToStr: function(s) {
		return codegen_js_tran(parse(Lexer(s)));
	},
	render: function(s, data) {
		return compile2jsfn(s)(data);
	}
};
