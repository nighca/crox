function AutoPath(s) {
	var fso = new ActiveXObject('Scripting.FileSystemObject');
	if (!fso.FileExists(s) && !fso.FolderExists(s))
		s = s.replace('D', 'E');
	return s;
}
var gccPath = AutoPath("D:\\gcc\\compiler.jar");
var phpPath = AutoPath("D:\\php\\php.exe");
var velocityPath = AutoPath("D:\\velocity-1.7\\");
var fcivPath = AutoPath("D:\\fciv.exe");
