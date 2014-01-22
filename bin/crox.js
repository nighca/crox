#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program = require('commander');
var crox = require('../build/nodejs/crox');
var iconv = require('iconv-lite');
var shelljs = require('shelljs');

program
    .option('-p, --package-path [packagePath]', 'Set crox package path', '.')
    .option('-e, --encoding [encoding]', 'Set template file encoding', 'utf-8')
    .option('--target-type [targetType]', 'Setting the target template type [php|js|vm]', 'js')
    .option('--tpl-suffix [tplSuffix]', 'Set template suffix [tpl]', 'tpl')
    .option('-o, --output [dir]', 'Set the output directory for compiled template', '.')
    .parse(process.argv);

if (process.argv.length === 2) {
  program.help();
  process.exit(0);
}

var args = program.args;
var cwd = process.cwd();
var packagePath = path.resolve(cwd, program.packagePath);
var outputPath = path.resolve(cwd, program.output);
var encoding = program.encoding;
var targetType = program.targetType;
var tplSuffixReg = new RegExp('\\.' + program.tplSuffix + '$');

var sources = getSources(packagePath);

if (args.length === 1) {
  if (tplSuffixReg.test(args[0])) {
    sources = [path.resolve(cwd, args[0])];
  } else {
    sources = getSources(path.resolve(cwd, args[0]));
  }
}

sources.forEach(function(source) {
  var targetFile = getTarget(source);
  var buf = fs.readFileSync(source);
  var tpl;
  var tplFn;

  if (/gb(2312|k)/.test(encoding)) {
    tpl = iconv.decode(buf, encoding);
  } else {
    tpl = buf.toString();
  }

  if (targetType === 'php') {
    tplFn = crox.compileToPhp(tpl);
  } else if (targetType == 'vm') {
    tplFn = crox.compileToVM(tpl);
  } else {
    tplFn = crox.compile(tpl);
  }

  if (/gb(2312|k)/.test(encoding)) {
    tplFn = iconv.encode(tplFn, encoding);
  }

  fs.writeFileSync(targetFile, tplFn);
  console.info('compile ' + source + ' to ' + targetFile);
});

console.info('compile success!')

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