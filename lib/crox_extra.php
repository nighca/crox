<?php
function crox_isNumber($a) { return is_float($a) || is_int($a); }
function crox_plus($a, $b) {
	if (crox_isNumber($a) && crox_isNumber($b)) {
		return $a + $b;
	}else {
		return crox_ToString($a) . crox_ToString($b);
	}
}
function crox_logical_and($a, $b) { return $a ? $b : $a; }
function crox_logical_or($a, $b) { return $a ? $a : $b; }
function crox_ToString($a) {
	if (is_string($a)) return $a;
	if (crox_isNumber($a)) return (string)$a;
	if (is_bool($a)) return $a ? 'true' : 'false';
	if (is_null($a)) return 'null';
	if (is_array($a)) {
		$s = '';
		for ($i = 0; $i < count($a); ++$i) {
			if ($i > 0) $s .= ',';
			if (!is_null($a[$i]))
				$s .= crox_ToString($a[$i]);
		}
		return $s;
	}
	return '[object Object]';
}
function crox_ToBoolean($a) {
	if (is_string($a)) return strlen($a) > 0;
	if (is_array($a) || is_object($a)) return true;
	return (bool)$a;
}
function crox_echo($s, $e) {
	if (!is_null($s)) {
		$s = crox_ToString($s);
		if ($e) $s = htmlspecialchars($s, ENT_COMPAT, 'GB2312');
		echo $s;
	}
}
?>
