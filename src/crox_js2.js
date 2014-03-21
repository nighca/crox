function compile2jsfn(s) {
	return parse(Lexer(s));
}
var Crox = {
	compile: compile2jsfn,
	render: function(s, data) {
		var fn = compile2jsfn(s);
		return fn(data);
	}
};
