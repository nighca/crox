<?php ?><div>
<h2>start</h2>
<?php echo crox_encode($crox_root->a);?>fdafda
fdasfdas

<h3>import sub tmpls</h3>
<p>
<?php include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'b.php';?>
<?php include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'c.php';?>
<?php include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'd/d.php';?>
</p>
</div><?php ?>