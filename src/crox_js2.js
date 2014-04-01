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
