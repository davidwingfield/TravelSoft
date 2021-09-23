(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define("PageAside", ["exports", "jquery", "Component"], factory)
    } else if (typeof exports !== "undefined") {
        factory(exports, require("jquery"), require("Component"))
    } else {
        var mod = {
            exports: {},
        }
        factory(mod.exports, global.jQuery, global.Component)
        global.SectionPageAside = mod.exports
    }
})(this, function (exports, _jquery, Select2) {
    "use strict"
    
    var $BODY = (0, $)("body")
    console.log($BODY.height())
    
    //return PageAside
    
})

