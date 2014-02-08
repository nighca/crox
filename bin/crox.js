#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var crox = require('../build/crox-all');
var iconv = require('iconv-lite');
var shelljs = require('shelljs');
var chokidar = require('chokidar');
var jsBeautify = require('js-beautify').js_beautify;
var CroxUtils = require('./helper');

program
    .option('-p, --package-path [packagePath]', 'Set crox package path', '.')
    .option('-e, --encoding [encoding]', 'Set template file encoding', 'utf-8')
    .option('-t, --target-type [targetType]', 'Setting the target template type [php|vm|js]', 'js')
    .option('-x, --tpl-suffix [tplSuffix]', 'Set template suffix [tpl]', 'tpl')
    .option('-o, --output [dir]', 'Set the output directory for compiled template', '.')
    .option('-w, --watch', 'Watch crox template file change')
    .option('-k, --kissy', 'Compile crox template file to Kissy module')
    .option('-f, --kissyfn', 'Compile crox template file to Kissy fn module')
    .parse(process.argv);

if (process.argv.length === 2) {
  program.help();
  process.exit(0);
}

var args = program.args;
var cwd = process.cwd();
var packagePath = path.resolve(cwd, program.packagePath);
var output = program.packagePath != '.' && program.output == '.' ? program.packagePath : program.output;
var outputPath = path.resolve(cwd, output);
var encoding = program.encoding;
var targetType = program.targetType;
var tplSuffixReg = new RegExp('\\.' + program.tplSuffix + '$');


var subcommand = process.argv[2];

if (subcommand == 'build') {
  // build
}

if (program.watch) {
    watchTplFileChange();
} else {
    compileAllFiles();
}

function compileAllFiles() {
  var sources = getSources(packagePath);
  
  if (args.length === 1) {
    if (tplSuffixReg.test(args[0])) {
      sources = [path.resolve(cwd, args[0])];
    } else {
      sources = getSources(path.resolve(cwd, args[0]));
    }
  }

  sources.forEach(function(source) {
    var target = getTarget(source);
    if (targetType == 'js') {
      target = target.replace('.' + targetType, '.' + program.tplSuffix + '.' + targetType)
    }
    doCompile(source, target);
  });

  console.info('[Crox] Compile success! ' + sources.length + ' files compiled');
}

function watchTplFileChange() {
  var watcher = chokidar.watch(packagePath, {
      ignored: /^\./, 
      persistent: true
    });

    watcher
      .on('add', watching)
      .on('change', watching);
    watcher.close();
}

function doJsBeautify(str) {
    var opts = {
        "indent_size": 4,
        "indent_char": " ",
        "indent_level": 0,
        "indent_with_tabs": false,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "jslint_happy": false,
        "brace_style": "collapse",
        "keep_array_indentation": false,
        "keep_function_indentation": false,
        "space_before_conditional": true,
        "break_chained_methods": false,
        "eval_code": false,
        "unescape_strings": false
    };
    return jsBeautify(str, opts);
}

function watching(filePath) {
    var modulePath;
    if (!tplSuffixReg.test(filePath)) {
      return;
    }
    modulePath = filePath + '.' + targetType;
    doCompile(filePath, modulePath);
}

function doCompile(source, targetFile) {
  var buf = fs.readFileSync(source);
  var tpl;
  var result;

  if (/gb(2312|k)/.test(encoding)) {
    tpl = iconv.decode(buf, encoding);
  } else {
    tpl = buf.toString();
  }

  if (targetType === 'php') {
    result = '<?php \n' + crox.compileToPhp(tpl) + '\n?>';
  } else if (targetType == 'vm') {
    result = crox.compileToVM(tpl);
  } else {
    // js 
    if (!program.kissy && !program.kissyfn) {
      result = doJsBeautify(crox.compile(tpl).toString());
    } else if (program.kissyfn) {
      // compile to kissy fn
      result = doJsBeautify(CroxUtils.compileToKissyFn(source));
    } else {
      // compile to kissy module, replace requires
      result = doJsBeautify(CroxUtils.compileToKissy(source));
    }
  }

  if (/gb(2312|k)/.test(encoding)) {
    result = iconv.encode(result, encoding);
  }

  fs.writeFileSync(targetFile, result);
  console.info('[Crox] ' + source + ' --> ' + targetFile);
}

function getTarget(source) {
  var targetFile = source.replace(tplSuffixReg, '.' + targetType);
  targetFile = path.join(outputPath, path.relative(packagePath, targetFile));

  shelljs.mkdir('-p', path.dirname(targetFile));
  return targetFile;
}

function getSources(file, sources) {
  var sources = sources || [];

  if (!fs.existsSync(file)) return sources;

  if (fs.statSync(file).isFile()) {
    if (tplSuffixReg.test(file)) {
      sources.push(file)
    }
    return sources;
  } else if (fs.statSync(file).isDirectory()){
    fs.readdirSync(file).forEach(function(f) {
      return getSources(path.join(file, f), sources);
    })
  }

  return sources;
}
