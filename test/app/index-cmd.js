require('seajs');

seajs.use('./a.tpl', function(fn) {
    console.log(fn({
        a: '<h2>fdafad</h2>', 
        b: 2,
        c: 2322
    }));
});