const Breakpoints = (function () {
    "use strict"
    var info = {
        version: "1.0.5",
    }
    //
    return {
        defaults: {
            // Extra small devices (phones)
            xs: {
                min: 0,
                max: 767,
            },
            // Small devices (tablets)
            sm: {
                min: 768,
                max: 991,
            },
            // Medium devices (desktops)
            md: {
                min: 992,
                max: 1199,
            },
            // Large devices (large desktops)
            lg: {
                min: 1200,
                max: Infinity,
            },
            
        },
        
    }
})()
