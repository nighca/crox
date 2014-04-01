var i_tmake = 0;
function TMake() {
	return '_' + (i_tmake++);
}
function makeLoop(a1, a2, a3, a4, a5) {
	var s = '';
	var keyName = a3 ? encodeCommonName(a3) : TMake();
	var sExpr = a1;
	if (/^\w+$/.test(sExpr)) {
		var listName = sExpr;
	}
	else {
		listName = TMake();
		s = ('var ' + listName + ' = ' + sExpr + ';');
	}
	s += 'for(var ' + keyName +
		(a5 ? '=0;' + keyName + '<' + listName + '.length; ++' + keyName
			: ' in ' + listName)
	+ '){var ' + a4 + ' = ' + listName + '[' + keyName + '];' + a2 + '}';
	return s;
}
