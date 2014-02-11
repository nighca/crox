    Crox.version = '%VERSION%';
    return Crox;
})();

if (typeof module == "object" && module && typeof module.exports == "object") {
    module.exports = Crox;
} else if (typeof define == "function" && (define.amd || define.cmd)) {
    define(function() {
        return Crox; 
    });
} else if (typeof KISSY != "undefined") {
    KISSY.add(function(){
        return Crox;
    });
}
if (root) {
    root.Crox = Crox; 
}

})(this);