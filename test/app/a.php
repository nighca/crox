<?php 
function temp($i_root) {
function isNumber($a) { return is_float($a) || is_int($a); }
function plus($a, $b) {if (isNumber($a) && isNumber($b)) {	return $a + $b;}else {	return ToString($a) . ToString($b);}}
function logical_and($a, $b) { return $a ? $b : $a; }
function logical_or($a, $b) { return $a ? $a : $b; }
function ToString($a) {
	if (is_string($a)) return $a;
	if (isNumber($a)) return (string)$a;
	if (is_bool($a)) return $a ? 'true' : 'false';
	if (is_null($a)) return 'null';
	if (is_array($a)) {
		$s = '';
		for ($i = 0; $i < count($a); ++$i) {
			if ($i > 0) $s .= ',';
			if (!is_null($a[$i]))
				$s .= ToString($a[$i]);
		}
		return $s;
	}
	return '[object Object]';
}
function ToBoolean($a) {
	if (is_string($a)) return strlen($a) > 0;
	if (is_array($a) || is_object($a)) return true;
	return (bool)$a;
}
$t_r = '';
$t_r .= '<div>
<h2>start</h2>
';
$t_r .= htmlspecialchars(ToString($i_root->a), ENT_COMPAT, 'GB2312');
$t_r .= '
fdasfdas

<h3>import sub tmpls</h3>
<p>
';
$t_r .= '
';
$t_r .= '
';
$t_r .= '
</p>
</div>';
return $t_r;
}
?>