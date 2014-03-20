var gccPath = "D:\\gcc\\compiler.jar";
(function() {
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	if (!fso.FileExists(gccPath))
		gccPath = gccPath.replace('D', 'E');
})();
var phpPath = "E:\\php\\php.exe";
var velocityPath = "E:\\velocity-1.7\\";
var testPath = "E:\\github\\crox.git\\trunk\\test\\";
