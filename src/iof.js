
function readFile(fname, charset) {
	var s;
	var stm = new ActiveXObject("ADODB.Stream");
	stm.type = 2;
	//stm.mode = 1;
	stm.charset = charset || 'utf-8';
	stm.open();
	//try {
	stm.loadFromFile(fname);
	//} catch (e) { alert(fname); throw e; }
	s = stm.readtext();
	stm.close();
	return s;
}
function saveFile(fname, s, charset) {
	var stm = new ActiveXObject("ADODB.Stream");
	stm.type = 2;
	stm.mode = 3;
	stm.charset = charset || 'utf-8';
	stm.open();
	stm.writetext(s);
	stm.saveToFile(fname, 2);
	stm.close();
	removeBOM(fname);
}

function removeBOM(fname) {
	var stm = new ActiveXObject("ADODB.Stream");
	stm.type = 1;
	stm.open();
	stm.loadFromFile(fname);
	if (stm.size < 3) {
		stm.close();
		return;
	}

	var bin = stm.read(3);

	var stm2 = new ActiveXObject("ADODB.Stream");
	stm2.type = 1;
	stm2.open();
	stm2.write(bin);
	stm2.position = 0;
	stm2.type = 2;
	stm2.charset = "iso-8859-1";
	var s = stm2.readtext();
	stm2.close();

	if (s.charCodeAt(0) == 0xEF && s.charCodeAt(1) == 0xBB && s.charCodeAt(2) == 0xBF) {
		stm.position = 3;
		stm2 = new ActiveXObject("ADODB.Stream");
		stm2.type = 1;
		stm2.open();
		if (!stm.EOS)
			stm2.write(stm.read());
		stm.close();
		stm2.saveToFile(fname, 2);
		stm2.close();
	}
	else {
		stm.close();
	}
}
