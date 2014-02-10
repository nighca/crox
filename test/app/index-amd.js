var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs(['./a.tpl'], function (fn) {
    console.log(fn({
        a: '<h2>fdafad</h2>', 
        b: 2,
        c: 2322
    }));
});