function precompile(root) {
	var fso = new ActiveXObject('Scripting.FileSystemObject');

	function readFile(s) {
		var stm = new ActiveXObject('ADODB.Stream');
		stm.Type = 2;
		stm.Mode = 3;
		stm.Charset = 'utf-8';
		stm.Open();
		stm.LoadFromFile(s);
		if (!stm.EOS)
			var r = stm.ReadText();
		stm.Close();
		return r || '';
	}
	function inArr(a, s) {
		for (var i = 0; i < a.length; ++i)
			if (a[i] == s)
				return i;
		return -1;
	}
	function formatPath(s) {
		if (!fso.FileExists(s))
			throw Error("file not exists: " + s);
		return fso.GetFile(s).Path;
	}

	var includeReg = /\{\{\s*include\s+("[^"]+"|'[^']+')\s*\}\}/g;

	function _precompile(root, tmpl, stack) {
		return tmpl.replace(includeReg, function(includeStmt, included) {
			var tplPath = fso.BuildPath(fso.GetParentFolderName(root), included.slice(1, -1));
			tplPath = formatPath(tplPath);
			if (inArr(stack, tplPath) != -1) {
				throw Error('[Crox] Circular dependency detected: ' + stack.join(' --> '));
			}
			stack.push(tplPath);

			var content = readFile(tplPath);
			var result = _precompile(tplPath, content, stack);

			stack.pop();
			return result;
		});
	}
	root = formatPath(root);
	return _precompile(root, readFile(root), [root]);
}
