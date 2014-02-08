var kissy = require('kissy');

var crox = require('../../build/crox-all');

global.KISSY = kissy;

KISSY.add('crox', function(S) {
    return crox;
});

KISSY.config({
    packages:[{
        name: 'app',
        combine: false,
        path:'../',
        debug: true,
        tag: new Date().getTime()
    }]
});

KISSY.use('app/a.tpl', function(S, tmp) {
    var fn = tmp.fn;
    console.log(fn({
        a: '<h2>fdafad</h2>', 
        b: 2,
        c: 2322
    }));
})