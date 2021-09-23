_log = (function (undefined) {
    var Log = Error
    Log.prototype.write = function (args) {
        
        var suffix = {
            "@": (this.lineNumber
                ? this.fileName + ":" + this.lineNumber + ":1" // add arbitrary column value for chrome linking
                : extractLineNumberFromStack(this.stack)
            ),
        }
        
        args = args.concat([suffix])
        // via @paulirish console wrapper
        if (console && console.log) {
            if (console.log.apply) { console.log.apply(console, args) } else { console.log(args) } // nicer display in some browsers
        }
    }
    
    var extractLineNumberFromStack = function (stack) {
        
        var line = stack.split("\n")[3]
        
        line = (line.indexOf(" (") >= 0
            ? line.split(" (")[1].substring(0, line.length - 1)
            : line.split("at ")[1]
        )
        return line
    }
    
    return function (params) {
        /// <summary>
        /// Paulirish-like console.log wrapper
        /// </summary>
        /// <param name="params" type="[...]">list your logging parameters</param>
        
        // only if explicitly true somewhere
        if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) {
            return
        }
        
        // call handler extension which provides stack trace
        Log().write(Array.prototype.slice.call(arguments, 0)) // turn into proper array
    }//--	fn	_log
    
})()
