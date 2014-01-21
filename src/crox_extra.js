/// <reference path="crox_js.js"/>
/// <reference path="codegen_php.js"/>
/// <reference path="codegen_vm.js"/>
Crox.compileToPhp = function(s) {
	/// <summary>返回编译后的 php 函数</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_php_wrap(codegen_php_tran(parsetmpl(s)));
};
Crox.compileToVM = function(s, currentPath) {
	/// <summary>返回编译后的 VM 模板</summary>
	/// <param name="s" type="String"></param>
	/// <returns type="String" />
	return codegen_vm_tran(parsetmpl(s));
};
