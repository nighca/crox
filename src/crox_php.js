/// <reference path="crox_js.js"/>
/// <reference path="codegen_php.js"/>
Crox.compileToPhp = function(s) {
	return codegen_php_wrap(codegen_php_tran(parse(Lexer(s))));
};
