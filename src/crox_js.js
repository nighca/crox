/// <reference path="codegen_js.js"/>
function parsetmpl(s) {
	/// <summary>解析模板，得到语法树</summary>
	/// <param name="s" type="String">模板</param>
	var ast = parse(Lexer(s));
	return ast;
}
function compile2jsfn(s) {
	/// <summary>编译模板，得到一个 js 函数</summary>
	/// <param name="s" type="String">模板</param>
	/// <returns type="Function" />
	var ast = parsetmpl(s);
	return codegen_js_tofn(ast);
}
var Crox = {
	parse: parsetmpl,
	compile: compile2jsfn,
	compileToJs: function(s) {
		/// <summary>返回编译后的 js 代码</summary>
		/// <param name="s" type="String"></param>
		/// <returns type="String" />
		return codegen_js_tran(parsetmpl(s));
	},
	render: function(s, data) {
		/// <summary>将数据 data 填充到模板 s</summary>
		/// <param name="s" type="String">模板</param>
		/// <returns type="String" />
		var fn = compile2jsfn(s);
		return fn(data);
	}
};
